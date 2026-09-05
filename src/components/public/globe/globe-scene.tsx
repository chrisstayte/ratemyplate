'use client';

import { useEffect, useRef } from 'react';
import type { ExpressionSpecification, Map as MapLibreMap, MapLayerMouseEvent } from 'maplibre-gl';
import { MapMarker, MarkerContent, MarkerTooltip, useMap } from '@/components/ui/map';
import type { GlobeStateActivity, GlobeView } from './globe-experience';

const initializedMaps = new WeakSet<MapLibreMap>();

// Real meridians and parallels stay attached to the globe while it rotates.
const graticule = {
  type: 'FeatureCollection' as const,
  features: [
    ...Array.from({ length: 24 }, (_, i) =>
      Array.from({ length: 85 }, (_, j) => [-180 + i * 15, -84 + j * 2])
    ),
    ...Array.from({ length: 11 }, (_, i) =>
      Array.from({ length: 181 }, (_, j) => [-180 + j * 2, -75 + i * 15])
    ),
  ].map((coordinates) => ({
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'LineString' as const, coordinates },
  })),
};

export function getOverviewZoom(map: MapLibreMap) {
  const { clientWidth: width, clientHeight: height } = map.getContainer();
  return width < 768
    ? Math.max(0.7, Math.min(height < 700 ? 0.8 : 1.65, 1.65 + Math.log2(width * 0.82 / 510)))
    : height < 650 ? 1.85 : 2.05;
}

export default function GlobeScene({
  activity,
  initialView,
  spinning,
  selectedAbbreviation,
  onSelectState,
  onUserViewportChange,
  onReady,
}: {
  activity: GlobeStateActivity[];
  initialView?: GlobeView;
  spinning: boolean;
  selectedAbbreviation: string | null;
  onSelectState: (abbreviation: string) => void;
  onUserViewportChange: (view: GlobeView) => void;
  onReady: () => void;
}) {
  const { map, isLoaded } = useMap();
  const userPauseUntil = useRef(0);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const maxReports = Math.max(...activity.map((state) => state.reportCount), 1);
    const fillStops = activity.flatMap((state) => [
      state.abbreviation,
      `rgba(151, 168, 133, ${0.28 + (state.reportCount / maxReports) * 0.4})`,
    ]);
    const fillColor = fillStops.length
      ? ['match', ['get', 'STUSPS'], ...fillStops, 'rgba(132, 144, 121, 0.06)'] as unknown as ExpressionSpecification
      : 'rgba(132, 144, 121, 0.06)';

    // Recolor only this map instance; the standard map keeps its own theme.
    for (const layer of map.getStyle().layers) {
      if (layer.type === 'background') map.setPaintProperty(layer.id, 'background-color', '#353b34');
      if (layer.type === 'fill' && /^(landcover|landuse|park)/.test(layer.id)) {
        map.setPaintProperty(layer.id, 'fill-color', '#353b34');
      }
      if (layer.id === 'water') map.setPaintProperty(layer.id, 'fill-color', '#1a201e');
      if (layer.id === 'boundary_country_outline') map.setPaintProperty(layer.id, 'line-opacity', 0);
      if (layer.id === 'boundary_country_inner') map.setPaintProperty(layer.id, 'line-color', '#555f50');
      if (layer.type === 'symbol') {
        map.setPaintProperty(layer.id, 'text-color', '#99a18e');
        map.setPaintProperty(layer.id, 'text-halo-color', '#222922');
        map.setPaintProperty(layer.id, 'text-opacity', ['interpolate', ['linear'], ['zoom'], 2, 0, 3, 0.6, 5, 0.85]);
      }
    }
    map.setProjection({ type: 'globe' });
    map.setSky({
      'sky-color': 'rgba(18, 21, 18, 0)',
      'horizon-color': 'rgba(164, 177, 150, 0.32)',
      'fog-color': '#20251f',
      'fog-ground-blend': 0.5,
      'horizon-fog-blend': 0.25,
      'sky-horizon-blend': 0.6,
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0.7, 0.55, 2, 0.5, 4, 0.18, 6, 0],
    });

    map.addSource('globe-grid', { type: 'geojson', data: graticule });
    map.addLayer({
      id: 'globe-grid', type: 'line', source: 'globe-grid',
      paint: { 'line-color': '#a5b199', 'line-width': 0.5, 'line-opacity': 0.13 },
    });
    map.addSource('globe-states', { type: 'geojson', data: '/data/us-states.geojson' });
    map.addLayer({
      id: 'globe-states-fill', type: 'fill', source: 'globe-states',
      paint: { 'fill-color': fillColor, 'fill-opacity': 0.9 },
    });
    map.addLayer({
      id: 'globe-states-outline', type: 'line', source: 'globe-states',
      paint: { 'line-color': '#929d85', 'line-width': 0.7, 'line-opacity': 0.48 },
    });
    map.addLayer({
      id: 'globe-state-glow', type: 'line', source: 'globe-states',
      filter: ['==', ['get', 'STUSPS'], ''],
      paint: { 'line-color': '#c5cdb6', 'line-width': 7, 'line-blur': 6, 'line-opacity': 0.4 },
    });
    map.addLayer({
      id: 'globe-state-selected', type: 'line', source: 'globe-states',
      filter: ['==', ['get', 'STUSPS'], ''],
      paint: { 'line-color': '#e0dcc5', 'line-width': 1.3 },
    });

    const handleStateClick = (event: MapLayerMouseEvent) => {
      const abbreviation = event.features?.[0]?.properties?.STUSPS as string | undefined;
      if (abbreviation && activity.some((state) => state.abbreviation === abbreviation)) onSelectState(abbreviation);
    };
    const handleMouseMove = (event: MapLayerMouseEvent) => {
      const abbreviation = event.features?.[0]?.properties?.STUSPS;
      map.getCanvas().style.cursor = activity.some((state) => state.abbreviation === abbreviation) ? 'pointer' : 'grab';
    };
    const handleMouseLeave = () => { map.getCanvas().style.cursor = 'grab'; };
    const handleViewportChange = () => {
      const center = map.getCenter();
      onUserViewportChange({ latitude: center.lat, longitude: center.lng, zoom: map.getZoom() });
    };
    const setResponsivePadding = () => {
      map.resize();
      const { clientWidth: width, clientHeight: height } = map.getContainer();
      map.setPadding(width >= 768
        ? { top: 40, right: 20, bottom: 90, left: Math.min(380, width * 0.3) }
        : { top: height < 700 ? 215 : 230, right: 0, bottom: 125, left: 0 });
    };
    setResponsivePadding();
    if (!initializedMaps.has(map)) {
      initializedMaps.add(map);
      map.jumpTo({ center: initialView ? [initialView.longitude, initialView.latitude] : [-98, 38], zoom: initialView?.zoom ?? getOverviewZoom(map) });
    }
    map.getCanvas().style.cursor = 'grab';
    map.on('click', 'globe-states-fill', handleStateClick);
    map.on('mousemove', 'globe-states-fill', handleMouseMove);
    map.on('mouseleave', 'globe-states-fill', handleMouseLeave);
    map.on('dragend', handleViewportChange);
    map.on('zoomend', handleViewportChange);
    const observer = new ResizeObserver(setResponsivePadding);
    observer.observe(map.getContainer());
    onReady();

    return () => {
      observer.disconnect();
      map.off('click', 'globe-states-fill', handleStateClick);
      map.off('mousemove', 'globe-states-fill', handleMouseMove);
      map.off('mouseleave', 'globe-states-fill', handleMouseLeave);
      map.off('dragend', handleViewportChange);
      map.off('zoomend', handleViewportChange);
      // The parent map can be disposed before this child during navigation.
      if (!map.getStyle()) return;
      for (const id of ['globe-state-selected', 'globe-state-glow', 'globe-states-outline', 'globe-states-fill', 'globe-grid']) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      for (const id of ['globe-states', 'globe-grid']) {
        if (map.getSource(id)) map.removeSource(id);
      }
    };
  }, [activity, initialView, isLoaded, map, onReady, onSelectState, onUserViewportChange]);

  useEffect(() => {
    if (!map || !isLoaded) return;
    for (const id of ['globe-state-glow', 'globe-state-selected']) {
      if (map.getLayer(id)) map.setFilter(id, ['==', ['get', 'STUSPS'], selectedAbbreviation ?? '']);
    }
  }, [isLoaded, map, selectedAbbreviation]);

  useEffect(() => {
    if (!map || !isLoaded || !spinning) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let previousFrame = performance.now();
    let frame: number;
    const pauseForInteraction = () => { userPauseUntil.current = performance.now() + 6500; };
    const events = ['mousedown', 'touchstart', 'dragstart', 'zoomstart', 'rotatestart'] as const;
    events.forEach((event) => map.on(event, pauseForInteraction));
    const rotate = (now: number) => {
      const elapsed = Math.min(now - previousFrame, 50);
      previousFrame = now;
      if (!reducedMotion.matches && !document.hidden && now > userPauseUntil.current && !map.isMoving()) {
        const center = map.getCenter();
        map.jumpTo({ center: [center.lng + elapsed * 0.00065, center.lat] });
      }
      frame = requestAnimationFrame(rotate);
    };
    frame = requestAnimationFrame(rotate);
    return () => {
      events.forEach((event) => map.off(event, pauseForInteraction));
      cancelAnimationFrame(frame);
    };
  }, [isLoaded, map, spinning]);

  return activity.map((state, index) => (
    <MapMarker
      key={state.abbreviation}
      subpixelPositioning
      longitude={state.longitude}
      latitude={state.latitude}
      accessibleLabel={`${state.name}: ${state.reportCount} ${state.reportCount === 1 ? 'report' : 'reports'}`}
      onClick={() => onSelectState(state.abbreviation)}
    >
      <MarkerContent>
        <span className={`globe-beacon ${selectedAbbreviation === state.abbreviation ? 'is-selected' : ''}`}>
          <span className="globe-beacon-halo" />
          <span className="globe-ping" style={{ animationDelay: `${(index % 8) * 320}ms` }} />
          <span className="globe-beacon-core" />
          <span className="globe-beacon-label">{state.abbreviation}</span>
        </span>
      </MarkerContent>
      <MarkerTooltip className="globe-tooltip">
        <strong>{state.name}</strong><span>{state.reportCount} {state.reportCount === 1 ? 'report' : 'reports'}</span>
      </MarkerTooltip>
    </MapMarker>
  ));
}
