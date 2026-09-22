import { useMemo, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { expiryAssets, mapElements, roads, workItems } from '../data';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Chip, EmptyState } from '../ui';
import type { Screen } from '../types';

interface Hit { id: string; title: string; sub: string; group: string; screen: Screen }

export default function SearchScreen() {
  const { lang, go } = useApp();
  const { orders, complaints } = useAnvaya();
  const t = useT(lang);
  const [q, setQ] = useState('');

  const index = useMemo<Hit[]>(() => [
    ...roads.map((r) => ({ id: r.id, title: r.name, sub: `${r.id} · ${r.ward} · ${r.length}`, group: t.globalSearch.groups.roads, screen: 'roads' as Screen })),
    ...mapElements.filter((e) => e.type === 'pipeline').map((e) => ({ id: e.id, title: e.label, sub: e.sublabel ?? e.id, group: t.globalSearch.groups.utilities, screen: 'map' as Screen })),
    ...mapElements.filter((e) => e.type === 'chamber').map((e) => ({ id: e.id, title: e.label, sub: e.sublabel ?? e.id, group: t.globalSearch.groups.chambers, screen: 'map' as Screen })),
    ...mapElements.filter((e) => e.type === 'household').map((e) => ({ id: e.id, title: e.label, sub: e.sublabel ?? e.id, group: t.globalSearch.groups.households, screen: 'map' as Screen })),
    ...mapElements.filter((e) => e.type === 'worksite').map((e) => ({ id: e.id, title: e.label, sub: e.sublabel ?? e.id, group: t.globalSearch.groups.utilities, screen: 'map' as Screen })),
    ...[...new Set([...orders.map((o) => o.contractor), ...workItems.map((w) => w.assignedTo)])].map((c) => ({ id: c, title: c, sub: 'Contractor', group: t.globalSearch.groups.contractors, screen: 'work-list' as Screen })),
    ...orders.map((o) => ({ id: o.id, title: o.title, sub: `${o.id} · ${o.contractor} · ${o.area}`, group: t.globalSearch.groups.workOrders, screen: 'verification' as Screen })),
    ...workItems.map((w) => ({ id: w.id, title: w.title, sub: `${w.id} · ${w.area} · ${w.status}`, group: 'Repairs', screen: 'work-list' as Screen })),
    ...expiryAssets.map((a) => ({ id: a.id, title: a.name, sub: `${a.id} · ${a.type} · ${a.ward}`, group: t.globalSearch.groups.assets, screen: 'expiry' as Screen })),
    ...complaints.map((c) => ({ id: c.id, title: c.title, sub: `${c.id} · ${c.location}`, group: 'Complaints', screen: 'tracker' as Screen })),
  ], [t, orders, complaints]);

  const query = q.trim().toLowerCase();
  const hits = query.length >= 2 ? index.filter((h) => `${h.title} ${h.sub} ${h.id}`.toLowerCase().includes(query)) : [];
  const groups = useMemo(() => {
    const m = new Map<string, Hit[]>();
    for (const h of hits) { const arr = m.get(h.group) ?? []; arr.push(h); m.set(h.group, arr); }
    return [...m.entries()];
  }, [hits]);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-xl font-bold sm:text-2xl">{t.globalSearch.title}</h1>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input className="input pl-9" placeholder={t.globalSearch.placeholder} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t.globalSearch.placeholder} autoFocus />
        </div>
        {query.length < 2 ? (
          <EmptyState title={t.globalSearch.placeholder} hint={t.globalSearch.emptyHint} />
        ) : hits.length === 0 ? (
          <EmptyState title={`${t.globalSearch.empty} “${q}”`} hint={t.globalSearch.emptyHint} />
        ) : (
          <div className="stagger space-y-5">
            {groups.map(([group, items]) => (
              <section key={group}>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group} · {items.length}</h2>
                <div className="space-y-2">
                  {items.map((h) => (
                    <button key={`${h.screen}-${h.id}-${h.title}`} onClick={() => go(h.screen, h.id)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-all duration-200 hover:border-ring">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{h.title}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{h.sub}</p>
                      </div>
                      <Chip label={group} />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
