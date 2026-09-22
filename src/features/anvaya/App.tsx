import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Bell, ClipboardList, FilePlus2, Hourglass, LayoutDashboard, Map as MapIcon,
  Milestone, Radar, Search as SearchIcon, Settings as SettingsIcon, ShieldCheck,
} from 'lucide-react';
import { AnvayaProvider, useAnvaya } from './store';
import { AppCtx, useApp } from './appContext';
import { useT } from './i18n';
import { initials } from './ui';
import type { Lang, Screen } from './types';
import MapScreen from './screens/MapScreen';
import RoadsScreen from './screens/RoadsScreen';
import WorkListScreen from './screens/WorkListScreen';
import VerificationScreen from './screens/VerificationScreen';
import ExpiryScreen from './screens/ExpiryScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SettingsScreen from './screens/SettingsScreen';
import DashboardScreen from './screens/DashboardScreen';
import FileComplaintScreen from './screens/FileComplaintScreen';
import TrackerScreen from './screens/TrackerScreen';
import ReceiptScreen from './screens/ReceiptScreen';

const citizenLabels: Record<Lang, { dashboard: string; file: string; track: string }> = {
  en: { dashboard: 'Dashboard', file: 'File Complaint', track: 'Track' },
  hi: { dashboard: 'डैशबोर्ड', file: 'शिकायत दर्ज करें', track: 'ट्रैक करें' },
  mr: { dashboard: 'डॅशबोर्ड', file: 'तक्रार नोंदवा', track: 'मागोवा' },
};

interface NavItem { id: Screen; icon: LucideIcon; label: string }

function AppInner() {
  const { profile, notices } = useAnvaya();
  const [lang, setLang] = useState<Lang>('en');
  const [screen, setScreen] = useState<Screen>(profile.role === 'official' ? 'map' : 'dashboard');
  const [focus, setFocus] = useState<string | undefined>(undefined);
  const [receiptId, setReceiptId] = useState<string | undefined>(undefined);
  const t = useT(lang);

  const go = (s: Screen, f?: string) => { setScreen(s); setFocus(f); };
  const openReceipt = (id: string) => { setReceiptId(id); setScreen('receipt'); };

  const officialNav: NavItem[] = useMemo(() => [
    { id: 'map', icon: MapIcon, label: t.nav.map },
    { id: 'roads', icon: Milestone, label: t.nav.roads },
    { id: 'work-list', icon: ClipboardList, label: t.nav.work },
    { id: 'verification', icon: ShieldCheck, label: t.nav.verification },
    { id: 'expiry', icon: Hourglass, label: t.nav.expiry },
    { id: 'search', icon: SearchIcon, label: t.nav.search },
    { id: 'notifications', icon: Bell, label: t.nav.notifications },
    { id: 'settings', icon: SettingsIcon, label: t.nav.settings },
  ], [t]);

  const cl = citizenLabels[lang];
  const citizenNav: NavItem[] = useMemo(() => [
    { id: 'dashboard', icon: LayoutDashboard, label: cl.dashboard },
    { id: 'file-complaint', icon: FilePlus2, label: cl.file },
    { id: 'tracker', icon: Radar, label: cl.track },
    { id: 'search', icon: SearchIcon, label: t.nav.search },
    { id: 'notifications', icon: Bell, label: t.nav.notifications },
    { id: 'settings', icon: SettingsIcon, label: t.nav.settings },
  ], [cl, t]);

  const nav = profile.role === 'official' ? officialNav : citizenNav;
  const unread = notices.filter((n) => !n.read).length;

  useEffect(() => {
    const allowed = (profile.role === 'official' ? officialNav : citizenNav).map((n) => n.id);
    if (!allowed.includes(screen)) go(profile.role === 'official' ? 'map' : 'dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.role]);

  const screenEl = (() => {
    switch (screen) {
      case 'map': return <MapScreen />;
      case 'roads': return <RoadsScreen />;
      case 'work-list': return <WorkListScreen />;
      case 'verification': return <VerificationScreen />;
      case 'expiry': return <ExpiryScreen />;
      case 'search': return <SearchScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'settings': return <SettingsScreen />;
      case 'dashboard': return <DashboardScreen />;
      case 'file-complaint': return <FileComplaintScreen />;
      case 'tracker': return <TrackerScreen />;
      case 'receipt': return <ReceiptScreen />;
    }
  })();

  return (
    <AppCtx.Provider value={{ lang, setLang, screen, focus, go, receiptId, openReceipt }}>
      <div className="flex h-dvh overflow-hidden bg-background text-foreground">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
          <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">A</span>
            <span>
              <span className="block font-display text-base font-bold leading-tight">{t.appName}</span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{t.tagline}</span>
            </span>
          </div>
          <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto p-3">
            {nav.map((item) => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                  {item.id === 'notifications' && unread > 0 && (
                    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-sev-critical px-1.5 text-[10px] font-bold text-white">{unread}</span>
                  )}
                </button>
              );
            })}
          </nav>
          <button onClick={() => go('settings')} className="flex items-center gap-3 border-t border-border px-4 py-3 text-left transition-colors duration-200 hover:bg-accent">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">{initials(profile.name)}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{profile.name}</span>
              <span className="block truncate text-xs capitalize text-muted-foreground">{profile.role} · {profile.ward}</span>
            </span>
          </button>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
            <button className="flex items-center gap-2 md:hidden" onClick={() => go(profile.role === 'official' ? 'map' : 'dashboard')} aria-label={t.appName}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">A</span>
              <span className="font-display text-base font-bold">{t.appName}</span>
            </button>
            <button
              onClick={() => go('search')}
              className="hidden h-9 w-full max-w-sm items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors duration-200 hover:border-ring sm:flex"
            >
              <SearchIcon className="h-3.5 w-3.5" aria-hidden />
              {t.search}
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => go('notifications')}
                aria-label={t.nav.notifications}
                className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
              >
                <Bell className="h-4.5 w-4.5" aria-hidden />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sev-critical px-1 text-[9px] font-bold text-white">{unread}</span>
                )}
              </button>
              <button
                onClick={() => go('settings')}
                aria-label={t.nav.settings}
                className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground transition-transform duration-200 hover:scale-105"
              >
                {initials(profile.name)}
              </button>
            </div>
          </header>
          <main className="min-h-0 flex-1">{screenEl}</main>
          <nav aria-label="Primary" className="flex shrink-0 overflow-x-auto border-t border-border bg-card md:hidden">
            {nav.map((item) => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[10px] font-medium transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <item.icon className="h-5 w-5" aria-hidden />
                  <span className="max-w-full truncate">{item.label}</span>
                  {item.id === 'notifications' && unread > 0 && (
                    <span className="absolute right-2 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sev-critical px-1 text-[9px] font-bold text-white">{unread}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </AppCtx.Provider>
  );
}

export function AnvayaApp() {
  return (
    <AnvayaProvider>
      <AppInner />
    </AnvayaProvider>
  );
}

export { useApp };
