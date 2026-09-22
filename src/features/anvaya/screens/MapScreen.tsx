import { lazy, Suspense, useEffect, useState } from 'react';
import { Layers, MapPin, X } from 'lucide-react';
import { mapElements, roads } from '../data';
import { useApp } from '../appContext';
import { useT } from '../i18n';
import { Chip, SevBadge, statusTone, useHydrated } from '../ui';
import type { MapElement } from '../types';

const MapCanvas = lazy(() => import('../MapCanvas'));

const layerKeys = ['water', 'sewer', 'gas', 'electricity', 'telecom', 'household', 'chamber'] as const;
const layerColors: Record<string, string> = {
  water: '#3b82f6', sewer: '#b45309', gas: '#f97316', electricity: '#eab308',
  telecom: '#8b5cf6', household: '#0d9488', chamber: '#9ca3af', worksite: '#ef4444', road: '#64748b',
};

export default function MapScreen() {
  const { lang, focus, go } = useApp();
  const t = useT(lang);
  const hydrated = useHydrated();
  const [visible, setVisible] = useState<Record<string, boolean>>(Object.fromEntries(layerKeys.map((k) => [k, true])));
  const [showRoads, setShowRoads] = useState(true);
  const [showWorksites, setShowWorksites] = useState(true);
  const [picked, setPicked] = useState<MapElement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const focused = focus ? mapElements.find((e) => e.id === focus) ?? null : null;
  const selected = focused ?? picked;

  useEffect(() => { if (focus) setPicked(null); }, [focus]);

  const elements = mapElements.filter((el) =>
    el.type === 'road' ? showRoads : el.type === 'worksite' ? showWorksites : el.utilityType ? visible[el.utilityType] : true);

  const layerToggle = (key: string, on: boolean, set: (v: boolean) => void, label: string, color: string) => (
    <label key={key} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-accent">
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
      <span className="truncate">{label}</span>
    </label>
  );

  const layerPanel = (
    <div className="map-panel pointer-events-auto max-h-full w-60 space-y-1 overflow-y-auto p-3">
      <div className="flex items-center justify-between px-2 pb-1">
        <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.layers.title}</h2>
        <button className="md:hidden" onClick={() => setPanelOpen(false)} aria-label="Close layers"><X className="h-4 w-4" /></button>
      </div>
      {layerKeys.map((k) => layerToggle(k, visible[k] ?? true, (v) => setVisible((p) => ({ ...p, [k]: v })), t.layers[k] ?? k, layerColors[k]!))}
      {layerToggle('road', showRoads, setShowRoads, t.layers.repairs, layerColors['road']!)}
      {layerToggle('worksite', showWorksites, setShowWorksites, t.layers.worksites, layerColors['worksite']!)}
      <div className="mt-2 border-t border-border px-2 pt-2">
        <h3 className="pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.legend}</h3>
        <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
          {(['water', 'sewer', 'gas', 'electricity', 'telecom', 'chamber'] as const).map((k) => (
            <span key={k} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: layerColors[k] }} aria-hidden />{t.layers[k]}</span>
          ))}
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: layerColors['worksite'] }} aria-hidden />{t.layers.worksites}</span>
        </div>
      </div>
    </div>
  );

  const detail = selected && (
    <div className="map-panel pointer-events-auto w-full space-y-3 p-4 md:w-80">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{selected.id}</p>
          <h2 className="font-display text-base font-bold leading-tight">{selected.label}</h2>
        </div>
        <button onClick={() => { setPicked(null); go('map', undefined); }} aria-label="Close details" className="text-muted-foreground transition-colors hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
      {selected.sublabel && <p className="text-sm text-muted-foreground">{selected.sublabel}</p>}
      <div className="flex flex-wrap gap-1.5">
        {selected.utilityType && selected.utilityType !== selected.type && <Chip label={t.layers[selected.utilityType as keyof typeof t.layers] ?? selected.utilityType} tone="info" />}
        {selected.status && <Chip label={t.status[selected.status]} tone={statusTone(selected.status)} />}
        {selected.severity && <SevBadge sev={selected.severity} label={t.severity[selected.severity]} />}
        {selected.type === 'road' && <Chip label={`${t.detail.repairHistory}: ${roads.find((r) => r.id === selected.id)?.repairCount ?? 0}`} />}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden />{selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}</p>
      {selected.type === 'road' && (
        <button onClick={() => go('roads', selected.id)} className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90">
          {t.roads.title}
        </button>
      )}
    </div>
  );

  return (
    <div className="relative h-full">
      {hydrated ? (
        <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading map…</div>}>
          <MapCanvas elements={elements} selected={selected} onSelect={setPicked} />
        </Suspense>
      ) : (
        <div className="grid h-full place-items-center text-sm text-muted-foreground">Loading map…</div>
      )}
      {/* Desktop layer panel */}
      <div className="pointer-events-none absolute left-4 top-4 bottom-4 z-[500] hidden md:block">{layerPanel}</div>
      {/* Desktop detail card */}
      {selected && <div className="pointer-events-none absolute right-4 top-4 z-[500] hidden md:block">{detail}</div>}
      {/* Mobile layers FAB + panel */}
      <button
        onClick={() => setPanelOpen(true)}
        aria-label={t.layers.title}
        className="map-panel pointer-events-auto absolute left-4 top-4 z-[500] grid h-11 w-11 place-items-center md:hidden"
      >
        <Layers className="h-5 w-5" aria-hidden />
      </button>
      {panelOpen && <div className="pointer-events-none absolute inset-x-4 top-4 bottom-4 z-[500] md:hidden">{layerPanel}</div>}
      {/* Mobile bottom sheet */}
      {selected && <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[500] md:hidden">{detail}</div>}
    </div>
  );
}
