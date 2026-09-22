import { useEffect, useState } from 'react';
import { Check, Languages, Moon, Sun } from 'lucide-react';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Button } from '@/components/ui/button';
import { Field, Panel, initials } from '../ui';
import type { Lang, Profile, Role } from '../types';

export default function SettingsScreen() {
  const { lang, setLang } = useApp();
  const { profile, setProfile, complaints, orders } = useAnvaya();
  const t = useT(lang);
  const [form, setForm] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  const [dark, setDark] = useState(true);
  const [prefs, setPrefs] = useState({ expiry: true, verification: true, escalation: true, system: false });

  useEffect(() => setForm(profile), [profile]);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);

  const set = (k: keyof Profile) => (e: { target: { value: string } }) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const save = () => {
    setProfile({ ...form, role: form.role as Role });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const myComplaints = complaints.filter((c) => c.citizen === profile.name);
  const myOrders = orders.filter((o) => o.contractor === profile.name);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="font-display text-xl font-bold sm:text-2xl">{t.settings.title}</h1>

        <Panel title={t.settings.account}>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 font-display text-lg font-bold text-primary">{initials(form.name)}</span>
            <div>
              <p className="font-display font-bold">{form.name || '—'}</p>
              <p className="text-xs capitalize text-muted-foreground">{form.role} · {form.zone}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Name"><input className="input" value={form.name} onChange={set('name')} /></Field>
            <Field label={t.settings.role}><select className="input" value={form.role} onChange={set('role')}><option value="official">official</option><option value="citizen">citizen</option></select></Field>
            <Field label={t.settings.zone2}><input className="input" value={form.zone} onChange={set('zone')} /></Field>
            <Field label={t.expiry.filterWard}><input className="input" value={form.ward} onChange={set('ward')} /></Field>
            <Field label={t.settings.email}><input className="input" type="email" value={form.email} onChange={set('email')} /></Field>
            <Field label="Phone"><input className="input" value={form.phone} onChange={set('phone')} /></Field>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={save}><Check className="h-4 w-4" aria-hidden />Save</Button>
            {saved && <span className="text-sm font-medium text-ok">Profile updated.</span>}
          </div>
        </Panel>

        <Panel title={t.settings.language}>
          <p className="mb-3 text-sm text-muted-foreground">{t.settings.languageDesc}</p>
          <div className="flex gap-2" role="group" aria-label={t.settings.language}>
            {(['en', 'hi', 'mr'] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold uppercase transition-colors duration-200 ${lang === l ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}>
                <Languages className="h-3.5 w-3.5" aria-hidden />{l}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={t.settings.appearance}>
          <div className="flex gap-2" role="group" aria-label={t.settings.theme}>
            <button onClick={() => setDark(true)} aria-pressed={dark} className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${dark ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}>
              <Moon className="h-3.5 w-3.5" aria-hidden />{t.settings.dark}
            </button>
            <button onClick={() => setDark(false)} aria-pressed={!dark} className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${!dark ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}>
              <Sun className="h-3.5 w-3.5" aria-hidden />{t.settings.light}
            </button>
          </div>
        </Panel>

        <Panel title={t.settings.notifications2}>
          <div className="space-y-1">
            {([['expiry', t.settings.notifExpiry], ['verification', t.settings.notifVerification], ['escalation', t.settings.notifEscalation], ['system', t.settings.notifSystem]] as const).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent">
                <span className="text-sm">{label}</span>
                <input type="checkbox" checked={prefs[key]} onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))} className="h-4 w-4 accent-[var(--primary)]" />
              </label>
            ))}
          </div>
        </Panel>

        <Panel title="My history">
          <p className="text-sm text-muted-foreground">
            {form.role === 'citizen'
              ? `${myComplaints.length} complaint${myComplaints.length === 1 ? '' : 's'} filed as ${profile.name}.`
              : `${myOrders.length} work order${myOrders.length === 1 ? '' : 's'} linked to ${profile.name}.`}
          </p>
        </Panel>
      </div>
    </div>
  );
}
