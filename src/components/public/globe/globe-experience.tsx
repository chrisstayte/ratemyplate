'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  LayoutDashboard,
  Pause,
  Play,
  Radio,
  X,
} from 'lucide-react';
import type {
  ExpressionSpecification,
  Map as MapLibreMap,
  MapLayerMouseEvent,
} from 'maplibre-gl';
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from '@/components/ui/map';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

export type GlobeStateActivity = {
  abbreviation: string;
  name: string;
  longitude: number;
  latitude: number;
  reportCount: number;
  plateCount: number;
  latestReportAt: string;
};

export type GlobeView = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type GlobeExperienceProps = {
  activity: GlobeStateActivity[];
  totalReports: number;
  totalPlates: number;
  initialView?: GlobeView;
};

const DEFAULT_GLOBE_ZOOM = 1.9;
const COMPACT_GLOBE_ZOOM = 1.35;
const DEFAULT_GLOBE_VIEW: GlobeView = {
  latitude: 38,
  longitude: -98,
  zoom: DEFAULT_GLOBE_ZOOM,
};
const initializedGlobeMaps = new WeakSet<MapLibreMap>();

function normalizeLongitude(longitude: number) {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

function formatCount(count: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(count);
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

function GlobeScene({
  activity,
  initialView,
  spinning,
  onSelectState,
  onUserViewportChange,
}: {
  activity: GlobeStateActivity[];
  initialView: GlobeView;
  spinning: boolean;
  onSelectState: (abbreviation: string) => void;
  onUserViewportChange: (view: GlobeView) => void;
}) {
  const { map, isLoaded } = useMap();
  const userPauseUntil = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const isDark = document.documentElement.classList.contains('dark');
    const maxReports = Math.max(...activity.map((state) => state.reportCount), 1);
    const fillStops = activity.flatMap((state) => {
      const intensity = state.reportCount / maxReports;
      const alpha = 0.16 + intensity * 0.32;
      return [
        state.abbreviation,
        isDark
          ? `rgba(167, 139, 250, ${alpha})`
          : `rgba(124, 58, 237, ${alpha})`,
      ];
    });
    const stateFillColor =
      fillStops.length > 0
        ? ([
            'match',
            ['get', 'STUSPS'],
            ...fillStops,
            'rgba(124, 58, 237, 0.025)',
          ] as unknown as ExpressionSpecification)
        : 'rgba(124, 58, 237, 0.025)';

    map.setProjection({ type: 'globe' });
    map.setSky({
      'sky-color': isDark ? '#09090b' : '#eef2ff',
      'horizon-color': isDark ? '#2e2452' : '#ddd6fe',
      'fog-color': isDark ? '#111018' : '#f8fafc',
      'fog-ground-blend': 0.65,
      'horizon-fog-blend': 0.35,
      'sky-horizon-blend': 0.65,
      'atmosphere-blend': 0.95,
    });

    map.addSource('globe-states', {
      type: 'geojson',
      data: '/data/us-states.geojson',
    });
    map.addLayer({
      id: 'globe-states-fill',
      type: 'fill',
      source: 'globe-states',
      paint: {
        'fill-color': stateFillColor,
        'fill-opacity': 0.88,
      },
    });
    map.addLayer({
      id: 'globe-states-outline',
      type: 'line',
      source: 'globe-states',
      paint: {
        'line-color': isDark
          ? 'rgba(221, 214, 254, 0.42)'
          : 'rgba(91, 33, 182, 0.28)',
        'line-width': 0.75,
      },
    });

    const handleStateClick = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      const abbreviation = feature?.properties?.STUSPS as string | undefined;
      if (abbreviation && activity.some((state) => state.abbreviation === abbreviation)) {
        onSelectState(abbreviation);
      }
    };
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = 'grab';
    };
    const handleUserViewportChange = () => {
      const center = map.getCenter();
      onUserViewportChange({
        latitude: center.lat,
        longitude: normalizeLongitude(center.lng),
        zoom: map.getZoom(),
      });
    };

    map.on('click', 'globe-states-fill', handleStateClick);
    map.on('mouseenter', 'globe-states-fill', handleMouseEnter);
    map.on('mouseleave', 'globe-states-fill', handleMouseLeave);
    map.getCanvas().style.cursor = 'grab';

    const setResponsivePadding = () => {
      const width = map.getContainer().clientWidth;
      map.setPadding(
        width >= 1024
          ? { top: 24, right: 24, bottom: 24, left: 24 }
          : { top: 64, right: 0, bottom: 24, left: 0 }
      );
    };
    setResponsivePadding();
    if (!initializedGlobeMaps.has(map)) {
      initializedGlobeMaps.add(map);
      map.jumpTo({
        center: [initialView.longitude, initialView.latitude],
        zoom:
          initialView === DEFAULT_GLOBE_VIEW &&
          map.getContainer().clientWidth < 640
            ? COMPACT_GLOBE_ZOOM
            : initialView.zoom,
      });
    }
    map.on('dragend', handleUserViewportChange);
    map.on('zoomend', handleUserViewportChange);
    const resizeObserver = new ResizeObserver(setResponsivePadding);
    resizeObserver.observe(map.getContainer());

    return () => {
      resizeObserver.disconnect();
      map.off('click', 'globe-states-fill', handleStateClick);
      map.off('mouseenter', 'globe-states-fill', handleMouseEnter);
      map.off('mouseleave', 'globe-states-fill', handleMouseLeave);
      map.off('dragend', handleUserViewportChange);
      map.off('zoomend', handleUserViewportChange);
      try {
        if (map.getLayer('globe-states-outline')) {
          map.removeLayer('globe-states-outline');
        }
        if (map.getLayer('globe-states-fill')) {
          map.removeLayer('globe-states-fill');
        }
        if (map.getSource('globe-states')) {
          map.removeSource('globe-states');
        }
      } catch {
        // The base style may already be changing during theme transitions.
      }
    };
  }, [activity, initialView, isLoaded, map, onSelectState, onUserViewportChange]);

  useEffect(() => {
    if (!map || !isLoaded || !spinning) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let previousFrame = performance.now();
    const pauseForInteraction = () => {
      userPauseUntil.current = performance.now() + 6500;
    };

    map.on('dragstart', pauseForInteraction);
    map.on('zoomstart', pauseForInteraction);
    map.on('rotatestart', pauseForInteraction);

    const rotate = (now: number) => {
      const elapsed = Math.min(now - previousFrame, 50);
      previousFrame = now;

      if (now > userPauseUntil.current && !map.isMoving()) {
        const center = map.getCenter();
        map.jumpTo({ center: [center.lng + elapsed * 0.0018, center.lat] });
      }
      frameRef.current = requestAnimationFrame(rotate);
    };

    frameRef.current = requestAnimationFrame(rotate);

    return () => {
      map.off('dragstart', pauseForInteraction);
      map.off('zoomstart', pauseForInteraction);
      map.off('rotatestart', pauseForInteraction);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [isLoaded, map, spinning]);

  return (
    <>
      {activity.map((state, index) => (
        <MapMarker
          key={state.abbreviation}
          longitude={state.longitude}
          latitude={state.latitude}
          accessibleLabel={`${state.name}: ${state.reportCount} ${
            state.reportCount === 1 ? 'report' : 'reports'
          }`}
          onClick={() => onSelectState(state.abbreviation)}
        >
          <MarkerContent>
            <span className="group relative grid size-8 place-items-center rounded-full">
              <span
                className="globe-ping absolute size-7 rounded-full border border-purple-400/70 bg-purple-400/15"
                style={{ animationDelay: `${(index % 8) * 320}ms` }}
              />
              <span className="relative size-2.5 rounded-full border-2 border-white bg-purple-500 shadow-[0_0_18px_rgba(168,85,247,0.95)] transition-transform group-hover:scale-125 dark:border-zinc-950" />
            </span>
          </MarkerContent>
          <MarkerTooltip className="border border-border bg-popover px-3 py-2 text-popover-foreground">
            <span className="font-semibold">{state.name}</span>
            <span className="ml-2 text-muted-foreground">
              {state.reportCount} {state.reportCount === 1 ? 'report' : 'reports'}
            </span>
          </MarkerTooltip>
        </MapMarker>
      ))}
      <MapControls
        position="bottom-right"
        showZoom
        showCompass
        className="bottom-5 right-5"
      />
    </>
  );
}

function StateActivityCard({
  state,
  onClose,
}: {
  state: GlobeStateActivity;
  onClose: () => void;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-auto absolute bottom-5 left-5 right-5 z-30 rounded-xl border bg-card/90 p-4 shadow-xl backdrop-blur-xl sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 sm:w-80"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className="bg-purple-500 text-white hover:bg-purple-500">
              <Radio /> Live signal
            </Badge>
            <span className="text-xs text-muted-foreground">
              Latest {formatActivityDate(state.latestReportAt)}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{state.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity centered on {state.abbreviation} plates.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close state details"
        >
          <X />
        </Button>
      </div>

      <div className="my-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border bg-background/65 p-3">
          <p className="text-2xl font-bold">{formatCount(state.reportCount)}</p>
          <p className="text-xs text-muted-foreground">driver reports</p>
        </div>
        <div className="rounded-lg border bg-background/65 p-3">
          <p className="text-2xl font-bold">{formatCount(state.plateCount)}</p>
          <p className="text-xs text-muted-foreground">plates spotted</p>
        </div>
      </div>

      <Button asChild className="w-full bg-purple-600 text-white hover:bg-purple-500">
        <Link href={`/${state.abbreviation}`}>
          Explore {state.name}
          <ArrowRight />
        </Link>
      </Button>
    </motion.aside>
  );
}

export default function GlobeExperience({
  activity,
  totalReports,
  totalPlates,
  initialView,
}: GlobeExperienceProps) {
  const resolvedInitialView = initialView ?? DEFAULT_GLOBE_VIEW;
  const [spinning, setSpinning] = useState(() => initialView === undefined);
  const [selectedAbbreviation, setSelectedAbbreviation] = useState<string | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const selectedState = activity.find(
    (state) => state.abbreviation === selectedAbbreviation
  );
  const selectState = useCallback((abbreviation: string) => {
    setSelectedAbbreviation(abbreviation);
  }, []);
  const updateShareableView = useCallback((view: GlobeView) => {
    setSpinning(false);

    const params = new URLSearchParams(window.location.search);
    params.set('lat', view.latitude.toFixed(4));
    params.set('lng', normalizeLongitude(view.longitude).toFixed(4));
    params.set('z', view.zoom.toFixed(2));

    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    );
  }, []);
  const resumeOrbit = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete('lat');
    params.delete('lng');
    params.delete('z');

    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    );
    setSpinning(true);
  }, []);
  const toggleOrbit = useCallback(() => {
    if (!spinning) {
      resumeOrbit();
      return;
    }

    const currentMap = mapRef.current;
    if (!currentMap) {
      setSpinning(false);
      return;
    }

    const center = currentMap.getCenter();
    updateShareableView({
      latitude: center.lat,
      longitude: center.lng,
      zoom: currentMap.getZoom(),
    });
  }, [resumeOrbit, spinning, updateShareableView]);

  return (
    <section className="relative isolate h-full min-h-0 overflow-hidden overscroll-none bg-background">
      <div className="absolute inset-0">
        <Map
          ref={mapRef}
          projection={{ type: 'globe' }}
          center={[
            resolvedInitialView.longitude,
            resolvedInitialView.latitude,
          ]}
          zoom={resolvedInitialView.zoom}
          minZoom={0.7}
          maxZoom={6}
          pitch={0}
          bearing={0}
          className="h-full w-full"
        >
          <GlobeScene
            activity={activity}
            initialView={resolvedInitialView}
            spinning={spinning}
            onSelectState={selectState}
            onUserViewportChange={updateShareableView}
          />
        </Map>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto absolute left-5 top-5 z-40 flex items-center gap-2 md:left-8 md:top-8">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="bg-card/90 shadow-lg backdrop-blur-xl"
          >
            <Link href="/" aria-label="Back to RateMyPlate home">
              <LayoutDashboard />
            </Link>
          </Button>
          <div className="rounded-4xl border bg-card/90 shadow-lg backdrop-blur-xl">
            <ModeToggle />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="bg-card/90 shadow-lg backdrop-blur-xl"
            onClick={toggleOrbit}
            aria-label={spinning ? 'Pause globe rotation' : 'Resume globe rotation'}
          >
            {spinning ? <Pause /> : <Play />}
          </Button>
        </div>

        <div className="pointer-events-auto absolute left-5 top-20 z-30 flex items-center gap-2 rounded-lg border bg-card/90 px-3 py-2 text-xs shadow-lg backdrop-blur-xl md:left-8 md:top-24">
          <span className="size-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
          <span className="font-semibold">Live plate activity</span>
          <span className="h-3.5 w-px bg-border" aria-hidden="true" />
          <span className="text-muted-foreground">
            {formatCount(totalReports)} {totalReports === 1 ? 'report' : 'reports'}
          </span>
          <span className="hidden text-muted-foreground sm:inline">
            · {activity.length} {activity.length === 1 ? 'area' : 'areas'}
          </span>
          <span className="sr-only">across {formatCount(totalPlates)} plates</span>
        </div>

        <AnimatePresence>
          {selectedState && (
            <StateActivityCard
              key={selectedState.abbreviation}
              state={selectedState}
              onClose={() => setSelectedAbbreviation(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
