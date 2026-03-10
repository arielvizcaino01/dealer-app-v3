'use client';

import { useState } from 'react';

type CollapsibleCardProps = {
  title: string;
  description?: string;
  buttonLabel: string;
  openButtonLabel?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function CollapsibleCard({
  title,
  description,
  buttonLabel,
  openButtonLabel,
  children,
  defaultOpen = false,
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm text-slate-400">{description}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/5"
        >
          <span>{isOpen ? '▾' : '▸'}</span>
          <span>{isOpen ? openButtonLabel || 'Ocultar' : buttonLabel}</span>
        </button>
      </div>

      {isOpen ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}