'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Crosshair, Globe2, Map as MapIcon, Minus, Pause, Play, Plus, Radio, X } from 'lucide-react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { Map } from '@/components/ui/map';
import GlobeScene, { getOverviewZoom } from './globe-scene';
import './globe.css';

export type GlobeStateActivity = {
  abbreviation: string;
  name: string;
  longitude: number;
  latitude: number;
  reportCount: number;
  plateCount: number;
  latestReportAt: string;
};

export type GlobeView = { latitude: number; longitude: number; zoom: number };

type GlobeExperienceProps = {
  activity: GlobeStateActivity[];
  totalReports: number;
  totalPlates: number;
  initialView?: GlobeView;
};

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => true,
  );
}

function normalizeLongitude(longitude: number) {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

function formatCount(count: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(count);
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

function StateActivityCard({ state, totalReports, onClose }: {
  state: GlobeStateActivity;
  totalReports: number;
  onClose: () => void;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.aside
      key={state.abbreviation}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
      transition={{ duration: 0.25 }}
      className="globe-state-card"
      aria-label={`${state.name} activity`}
    >
      <div className="globe-card-topline">
        <span className="globe-eyebrow"><Radio size={12} /> State spotlight</span>
        <button className="globe-icon-button" onClick={onClose} aria-label="Close state details"><X size={16} /></button>
      </div>
      <div className="globe-state-heading">
        <span className="globe-state-monogram">{state.abbreviation}</span>
        <div><h2>{state.name}</h2><p>Latest report · {formatActivityDate(state.latestReportAt)}</p></div>
      </div>
      <div className="globe-state-stats">
        <div><strong>{formatCount(state.reportCount)}</strong><span>driver reports</span></div>
        <div><strong>{formatCount(state.plateCount)}</strong><span>plates spotted</span></div>
      </div>
      <div className="globe-share-label"><span>Share of all reports</span><span>{Math.round(state.reportCount / Math.max(totalReports, 1) * 100)}%</span></div>
      <div className="globe-share-track"><span style={{ width: `${state.reportCount / Math.max(totalReports, 1) * 100}%` }} /></div>
      <Link className="globe-explore-link" href={`/${state.abbreviation}`}>Explore {state.name}<ArrowUpRight size={17} /></Link>
    </motion.aside>
  );
}

export default function GlobeExperience({ activity, totalReports, totalPlates, initialView }: GlobeExperienceProps) {
  const reducedMotion = useReducedMotion();
  const [spinning, setSpinning] = useState(() => initialView === undefined);
  const [ready, setReady] = useState(false);
  const [selectedAbbreviation, setSelectedAbbreviation] = useState<string | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const selectedState = activity.find((state) => state.abbreviation === selectedAbbreviation);
  const mostActive = activity.slice(0, 3);
  const orbiting = spinning && !reducedMotion;
  const onReady = useCallback(() => setReady(true), []);

  const updateShareableView = useCallback((view: GlobeView) => {
    setSpinning(false);
    const params = new URLSearchParams(window.location.search);
    params.set('lat', view.latitude.toFixed(4));
    params.set('lng', normalizeLongitude(view.longitude).toFixed(4));
    params.set('z', view.zoom.toFixed(2));
    window.history.replaceState(window.history.state, '', `${window.location.pathname}?${params}${window.location.hash}`);
  }, []);

  const selectState = useCallback((abbreviation: string) => {
    const state = activity.find((item) => item.abbreviation === abbreviation);
    if (!state) return;
    setSelectedAbbreviation(abbreviation);
    setSpinning(false);
    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: [state.longitude, state.latitude],
        zoom: Math.max(getOverviewZoom(map) + 0.65, map.getZoom()),
        offset: map.getContainer().clientWidth < 768 ? [0, -100] : [0, 0],
        duration: 1600,
      });
    }
  }, [activity]);

  const toggleOrbit = useCallback(() => {
    const map = mapRef.current;
    if (orbiting && map) {
      const center = map.getCenter();
      updateShareableView({ latitude: center.lat, longitude: center.lng, zoom: map.getZoom() });
    } else {
      map?.stop();
      setSelectedAbbreviation(null);
      const params = new URLSearchParams(window.location.search);
      ['lat', 'lng', 'z'].forEach((key) => params.delete(key));
      const query = params.toString();
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
      setSpinning(true);
    }
  }, [orbiting, updateShareableView]);

  const resetView = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    setSelectedAbbreviation(null);
    setSpinning(false);
    map.flyTo({ center: [-98, 38], zoom: getOverviewZoom(map), bearing: 0, pitch: 0, duration: 1800 });
  }, []);

  useEffect(() => {
    if (!selectedAbbreviation) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedAbbreviation(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedAbbreviation]);

  return (
    <section className="globe-experience" aria-label="Explore nationwide plate activity">
      <div className="globe-space" aria-hidden="true" />
      <div className={`globe-map ${ready ? 'is-ready' : ''}`}>
        <Map ref={mapRef} theme="dark" projection={{ type: 'globe' }} center={[initialView?.longitude ?? -98, initialView?.latitude ?? 38]} zoom={initialView?.zoom ?? 2.05} minZoom={0.7} maxZoom={6} pitch={0} bearing={0} canvasContextAttributes={{ antialias: true }}>
          <GlobeScene activity={activity} initialView={initialView} spinning={orbiting} selectedAbbreviation={selectedAbbreviation} onSelectState={selectState} onUserViewportChange={updateShareableView} onReady={onReady} />
        </Map>
      </div>
      <div className="globe-vignette" aria-hidden="true" />

      <header className="globe-header">
        <Link href="/" className="globe-brand" aria-label="Back to RateMyPlate home"><span className="globe-brand-mark"><Globe2 size={21} strokeWidth={1.4} /></span><span>RateMyPlate<span className="globe-brand-slash">/</span><span className="globe-brand-section">globe</span></span></Link>
        <div className="globe-header-right"><span className="globe-status"><i /> Nationwide activity</span><Link href="/map" className="globe-map-link"><MapIcon size={14} /><span>Map view</span><ArrowUpRight size={13} /></Link></div>
      </header>

      <div className="globe-editorial">
        <div className="globe-intro">
          <p className="globe-eyebrow"><span className="globe-eyebrow-line" /> A new perspective</p>
          <h1>Every plate.<br /><span>A bigger<br className="globe-desktop-break" /> picture.</span></h1>
          <p className="globe-description">Every road has a story.<br />See where they’re unfolding.</p>
          <div className="globe-totals" aria-label="Nationwide totals">
            <div><strong>{formatCount(totalReports)}</strong><span>reports</span></div>
            <div><strong>{formatCount(totalPlates)}</strong><span>plates</span></div>
            <div><strong>{activity.length.toString().padStart(2, '0')}</strong><span>states</span></div>
          </div>
        </div>

        <div className={`globe-discovery ${selectedState ? 'has-selection' : ''}`}>
          <AnimatePresence mode="wait">
            {selectedState ? <StateActivityCard key={selectedState.abbreviation} state={selectedState} totalReports={totalReports} onClose={() => setSelectedAbbreviation(null)} /> : (
              <motion.div key="activity" className="globe-radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
                <div className="globe-radar-heading"><span className="globe-eyebrow">On the radar</span><span>Most reported</span></div>
                {mostActive.length ? mostActive.map((state, index) => (
                  <button key={state.abbreviation} className="globe-radar-row" onClick={() => selectState(state.abbreviation)} aria-label={`Explore ${state.name}, ${state.reportCount} ${state.reportCount === 1 ? 'report' : 'reports'}`}>
                    <span className="globe-radar-rank">0{index + 1}</span><span className="globe-radar-state">{state.name}<span className="globe-radar-track"><span style={{ width: `${state.reportCount / Math.max(mostActive[0].reportCount, 1) * 100}%` }} /></span></span><span className="globe-radar-count">{formatCount(state.reportCount)}</span><ArrowUpRight size={14} />
                  </button>
                )) : <p className="globe-empty">The next story starts with you.<Link href="/">Find a plate <ArrowRight size={14} /></Link></p>}
                <p className="globe-radar-note">Select a signal. Discover the story.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="globe-map-caption" aria-hidden="true"><span>01 / THE BIG PICTURE</span><span className="globe-caption-line" /></div>
      <div className="globe-navigation">
        <div className="globe-legend"><span /><span /> <span /> Report activity</div>
        <div className="globe-control-dock" role="group" aria-label="Globe controls">
          <button className="globe-orbit-button" onClick={toggleOrbit} disabled={!ready || !!reducedMotion} aria-label={orbiting ? 'Pause globe rotation' : 'Resume globe rotation'} title={reducedMotion ? 'Rotation is off to respect reduced motion' : undefined}>{orbiting ? <Pause size={14} /> : <Play size={14} />}<span>{orbiting ? 'Orbiting' : 'Paused'}</span></button>
          <span className="globe-control-divider" />
          <button className="globe-icon-button" onClick={resetView} disabled={!ready} aria-label="Reset view to America" title="Reset view to America"><Crosshair size={18} /></button>
          <span className="globe-control-divider" />
          <button className="globe-icon-button" onClick={() => mapRef.current?.zoomOut({ duration: 350 })} disabled={!ready} aria-label="Zoom out"><Minus size={17} /></button>
          <button className="globe-icon-button" onClick={() => mapRef.current?.zoomIn({ duration: 350 })} disabled={!ready} aria-label="Zoom in"><Plus size={17} /></button>
        </div>
        <p className="globe-interaction-hint">Drag to explore<span>·</span>Scroll to zoom</p>
      </div>

      {!ready && <div className="globe-loading" role="status"><Globe2 size={25} /><span>Bringing the world into view</span></div>}
      <footer className="globe-footer"><Link href="/"><ArrowLeft size={12} /> Back to the streets</Link><span>Community powered. Always anonymous.</span></footer>
    </section>
  );
}
