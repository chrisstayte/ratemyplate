'use client';

import { useState } from 'react';
import { Download, LoaderCircle, X } from 'lucide-react';
import PlateArtwork from '@/components/public/plate-artwork';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import statePlates from '@/lib/state-plates.json';
import {
  downloadPlate,
  MEDIA_TEXT_MAX_LENGTH,
  normalizeMediaText,
  type PlateExportFormat,
} from '@/lib/plate-export';
import { cn } from '@/lib/utils';

const plates = [...statePlates].sort((a, b) => a.state.localeCompare(b.state));
const formats = ['svg', 'png', 'jpg'] as const;

export default function PlateGallery() {
  const [text, setText] = useState('');
  const [state, setState] = useState('all');
  const [format, setFormat] = useState<PlateExportFormat>('svg');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const visiblePlates = state === 'all' ? plates : plates.filter((plate) => plate.code === state);
  const previewText = text.trim();

  async function handleDownload(code: string, name: string) {
    if (downloading) return;
    setDownloading(code);
    setError('');
    setStatus(`Preparing your ${name} ${format.toUpperCase()}…`);
    try {
      await downloadPlate(code, previewText, format);
      setStatus(`${name} ${format.toUpperCase()} download started.`);
    } catch (error) {
      setStatus('');
      setError(error instanceof TypeError
        ? 'Your download could not be created. Check your connection and try again.'
        : error instanceof Error ? error.message : 'Your download could not be created. Please try again.');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div>
      <section aria-label="Customize and filter plates" className="rounded-xl border bg-card p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-6">
          <div className="col-span-2 space-y-3 md:col-span-1">
            <Label htmlFor="plate-custom-text">Your plate text <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <div className="relative">
              <Input
                id="plate-custom-text"
                value={text}
                onChange={(event) => setText(normalizeMediaText(event.target.value))}
                placeholder="Try R8MYPL8"
                maxLength={MEDIA_TEXT_MAX_LENGTH}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                aria-describedby="plate-text-help"
                className="h-11 rounded-lg pr-12 text-base font-semibold tracking-widest md:text-base"
              />
              {text && (
                <Button variant="ghost" size="icon-sm" onClick={() => setText('')} aria-label="Clear custom text" className="absolute right-1.5 top-1.5 rounded-md">
                  <X aria-hidden="true" />
                </Button>
              )}
            </div>
            <p id="plate-text-help" className="text-sm leading-relaxed text-muted-foreground">
              Up to {MEDIA_TEXT_MAX_LENGTH} letters, numbers, spaces or hyphens.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="plate-state-filter">Filter by state</Label>
            <NativeSelect id="plate-state-filter" value={state} onChange={(event) => setState(event.target.value)} className="w-full [&_select]:h-11 [&_select]:rounded-lg [&_select]:pl-2 [&_select]:pr-7 md:[&_select]:text-base">
              <option value="all">All states</option>
              {plates.map((plate) => <option key={plate.code} value={plate.code}>{plate.state}</option>)}
            </NativeSelect>
          </div>

          <fieldset className="min-w-0 space-y-3">
            <legend className="text-sm font-medium">Download format</legend>
            <div className="flex h-11 rounded-lg border bg-muted/50 p-1">
              {formats.map((option) => (
                <label key={option} className="relative flex flex-1 cursor-pointer">
                  <input type="radio" name="plate-format" value={option} checked={format === option} onChange={() => setFormat(option)} className="peer sr-only" />
                  <span className={cn('flex w-full items-center justify-center rounded-md text-sm font-semibold peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2', format === option ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                    {option.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
            <p className="hidden text-sm leading-relaxed text-muted-foreground md:block">
              {format === 'svg' ? 'Scalable vector. Transparent edges.' : format === 'png' ? '2400 × 1200. Transparent edges.' : '2400 × 1200. White background.'}
            </p>
          </fieldset>
          <p className="col-span-2 -mt-1 text-sm text-muted-foreground md:hidden">
            {format === 'svg' ? 'Scalable vector · Transparent edges' : format === 'png' ? '2400 × 1200 · Transparent edges' : '2400 × 1200 · White background'}
          </p>
        </div>
      </section>

      <div className="my-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold" aria-live="polite">
          {state === 'all' ? 'The full collection' : visiblePlates[0]?.state}
          {' '}<span className="ml-2 text-sm font-normal text-muted-foreground">{visiblePlates.length} {visiblePlates.length === 1 ? 'design' : 'designs'}</span>
        </h2>
        {state !== 'all' ? (
          <Button variant="ghost" size="sm" onClick={() => setState('all')}>Show all states <X aria-hidden="true" /></Button>
        ) : <p className="text-sm text-muted-foreground">{previewText ? 'Your text, on every plate' : 'Blank plates, ready to download'}</p>}
      </div>

      <p role="status" className={cn('text-sm text-muted-foreground', status ? 'mb-5' : 'sr-only')}>{status}</p>
      {error && <p role="alert" className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <ul aria-label="State plate designs" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePlates.map((plate) => (
          <li key={plate.code} className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
            <div className="flex aspect-[3/2] items-center bg-muted/40 p-6">
              <PlateArtwork plate={{ state: plate.code, plateNumber: previewText }} className="drop-shadow-sm" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{plate.state}</h3>
                  <span className="text-sm text-muted-foreground">{plate.code}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{plate.variant}</p>
              </div>
              <Button variant="outline" className="mt-auto h-10 w-full rounded-lg" onClick={() => handleDownload(plate.code, plate.state)} disabled={downloading !== null} aria-label={`Download ${plate.state} ${previewText ? 'custom' : 'blank'} plate as ${format.toUpperCase()}`}>
                {downloading === plate.code ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Download aria-hidden="true" />}
                {downloading === plate.code ? 'Preparing…' : `Download ${format.toUpperCase()}`}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
