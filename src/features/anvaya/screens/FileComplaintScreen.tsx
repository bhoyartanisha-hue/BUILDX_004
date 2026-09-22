import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { roads } from '../data';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Button } from '@/components/ui/button';
import { Field, Panel, SevBadge } from '../ui';
import { ImageUpload } from '../ImageUpload';
import { classifyComplaint } from '../ai';
import type { Severity, UtilityType } from '../types';

export default function FileComplaintScreen() {
  const { lang, go, openReceipt } = useApp();
  const { addComplaint } = useAnvaya();
  const t = useT(lang);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [roadId, setRoadId] = useState('');
  const [category, setCategory] = useState<UtilityType>('chamber');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [err, setErr] = useState('');

  const departments: Record<UtilityType, string> = {
    water: 'Water Supply', sewer: 'Water & Sanitation', gas: 'Emergency Utilities',
    electricity: 'Electrical Services', telecom: 'Telecom Infrastructure', household: 'Water Supply', chamber: 'Public Works Department',
  };

  const suggest = () => {
    const c = classifyComplaint(`${title} ${desc}`);
    setCategory(c.category); setSeverity(c.severity);
  };

  const submit = () => {
    if (title.trim().length < 5) { setErr(t.complaint.errorTitle); return; }
    if (desc.trim().length < 15) { setErr(t.complaint.errorDesc); return; }
    if (!roadId) { setErr(t.complaint.errorRoad); return; }
    const road = roads.find((r) => r.id === roadId)!;
    const id = `ANV-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    addComplaint({
      id, title: title.trim(), description: desc.trim(), category, department: departments[category],
      location: `${road.name}, ${road.ward}`, roadId, status: 'received', severity,
      createdAt: new Date().toISOString(), photo, citizen: 'Asha Deshmukh',
      clusterId: `CLU-${road.id.replace('RD-', '')}-${String(Math.floor(Math.random() * 90) + 10)}`,
    });
    setTitle(''); setDesc(''); setRoadId(''); setPhoto(undefined); setErr('');
    openReceipt(id);
    go('receipt', id);
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="font-display text-xl font-bold sm:text-2xl">{t.complaint.title}</h1>

        <Panel title={t.complaint.issueTitle}>
          <div className="space-y-3">
            <Field label={t.complaint.issueTitle}>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.complaint.issueTitlePlaceholder} />
            </Field>
            <Field label={t.complaint.issueDesc}>
              <textarea className="input min-h-24" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t.complaint.issueDescPlaceholder} />
            </Field>
            {desc.trim().length > 10 && (
              <Button variant="outline" size="sm" onClick={suggest}><Sparkles className="h-3.5 w-3.5" aria-hidden />{t.complaint.suggest}</Button>
            )}
          </div>
        </Panel>

        <Panel title={t.complaint.location}>
          <div className="space-y-3">
            <Field label={t.complaint.road}>
              <select className="input" value={roadId} onChange={(e) => setRoadId(e.target.value)}>
                <option value="">{t.complaint.road}</option>
                {roads.map((r) => <option key={r.id} value={r.id}>{r.name} — {r.ward}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label={t.complaint.category}>
                <select className="input" value={category} onChange={(e) => setCategory(e.target.value as UtilityType)}>
                  {(['water', 'sewer', 'gas', 'electricity', 'telecom', 'chamber'] as UtilityType[]).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={t.complaint.severity}>
                <select className="input" value={severity} onChange={(e) => setSeverity(e.target.value as Severity)}>
                  {(['low', 'medium', 'high', 'critical'] as Severity[]).map((s) => <option key={s} value={s}>{t.severity[s]}</option>)}
                </select>
              </Field>
            </div>
            <p className="flex items-center gap-2 text-sm">
              <SevBadge sev={severity} label={t.severity[severity]} />
              <span className="text-xs text-muted-foreground">{t.complaint.department}: {departments[category]}</span>
            </p>
          </div>
        </Panel>

        <Panel title={t.complaint.photo}>
          <ImageUpload label={t.complaint.photo} value={photo} onChange={setPhoto} />
        </Panel>

        {err && <p className="text-sm font-medium text-bad">{err}</p>}
        <Button onClick={submit} className="w-full">{t.complaint.submit}</Button>
      </div>
    </div>
  );
}
