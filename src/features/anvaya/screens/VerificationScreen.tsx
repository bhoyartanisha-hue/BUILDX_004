import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Button } from '@/components/ui/button';
import { Chip, EmptyState, Field, Panel, statusTone } from '../ui';
import { ImageUpload } from '../ImageUpload';
import type { WorkflowStatus } from '../types';

const steps: WorkflowStatus[] = ['assigned', 'in-progress', 'submitted', 'approved'];

export default function VerificationScreen() {
  const { lang, focus } = useApp();
  const { orders, updateOrder } = useAnvaya();
  const t = useT(lang);
  const [selId, setSelId] = useState<string | undefined>(orders[0]?.id);
  const [before, setBefore] = useState<string | undefined>(undefined);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => { if (focus) setSelId(focus); }, [focus]);
  useEffect(() => { setBefore(undefined); setAfter(undefined); setReason(''); setRejecting(false); setErr(''); setDone(false); }, [selId]);

  const sel = orders.find((o) => o.id === selId);
  const statusLabel = (s: WorkflowStatus) => t.verification[s as keyof typeof t.verification] ?? s;

  const approve = () => {
    if (!before || !after) { setErr('Add both before and after photos before approving.'); return; }
    updateOrder(sel!.id, 'approved');
    setDone(true); setErr('');
  };
  const reject = () => {
    if (!reason.trim()) { setErr('A rejection reason is required.'); return; }
    updateOrder(sel!.id, 'rejected', reason.trim());
    setDone(true); setErr('');
  };

  if (sel) {
    const stepIdx = steps.indexOf(sel.status);
    return (
      <div className="h-full overflow-y-auto p-4 sm:p-6">
        <button onClick={() => setSelId(undefined)} className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden">
          <ArrowLeft className="h-4 w-4" aria-hidden />{t.verification.title}
        </button>
        <div className="mx-auto max-w-2xl space-y-4">
          <Panel>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.verification.workOrder} {sel.id}</p>
            <h1 className="mt-0.5 font-display text-lg font-bold">{sel.title}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip label={statusLabel(sel.status)} tone={statusTone(sel.status)} />
              <Chip label={sel.utilityType} />
              <Chip label={sel.area} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{sel.description}</p>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <div><dt className="text-xs text-muted-foreground">{t.verification.contractor2}</dt><dd className="font-medium">{sel.contractor}</dd></div>
              <div><dt className="text-xs text-muted-foreground">{t.verification.assigned}</dt><dd className="font-medium">{sel.assignedDate}</dd></div>
              {sel.submittedDate && <div><dt className="text-xs text-muted-foreground">{t.verification.submitted}</dt><dd className="font-medium">{sel.submittedDate}</dd></div>}
            </dl>
            {sel.status === 'rejected' && sel.rejectionReason && (
              <p className="mt-3 rounded-lg border border-bad/40 bg-bad/10 p-3 text-sm text-bad"><XCircle className="mr-1.5 inline h-4 w-4" aria-hidden />{t.verification.rejectionReason}: {sel.rejectionReason}</p>
            )}
            {sel.status === 'approved' && (
              <p className="mt-3 rounded-lg border border-ok/40 bg-ok/10 p-3 text-sm text-ok"><CheckCircle2 className="mr-1.5 inline h-4 w-4" aria-hidden />{t.verification.approved} — work closed.</p>
            )}
          </Panel>

          {['assigned', 'in-progress', 'submitted'].includes(sel.status) && !done ? (
            <>
              {sel.status === 'submitted' && (
                <Panel title="Progress">
                  <ol className="flex items-center">
                    {steps.map((s, i) => (
                      <li key={s} className="flex flex-1 items-center last:flex-none">
                        <span className="flex flex-col items-center gap-1">
                          {i <= stepIdx ? <CheckCircle2 className="h-5 w-5 text-ok" aria-hidden /> : <Circle className="h-5 w-5 text-muted-foreground" aria-hidden />}
                          <span className={`text-[10px] font-medium ${i <= stepIdx ? 'text-foreground' : 'text-muted-foreground'}`}>{statusLabel(s)}</span>
                        </span>
                        {i < steps.length - 1 && <span className={`mx-1 h-0.5 flex-1 ${i < stepIdx ? 'bg-ok' : 'bg-muted'}`} aria-hidden />}
                      </li>
                    ))}
                  </ol>
                </Panel>
              )}
              <Panel title={t.verification.evidenceUpload}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ImageUpload label={t.verification.beforePhoto} value={before} onChange={setBefore} />
                  <ImageUpload label={t.verification.afterPhoto} value={after} onChange={setAfter} />
                </div>
                {err && <p className="mt-3 text-xs font-medium text-bad">{err}</p>}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button onClick={approve} className="flex-1"><CheckCircle2 className="h-4 w-4" aria-hidden />{t.verification.approve}</Button>
                  <Button variant="destructive" onClick={() => { setRejecting(true); setErr(''); }} className="flex-1"><XCircle className="h-4 w-4" aria-hidden />{t.verification.reject}</Button>
                </div>
                {rejecting && (
                  <div className="mt-4 space-y-2 rounded-lg border border-bad/40 bg-bad/5 p-3">
                    <Field label={t.verification.rejectionReason} error={err || undefined}>
                      <textarea className="input min-h-20" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </Field>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" onClick={reject}>{t.verification.confirmApprove === 'Confirm Approval' ? 'Confirm rejection' : 'पुष्टि करें'}</Button>
                      <Button variant="ghost" size="sm" onClick={() => { setRejecting(false); setErr(''); }}>Cancel</Button>
                    </div>
                  </div>
                )}
              </Panel>
            </>
          ) : null}
          {done && (
            <Panel><p className="text-sm font-medium text-ok">Decision recorded. The work order status is now “{statusLabel(sel.status)}”.</p></Panel>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-xl font-bold sm:text-2xl">{t.verification.title}</h1>
        {orders.length === 0
          ? <EmptyState title="No work orders yet" />
          : <div className="stagger space-y-3">
              {orders.map((o) => (
                <button key={o.id} onClick={() => setSelId(o.id)} className="w-full rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:border-ring">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{o.id} · {o.contractor}</p>
                      <p className="mt-0.5 truncate font-display font-semibold">{o.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{o.area}</p>
                    </div>
                    <Chip label={statusLabel(o.status)} tone={statusTone(o.status)} />
                  </div>
                </button>
              ))}
            </div>}
      </div>
    </div>
  );
}
