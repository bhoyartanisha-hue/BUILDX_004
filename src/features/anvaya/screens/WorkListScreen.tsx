import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { relativeTime, workItems } from '../data';
import { useApp } from '../appContext';
import { useT } from '../i18n';
import { Chip, EmptyState, Field, Panel, SevBadge, fmt } from '../ui';
import type { WorkItem } from '../types';

const whyPriority: Record<string, string> = {
  critical: 'Public safety risk or service outage — flagged for immediate dispatch under the emergency response protocol.',
  high: 'Affects multiple connections or traffic flow; escalation window is 48 hours.',
  medium: 'Localized degradation with no immediate safety risk; scheduled within the weekly plan.',
  low: 'Cosmetic or minor defect; batched into routine maintenance rounds.',
};

export default function WorkListScreen() {
  const { lang, focus } = useApp();
  const t = useT(lang);
  const [sev, setSev] = useState('all');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [area, setArea] = useState('all');
  const [sort, setSort] = useState('newest');
  const [open, setOpen] = useState<string | undefined>(undefined);
  const [selId, setSelId] = useState<string | undefined>(focus);

  useEffect(() => { if (focus) setSelId(focus); }, [focus]);

  const statuses = useMemo(() => [...new Set(workItems.map((w) => w.status))], []);
  const types = useMemo(() => [...new Set(workItems.map((w) => w.utilityType))], []);
  const areas = useMemo(() => [...new Set(workItems.map((w) => w.area))], []);
  const sevRank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const list = useMemo(() => workItems
    .filter((w) => (sev === 'all' || w.severity === sev) && (status === 'all' || w.status === status) && (type === 'all' || w.utilityType === type) && (area === 'all' || w.area === area))
    .sort((a, b) => sort === 'severity' ? sevRank[a.severity]! - sevRank[b.severity]! : +new Date(b.createdAt) - +new Date(a.createdAt)),
  [sev, status, type, area, sort]);

  const sel = workItems.find((w) => w.id === selId);

  const card = (w: WorkItem) => {
    const expanded = open === w.id;
    return (
      <div key={w.id} className={`rounded-xl border bg-card transition-colors duration-200 ${selId === w.id ? 'border-ring' : 'border-border'}`}>
        <button onClick={() => setOpen(expanded ? undefined : w.id)} aria-expanded={expanded} className="w-full p-4 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{w.id} · {w.area}</p>
              <p className="mt-0.5 font-display font-semibold leading-snug">{w.title}</p>
            </div>
            <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} aria-hidden />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <SevBadge sev={w.severity} label={t.severity[w.severity]} />
            <Chip label={w.status} tone="info" />
            <Chip label={w.utilityType} />
            <Chip label={relativeTime(w.createdAt)} />
          </div>
        </button>
        {expanded && (
          <div className="border-t border-border px-4 py-3 text-sm">
            <p className="text-muted-foreground">{w.description}</p>
            <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div><dt className="text-xs text-muted-foreground">{t.worklist.assignedTo}</dt><dd className="font-medium">{w.assignedTo}</dd></div>
              <div><dt className="text-xs text-muted-foreground">{t.worklist.createdAt}</dt><dd className="font-medium">{fmt(w.createdAt)}</dd></div>
            </dl>
            <details className="mt-3 rounded-lg border border-border p-3">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.worklist.whyPriority}</summary>
              <p className="mt-2 text-sm">{whyPriority[w.severity]}</p>
            </details>
            <button onClick={() => setSelId(w.id)} className="mt-3 w-full rounded-md border border-input px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent sm:hidden">Open details</button>
          </div>
        )}
      </div>
    );
  };

  if (sel) {
    return (
      <div className="h-full overflow-y-auto p-4 sm:p-6">
        <button onClick={() => setSelId(undefined)} className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden />{t.worklist.title}
        </button>
        <div className="mx-auto max-w-2xl">
          <Panel>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{sel.id}</p>
            <h1 className="mt-0.5 font-display text-lg font-bold">{sel.title}</h1>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <SevBadge sev={sel.severity} label={t.severity[sel.severity]} />
              <Chip label={sel.status} tone="info" />
              <Chip label={sel.utilityType} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{sel.description}</p>
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div><dt className="text-xs text-muted-foreground">{t.worklist.filterArea}</dt><dd className="font-medium">{sel.area}</dd></div>
              <div><dt className="text-xs text-muted-foreground">{t.worklist.assignedTo}</dt><dd className="font-medium">{sel.assignedTo}</dd></div>
              <div><dt className="text-xs text-muted-foreground">{t.worklist.createdAt}</dt><dd className="font-medium">{fmt(sel.createdAt)}</dd></div>
            </dl>
          </Panel>
          <Panel title={t.worklist.whyPriority} className="mt-4"><p className="text-sm">{whyPriority[sel.severity]}</p></Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-xl font-bold sm:text-2xl">{t.worklist.title}</h1>
          <p className="text-sm text-muted-foreground">{list.length} of {workItems.length} issues · {workItems.filter((w) => w.severity === 'critical').length} critical</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Field label={t.worklist.filterSeverity}><select className="input" value={sev} onChange={(e) => setSev(e.target.value)}><option value="all">{t.worklist.all}</option>{['critical', 'high', 'medium', 'low'].map((s) => <option key={s} value={s}>{t.severity[s as keyof typeof t.severity]}</option>)}</select></Field>
          <Field label={t.worklist.filterStatus}><select className="input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">{t.worklist.all}</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
          <Field label={t.worklist.filterType}><select className="input" value={type} onChange={(e) => setType(e.target.value)}><option value="all">{t.worklist.all}</option>{types.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
          <Field label={t.worklist.filterArea}><select className="input" value={area} onChange={(e) => setArea(e.target.value)}><option value="all">{t.worklist.all}</option>{areas.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
          <Field label="Sort"><select className="input" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest</option><option value="severity">Severity</option></select></Field>
        </div>
        {list.length === 0
          ? <EmptyState title="No issues match these filters" hint="Reset a filter or widen your selection to see more work items." />
          : <div className="stagger space-y-3">{list.map(card)}</div>}
      </div>
    </div>
  );
}
