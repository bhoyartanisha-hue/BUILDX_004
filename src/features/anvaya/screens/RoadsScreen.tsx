import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Repeat } from 'lucide-react';
import { relativeTime, roads } from '../data';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Chip, EmptyState, Meter, Panel, fmt } from '../ui';
import type { RoadSegment } from '../types';

export function roadHealth(r: RoadSegment) {
  const days = (Date.now() - new Date(r.lastRepaired).getTime()) / 86400000;
  let s = r.baseScore - (r.repairCount - 1) * 6;
  if (days > 365) s -= 12; else if (days > 180) s -= 6;
  return Math.max(5, Math.min(98, Math.round(s)));
}

export function repairTimeline(r: RoadSegment) {
  const out: { date: string; type: string }[] = [];
  let d = new Date(r.lastRepaired);
  const types = ['Pothole patching', 'Resurfacing', 'Edge repair', 'Deep patching'];
  for (let i = 0; i < r.repairCount; i++) {
    out.push({ date: d.toISOString().slice(0, 10), type: types[i % types.length]! });
    d = new Date(d.getTime() - (150 + i * 40) * 86400000);
  }
  return out;
}

export default function RoadsScreen() {
  const { lang, focus, go } = useApp();
  const { complaints } = useAnvaya();
  const t = useT(lang);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('score');
  const [selId, setSelId] = useState<string | undefined>(focus);

  useEffect(() => { if (focus) setSelId(focus); }, [focus]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of complaints) m[c.roadId] = (m[c.roadId] ?? 0) + 1;
    return m;
  }, [complaints]);

  const list = useMemo(() => {
    const filtered = roads.filter((r) => `${r.name} ${r.id} ${r.ward}`.toLowerCase().includes(q.toLowerCase()));
    return filtered.sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name) : sort === 'repairs' ? b.repairCount - a.repairCount : roadHealth(a) - roadHealth(b));
  }, [q, sort]);

  const sel = roads.find((r) => r.id === selId);

  const row = (r: RoadSegment) => {
    const score = roadHealth(r);
    const hot = (counts[r.id] ?? 0) >= 2;
    return (
      <button key={r.id} onClick={() => setSelId(r.id)}
        className={`w-full rounded-xl border p-4 text-left transition-all duration-200 hover:border-ring ${selId === r.id ? 'border-ring bg-accent' : 'border-border bg-card'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display font-semibold">{r.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{r.id} · {r.ward} · {r.length}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <Chip label={`Health ${score}`} tone={score >= 70 ? 'ok' : score >= 45 ? 'warn' : 'bad'} />
            {(r.repairCount >= 2 || hot) && (
              <span className="flex gap-1">
                {r.repairCount >= 2 && <Chip label={<><Repeat className="h-3 w-3" aria-hidden />{t.roads.recurringIssue}</>} tone="warn" />}
                {hot && <Chip label="Hotspot" tone="bad" />}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3"><Meter value={score} /></div>
        <p className="mt-2 text-xs text-muted-foreground">{r.repairCount} repairs · {counts[r.id] ?? 0} active complaints</p>
      </button>
    );
  };

  if (sel) {
    const score = roadHealth(sel);
    return (
      <div className="h-full overflow-y-auto p-4 sm:p-6">
        <button onClick={() => setSelId(undefined)} className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden">
          <ArrowLeft className="h-4 w-4" aria-hidden />{t.roads.title}
        </button>
        <div className="mx-auto max-w-3xl space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-bold sm:text-2xl">{sel.name}</h1>
              {sel.repairCount >= 2 && <Chip label={t.roads.recurringIssue} tone="warn" />}
              {(counts[sel.id] ?? 0) >= 2 && <Chip label="Hotspot" tone="bad" />}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{sel.id} · {sel.ward}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Panel><p className="text-xs text-muted-foreground">{t.roads.length}</p><p className="mt-1 font-display font-bold">{sel.length}</p></Panel>
            <Panel><p className="text-xs text-muted-foreground">{t.roads.width}</p><p className="mt-1 font-display font-bold">{sel.width}</p></Panel>
            <Panel><p className="text-xs text-muted-foreground">{t.roads.surface}</p><p className="mt-1 font-display font-bold">{sel.surface}</p></Panel>
            <Panel><p className="text-xs text-muted-foreground">{t.expiry.filterWard}</p><p className="mt-1 font-display font-bold">{sel.ward}</p></Panel>
          </div>
          <Panel title={`Road Health · ${score}/100`}><Meter value={score} /></Panel>
          <Panel title={t.roads.timeline} action={<button onClick={() => go('map', sel.id)} className="flex items-center gap-1.5 rounded-md border border-input px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-accent"><MapPin className="h-3.5 w-3.5" aria-hidden />{t.detail.viewOnMap}</button>}>
            <ol className="space-y-3">
              {repairTimeline(sel).map((e, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold">{e.type}</p>
                    <p className="text-xs text-muted-foreground">{fmt(e.date)} · {relativeTime(e.date)} · {t.roads.contractor}: Mehta Civil Works</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-xl font-bold sm:text-2xl">{t.roads.title}</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className="input" placeholder={t.roads.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t.roads.searchPlaceholder} />
          <select className="input sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="score">Sort: worst health first</option>
            <option value="name">Sort: name</option>
            <option value="repairs">Sort: most repairs</option>
          </select>
        </div>
        {list.length === 0
          ? <EmptyState title="No roads found" hint={`Nothing matches “${q}”. Try a different name, ID, or ward.`} />
          : <div className="stagger space-y-3">{list.map(row)}</div>}
      </div>
    </div>
  );
}
