import { useEffect, useState, type ReactNode } from 'react';
import type { Severity } from './types';

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => { setH(true); }, []);
  return h;
}

const chipTones = {
  ok: 'border-ok/40 bg-ok/10 text-ok',
  warn: 'border-warn/40 bg-warn/10 text-warn',
  bad: 'border-bad/40 bg-bad/10 text-bad',
  info: 'border-info/40 bg-info/10 text-info',
  neutral: 'border-border bg-muted text-muted-foreground',
} as const;
export type Tone = keyof typeof chipTones;

export function Chip({ label, tone = 'neutral' }: { label: ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${chipTones[tone]}`}>{label}</span>;
}

const sevTone: Record<Severity, Tone> = { critical: 'bad', high: 'warn', medium: 'info', low: 'ok' };
export function SevBadge({ sev, label }: { sev: Severity; label: string }) {
  return <Chip tone={sevTone[sev]} label={label} />;
}

export function statusTone(s: string): Tone {
  if (['approved', 'resolved', 'active', 'low'].includes(s)) return 'ok';
  if (['rejected', 'expired', 'critical'].includes(s)) return 'bad';
  if (['submitted', 'expiring', 'in-progress', 'high'].includes(s)) return 'warn';
  if (['assigned', 'received', 'medium'].includes(s)) return 'info';
  return 'neutral';
}

export function Panel({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-border bg-card p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, tone = 'neutral' }: { label: string; value: ReactNode; tone?: Tone }) {
  return (
    <div className={`rounded-xl border p-3.5 ${chipTones[tone]}`}>
      <div className="font-display text-2xl font-bold leading-none">{value}</div>
      <div className="mt-1.5 text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}

export function Meter({ value, label }: { value: number; label?: string }) {
  const color = value >= 70 ? 'bg-ok' : value >= 45 ? 'bg-warn' : 'bg-bad';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <div>
        <p className="font-display font-semibold">{title}</p>
        {hint && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export function Field({ label, children, hint, error }: { label: string; children: ReactNode; hint?: string | undefined; error?: string | undefined }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="block text-xs font-medium text-bad">{error}</span> : hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0] ?? '').slice(0, 2).join('').toUpperCase() || 'A';
}

export function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}
