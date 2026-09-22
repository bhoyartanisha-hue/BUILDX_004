import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { expiryAssets, expiryStatus } from '../data';
import { useApp } from '../appContext';
import { useT } from '../i18n';
import { Chip, EmptyState, Field, Panel, Stat, statusTone } from '../ui';

function days(iso: string) {
  return Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
}

export default function ExpiryScreen() {
  const { lang, focus } = useApp();
  const t = useT(lang);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [ward, setWard] = useState('all');
  const [sort, setSort] = useState('date');
  const [selId, setSelId] = useState<string | undefined>(focus);

  useEffect(() => { if (focus) setSelId(focus); }, [focus]);

  const types = useMemo(() => [...new Set(expiryAssets.map((a) => a.type))], []);
  const wards = useMemo(() => [...new Set(expiryAssets.map((a) => a.ward))], []);

  const rows = useMemo(() => expiryAssets
    .map((a) => ({ ...a, st: expiryStatus(a.expiryDate), d: days(a.expiryDate) }))
    .filter((a) => (status === 'all' || a.st === status) && (type === 'all' || a.type === type) && (ward === 'all' || a.ward === ward) && `${a.name} ${a.id} ${a.ward}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'date' ? a.d - b.d : a.name.localeCompare(b.name)),
  [q, status, type, ward, sort]);

  const all = expiryAssets.map((a) => ({ ...a, st: expiryStatus(a.expiryDate) }));
  const cExpiring = all.filter((a) => a.st === 'expiring').length;
  const cExpired = all.filter((a) => a.st === 'expired').length;
  const sel = rows.find((a) => a.id === selId) ?? all.find((a) => a.id === selId);

  if (sel) {
    const d = days(sel.expiryDate);
    return (
      <div className="h-full overflow-y-auto p-4 sm:p-6">
        <button onClick={() => setSelId(undefined)} className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden />{t.expiry.title}
        </button>
        <div className="mx-auto max-w-2xl space-y-4">
          <Panel>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{sel.id}</p>
            <h1 className="mt-0.5 font-display text-lg font-bold">{sel.name}</h1>
            <div className="mt-2 flex gap-1.5"><Chip label={t.status[sel.st as keyof typeof t.status]} tone={statusTone(sel.st)} /><Chip label={sel.type} /><Chip label={sel.ward} /></div>
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div><dt className="text-xs text-muted-foreground">{t.expiry.expiresOn}</dt><dd className="font-medium">{sel.expiryDate}</dd></div>
              <div><dt className="text-xs text-muted-foreground">{t.expiry.daysLeft}</dt><dd className="font-medium">{d >= 0 ? `${d} ${t.expiry.daysLeft}` : `${Math.abs(d)} ${t.expiry.daysAgo}`}</dd></div>
              <div><dt className="text-xs text-muted-foreground">{t.expiry.filterWard}</dt><dd className="font-medium">{sel.ward}</dd></div>
            </dl>
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-xl font-bold sm:text-2xl">{t.expiry.title}</h1>
        <div className="grid grid-cols-3 gap-3">
          <Stat label={t.status.active} value={all.length - cExpiring - cExpired} tone="ok" />
          <Stat label={t.status.expiring} value={cExpiring} tone="warn" />
          <Stat label={t.status.expired} value={cExpired} tone="bad" />
        </div>
        <input className="input" placeholder={t.expiry.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t.expiry.searchPlaceholder} />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Field label={t.expiry.filterStatus}><select className="input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">{t.worklist.all}</option><option value="active">{t.status.active}</option><option value="expiring">{t.status.expiring}</option><option value="expired">{t.status.expired}</option></select></Field>
          <Field label={t.expiry.filterType}><select className="input" value={type} onChange={(e) => setType(e.target.value)}><option value="all">{t.worklist.all}</option>{types.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
          <Field label={t.expiry.filterWard}><select className="input" value={ward} onChange={(e) => setWard(e.target.value)}><option value="all">{t.worklist.all}</option>{wards.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
          <Field label="Sort"><select className="input" value={sort} onChange={(e) => setSort(e.target.value)}><option value="date">Soonest first</option><option value="name">Name</option></select></Field>
        </div>
        {rows.length === 0
          ? <EmptyState title="No assets match" hint="Adjust the search or filters to see more assets." />
          : <div className="stagger space-y-3">
              {rows.map((a) => (
                <button key={a.id} onClick={() => setSelId(a.id)} className="flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:border-ring sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold">{a.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.id} · {a.type} · {a.ward}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{a.expiryDate} · {a.d >= 0 ? `${a.d} ${t.expiry.daysLeft}` : `${Math.abs(a.d)} ${t.expiry.daysAgo}`}</span>
                    <Chip label={t.status[a.st as keyof typeof t.status]} tone={statusTone(a.st)} />
                  </div>
                </button>
              ))}
            </div>}
      </div>
    </div>
  );
}
