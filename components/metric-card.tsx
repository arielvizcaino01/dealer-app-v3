import { ReactNode } from 'react';

export function MetricCard({ title, value, hint, icon }: { title: string; value: string; hint: string; icon?: ReactNode }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        {icon}
      </div>
      <p className="text-sm text-slate-400">{hint}</p>
    </div>
  );
}
