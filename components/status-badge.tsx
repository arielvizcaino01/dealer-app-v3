const styles: Record<string, string> = {
  PURCHASED: 'bg-slate-700/60 text-slate-200',
  IN_TRANSIT: 'bg-blue-500/20 text-blue-300',
  IN_REPAIR: 'bg-amber-500/20 text-amber-300',
  READY_FOR_SALE: 'bg-emerald-500/20 text-emerald-300',
  SOLD: 'bg-fuchsia-500/20 text-fuchsia-300',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-slate-700 text-slate-200'}`}>
      {status.replaceAll('_', ' ')}
    </span>
  );
}
