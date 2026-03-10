'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type DeleteExpenseButtonProps = {
  expenseId: string;
};

export function DeleteExpenseButton({ expenseId }: DeleteExpenseButtonProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este gasto?');
    if (!confirmed) return;

    setError('');

    startTransition(async () => {
      try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('No se pudo eliminar el gasto');
        }

        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-xl border border-red-400/30 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
      >
        {isPending ? 'Eliminando...' : 'Eliminar'}
      </button>

      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}