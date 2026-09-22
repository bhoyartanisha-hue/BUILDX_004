import { useState } from 'react';
import { Search } from 'lucide-react';
import { relativeTime } from '../data';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Button } from '@/components/ui/button';
import { Chip, EmptyState, Panel, SevBadge } from '../ui';

export default function TrackerScreen() {
  const { lang, focus, go } = useApp();
  const { complaints } = useAnvaya();
  const t = useT(lang);
  const [q, setQ] = useState(focus ?? '');
  const [seen, setSeen] = useState(false);
  const sel = seen ? complaints.find((c) => c.id === q.trim().toUpperCase()) ?? null : null;

  const stages = ['received', 'assigned', 'in-progress', 'resolved'] as const;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="font-display text-xl font-bold sm:text-2xl">{t.tracker.title}</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className="input" placeholder={t.tracker.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t.tracker.searchPlaceholder} />
          <Button variant="outline" onClick={() => setSeen(true)} className="shrink-0"><Search className="h-4 w-4" aria-hidden />{t.tracker.track}</Button>
        </div>

        {seen && !sel && (
          <EmptyState title={t.tracker.empty} hint={`${t.tracker.emptyHint} ${complaints.length ? '' : 'No complaints have been filed yet.'}`} />
        )}

        {sel && (
          <div className="stagger space-y-4">
            <Panel>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{sel.id}</p>
              <h2 className="mt-0.5 font-display text-lg font-bold">{sel.title}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <SevBadge sev={sel.severity} label={t.severity[sel.severity]} />
                <Chip label={sel.status} tone={sel.status === 'resolved' ? 'ok' : 'info'} />
                <Chip label={sel.department} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{sel.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">{sel.location} · filed {relativeTime(sel.createdAt)}</p>
              {sel.photo && <img src={sel.photo} alt={`Photo for complaint ${sel.id}`} className="mt-3 max-h-48 w-full rounded-lg object-cover" />}
            </Panel>
            <Panel title={t.tracker.timeline}>
              <ol className="space-y-4">
                {stages.map((s, i) => {
                  const done = stages.indexOf(sel.status) >= i;
                  return (
                    <li key={s} className="flex items-start gap-3">
                      <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${done ? 'bg-ok/20 text-ok' : 'bg-muted text-muted-foreground'}`} aria-hidden>{done ? '✓' : i + 1}</span>
                      <div>
                        <p className={`text-sm font-semibold ${done ? '' : 'text-muted-foreground'}`}>{t.tracker[s === 'in-progress' ? 'inProgress' : s]}</p>
                        {s === sel.status && <p className="text-xs text-muted-foreground">Current stage · updated {relativeTime(sel.createdAt)}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Panel>
          </div>
        )}

        {!sel && !seen && complaints.length > 0 && (
          <Panel title="Recent complaints">
            <div className="space-y-2">
              {complaints.slice(0, 4).map((c) => (
                <button key={c.id} onClick={() => { setQ(c.id); setSeen(true); }} className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all duration-200 hover:border-ring">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.id} · {relativeTime(c.createdAt)}</p>
                  </div>
                  <Chip label={c.status} tone={c.status === 'resolved' ? 'ok' : 'info'} />
                </button>
              ))}
            </div>
          </Panel>
        )}

        {!sel && !seen && (
          <Button variant="ghost" onClick={() => go('file-complaint')}>{t.dashboard.fileComplaint}</Button>
        )}
      </div>
    </div>
  );
}
