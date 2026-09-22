import { Printer, RotateCcw, Search } from 'lucide-react';
import { fmt } from '../ui';
import { useApp } from '../appContext';
import { useAnvaya } from '../store';
import { useT } from '../i18n';
import { Button } from '@/components/ui/button';
import { Chip, EmptyState, SevBadge } from '../ui';

export default function ReceiptScreen() {
  const { lang, receiptId, go } = useApp();
  const { complaints } = useAnvaya();
  const t = useT(lang);
  const c = complaints.find((x) => x.id === receiptId);

  if (!c) {
    return (
      <div className="h-full overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <EmptyState title="No receipt to show" hint="File a complaint first — the receipt is issued at submission time." />
          <Button onClick={() => go('file-complaint')} className="mt-4 w-full">{t.dashboard.fileComplaint}</Button>
        </div>
      </div>
    );
  }

  const qrBlock = (
    <div className="mx-auto grid w-36 grid-cols-11 gap-px rounded-lg bg-foreground p-2" aria-label={`QR code for tracking ID ${c.id}`} role="img">
      {Array.from({ length: 121 }, (_, i) => {
        const h = (c.id.charCodeAt(i % c.id.length) * 31 + i * 7) % 97;
        return <span key={i} className={`aspect-square ${h % 2 === 0 ? 'bg-foreground' : 'bg-background'}`} />;
      })}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-lg">
        <div className="receipt-card rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Anvaya · Complaint Receipt</p>
            <h1 className="mt-2 font-display text-2xl font-bold">{c.id}</h1>
            <p className="mt-1 text-xs text-muted-foreground">{fmt(c.createdAt)}</p>
          </div>
          <div className="my-5 border-t border-dashed border-border" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t.complaint.issueTitle}</dt><dd className="text-right font-medium">{c.title}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t.complaint.category}</dt><dd className="font-medium capitalize">{c.category}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t.complaint.department}</dt><dd className="text-right font-medium">{c.department}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t.complaint.road}</dt><dd className="text-right font-medium">{c.location}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{t.complaint.severity}</dt><dd><SevBadge sev={c.severity} label={t.severity[c.severity]} /></dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Status</dt><dd><Chip label={c.status} tone="info" /></dd></div>
          </dl>
          <div className="my-5 border-t border-dashed border-border" />
          {qrBlock}
          <p className="mt-3 text-center font-mono text-xs text-muted-foreground">Scan or quote {c.id} to track progress</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 print:hidden sm:grid-cols-3">
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden />{t.receipt.print}</Button>
          <Button variant="outline" onClick={() => go('tracker', c.id)}><Search className="h-4 w-4" aria-hidden />{t.receipt.track}</Button>
          <Button variant="ghost" onClick={() => go('file-complaint')}><RotateCcw className="h-4 w-4" aria-hidden />{t.receipt.newComplaint}</Button>
        </div>
      </div>
    </div>
  );
}
