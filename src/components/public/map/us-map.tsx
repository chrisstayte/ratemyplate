'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { Map, useMap, MapControls } from '@/components/ui/map';
import type { State } from '@/lib/us-states';
import StatePanel from './state-panel';
import type maplibregl from 'maplibre-gl';
import type { ExpressionSpecification } from 'maplibre-gl';

type StatePlateCount = {
  state: string;
  plateCount: number;
};

type USMapProps = {
  plateCountByState: StatePlateCount[];
  states: State[];
};

function getColor(count: number, max: number, dark: boolean): string {
  if (count === 0) return dark ? 'rgba(120, 120, 140, 0.12)' : 'rgba(160, 160, 160, 0.15)';
  const ratio = Math.min(count / Math.max(max, 1), 1);
  if (dark) {
    // Dark mode: subtle purple
    const r = Math.round(100 + ratio * 60);
    const g = Math.round(70 + ratio * 20);
    const b = Math.round(160 + ratio * 60);
    const a = 0.35 + ratio * 0.5;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  // Light mode: subtle purple
  const r = Math.round(170 - ratio * 50);
  const g = Math.round(150 - ratio * 80);
  const b = Math.round(210 - ratio * 20);
  const a = 0.4 + ratio * 0.45;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function StatesLayer({
  plateCountByState,
  states,
}: {
  plateCountByState: StatePlateCount[];
  states: State[];
}) {
  const { map, isLoaded } = useMap();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredStateId, setHoveredStateId] = useState<number | null>(null);
  const hoveredStateIdRef = useRef<number | null>(null);
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const countMap = new globalThis.Map<string, number>();
  plateCountByState.forEach((s) => countMap.set(s.state, s.plateCount));
  const maxCount = Math.max(...plateCountByState.map((s) => s.plateCount), 1);

  const stateNameMap = new globalThis.Map<string, string>();
  states.forEach((s) => stateNameMap.set(s.abbreviation, s.name));

  const selectedStateName = selectedState
    ? stateNameMap.get(selectedState) ?? selectedState
    : null;
  const selectedStateCount = selectedState
    ? countMap.get(selectedState) ?? 0
    : 0;

  const handleMapClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      if (!map) return;
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['states-fill'],
      });
      if (features.length > 0) {
        const abbr = features[0].properties?.STUSPS;
        if (abbr) {
          setSelectedState(abbr);
        }
      } else {
        setSelectedState(null);
      }
    },
    [map]
  );

  const handleMouseMove = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      if (!map) return;
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['states-fill'],
      });
      if (features.length > 0) {
        if (hoveredStateIdRef.current !== null) {
          map.setFeatureState(
            { source: 'us-states', id: hoveredStateIdRef.current },
            { hover: false }
          );
        }
        const id = features[0].id as number;
        hoveredStateIdRef.current = id;
        setHoveredStateId(id);
        map.setFeatureState(
          { source: 'us-states', id },
          { hover: true }
        );
        map.getCanvas().style.cursor = 'pointer';
      } else {
        if (hoveredStateIdRef.current !== null) {
          map.setFeatureState(
            { source: 'us-states', id: hoveredStateIdRef.current },
            { hover: false }
          );
        }
        hoveredStateIdRef.current = null;
        setHoveredStateId(null);
        map.getCanvas().style.cursor = '';
      }
    },
    [map]
  );

  const handleMouseLeave = useCallback(() => {
    if (!map) return;
    if (hoveredStateIdRef.current !== null) {
      map.setFeatureState(
        { source: 'us-states', id: hoveredStateIdRef.current },
        { hover: false }
      );
    }
    hoveredStateIdRef.current = null;
    setHoveredStateId(null);
    map.getCanvas().style.cursor = '';
  }, [map]);

  // Add source and layers once on load
  useEffect(() => {
    if (!isLoaded || !map) return;

    map.addSource('us-states', {
      type: 'geojson',
      data: '/data/us-states.geojson',
      generateId: true,
    });

    map.addLayer({
      id: 'states-fill',
      type: 'fill',
      source: 'us-states',
      paint: {
        'fill-color': 'rgba(160, 160, 160, 0.15)',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.9,
          0.7,
        ] as unknown as ExpressionSpecification,
      },
    });

    map.addLayer({
      id: 'states-border',
      type: 'line',
      source: 'us-states',
      paint: {
        'line-color': 'rgba(140, 140, 140, 0.3)',
        'line-width': 0.5,
      },
    });

    map.on('click', handleMapClick);
    map.on('mousemove', handleMouseMove);
    map.on('mouseleave', 'states-fill', handleMouseLeave);

    return () => {
      map.off('click', handleMapClick);
      map.off('mousemove', handleMouseMove);
      map.off('mouseleave', 'states-fill', handleMouseLeave);
      try {
        if (map.getLayer('states-border')) map.removeLayer('states-border');
        if (map.getLayer('states-fill')) map.removeLayer('states-fill');
        if (map.getSource('us-states')) map.removeSource('us-states');
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  // Update fill colors when theme changes
  useEffect(() => {
    if (!isLoaded || !map || !map.getLayer('states-fill')) return;

    const fillColorStops: (string | number)[] = [];
    states.forEach((s) => {
      const count = countMap.get(s.abbreviation) ?? 0;
      fillColorStops.push(s.abbreviation, getColor(count, maxCount, isDark));
    });

    map.setPaintProperty('states-fill', 'fill-color', [
      'match',
      ['get', 'STUSPS'],
      ...fillColorStops,
      isDark ? 'rgba(120, 120, 140, 0.12)' : 'rgba(160, 160, 160, 0.15)',
    ] as unknown as ExpressionSpecification);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map, isDark]);

  return (
    <>
      {selectedState && selectedStateName && (
        <StatePanel
          stateAbbreviation={selectedState}
          stateName={selectedStateName}
          plateCount={selectedStateCount}
          onClose={() => setSelectedState(null)}
        />
      )}
    </>
  );
}

export default function USMap({ plateCountByState, states }: USMapProps) {
  return (
    <div className='relative w-full h-[calc(100vh-4rem)]'>
      <Map
        center={[-98.5, 39.8]}
        zoom={3.5}
        minZoom={3}
        maxZoom={8}
        maxBounds={[
          [-175, 5],
          [-45, 80],
        ]}
        className='w-full h-full'
      >
        <MapControls position='bottom-right' showZoom />
        <StatesLayer
          plateCountByState={plateCountByState}
          states={states}
        />
      </Map>
    </div>
  );
}
