import { useMemo } from 'react';
import { AlertTriangle, FilePlus2, Search, TrendingUp } from 'lucide-react';
import { relativeTime, roads } from '../data';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Button } from '@/components/ui/button';
import { Chip, EmptyState, Panel, Stat, SevBadge } from '../ui';

export default function DashboardScreen() {
  const { lang, go } = useApp();
  const { complaints } = useAnvaya();
  const t = useT(lang);

  const hotspots = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of complaints) m[c.roadId] = (m[c.roadId] ?? 0) + 1;
    return roads
      .map((r) => ({ road: r, count: m[r.id] ?? 0 }))
      .filter((h) => h.count >= 2)
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  const open = complaints.filter((c) => c.status !== 'resolved').length;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="font-display text-xl font-bold sm:text-2xl">{t.dashboard.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Active complaints" value={open} tone="warn" />
          <Stat label="Resolved" value={complaints.filter((c) => c.status === 'resolved').length} tone="ok" />
          <Stat label="Hotspot roads" value={hotspots.length} tone="bad" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button onClick={() => go('file-complaint')} className="h-auto flex-col gap-1.5 py-4">
            <FilePlus2 className="h-5 w-5" aria-hidden />{t.dashboard.fileComplaint}
          </Button>
          <Button variant="outline" onClick={() => go('tracker')} className="h-auto flex-col gap-1.5 py-4">
            <Search className="h-5 w-5" aria-hidden />{t.dashboard.trackComplaint}
          </Button>
        </div>

        <Panel title={<span className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4" aria-hidden />{t.dashboard.hotspotRoads}</span>}>
          {hotspots.length === 0 ? (
            <EmptyState title={t.dashboard.noHotspots} />
          ) : (
            <div className="stagger space-y-2">
              {hotspots.map(({ road, count }) => (
                <button key={road.id} onClick={() => go('roads', road.id)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-all duration-200 hover:border-ring">
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold">{road.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{road.id} · {road.ward}</p>
                  </div>
                  <Chip label={<><AlertTriangle className="h-3 w-3" aria-hidden />{count} reports</>} tone="bad" />
                </button>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t.dashboard.recentComplaints}>
          {complaints.length === 0 ? (
            <EmptyState title={t.dashboard.emptyComplaints} />
          ) : (
            <div className="stagger space-y-2">
              {complaints.slice(0, 5).map((c) => (
                <button key={c.id} onClick={() => go('tracker', c.id)} className="flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-3.5 text-left transition-all duration-200 hover:border-ring sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.id} · {c.location} · {relativeTime(c.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SevBadge sev={c.severity} label={t.severity[c.severity]} />
                    <Chip label={c.status} tone={c.status === 'resolved' ? 'ok' : 'info'} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
