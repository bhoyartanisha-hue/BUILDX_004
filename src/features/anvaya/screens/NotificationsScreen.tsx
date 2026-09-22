import { Bell, ShieldCheck, TrendingUp, CalendarClock } from 'lucide-react';
import { relativeTime } from '../data';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Button } from '@/components/ui/button';
import { EmptyState } from '../ui';

const icons = { expiry: CalendarClock, verification: ShieldCheck, escalation: TrendingUp };

export default function NotificationsScreen() {
  const { lang } = useApp();
  const { notices, markRead } = useAnvaya();
  const t = useT(lang);
  const unread = notices.filter((n) => !n.read).length;
  const dayAgo = Date.now() - 86400000;
  const recent = notices.filter((n) => +new Date(n.createdAt) >= dayAgo);
  const earlier = notices.filter((n) => +new Date(n.createdAt) < dayAgo);

  const item = (id: string) => notices.find((n) => n.id === id)!;
  const render = (n: (typeof notices)[number]) => {
    const Icon = icons[n.type];
    const label = t.notifications[n.type as keyof typeof t.notifications] ?? n.type;
    return (
      <button key={n.id} onClick={() => markRead(n.id)}
        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:border-ring ${n.read ? 'border-border bg-card opacity-70' : 'border-primary/40 bg-primary/5'}`}>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${n.read ? 'bg-muted text-muted-foreground' : 'bg-primary/15 text-primary'}`} aria-hidden><Icon className="h-4 w-4" /></span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
            {!n.read && <span className="h-2 w-2 rounded-full bg-sev-critical" aria-label="unread" />}
          </span>
          <span className="mt-0.5 block font-display font-semibold leading-snug">{n.title}</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{n.message}</span>
          <span className="mt-1 block text-xs text-muted-foreground">{relativeTime(n.createdAt)}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-xl font-bold sm:text-2xl">{t.notifications.title}</h1>
          <Button variant="outline" size="sm" onClick={() => markRead()} disabled={unread === 0}>
            <Bell className="h-3.5 w-3.5" aria-hidden />{t.notifications.markAllRead} ({unread})
          </Button>
        </div>
        {notices.length === 0 ? (
          <EmptyState title={t.notifications.empty} />
        ) : (
          <>
            {recent.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent</h2>
                {recent.map((n) => render(n))}
              </section>
            )}
            {earlier.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earlier</h2>
                {earlier.map((n) => render(n))}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
