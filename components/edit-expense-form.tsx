'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type EditExpenseFormProps = {
  expense: {
    id: string;
    description: string;
    amount: number;
    category: string;
  };
};

const categories = [
  { value: 'TRANSPORT', label: 'Transporte' },
  { value: 'PARTS', label: 'Piezas' },
  { value: 'LABOR', label: 'Mano de obra' },
  { value: 'TAXES', label: 'Impuestos' },
  { value: 'REPAIR', label: 'Reparación' },
  { value: 'OTHER', label: 'Otros' },
];

export function EditExpenseForm({ expense }: EditExpenseFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  function toggleOpen() {
    setIsOpen((prev) => !prev);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const response = await fetch(`/api/expenses/${expense.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description,
            amount: Number(amount),
            category,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo actualizar el gasto');
        }

        setSuccess('Gasto actualizado');
        router.refresh();
        setTimeout(() => {
          setIsOpen(false);
          setSuccess('');
        }, 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={toggleOpen}
        className="rounded-xl border border-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/10"
      >
        {isOpen ? 'Cancelar' : 'Editar'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div>
            <label htmlFor={`description-${expense.id}`} className="label">
              Descripción
            </label>
            <input
              id={`description-${expense.id}`}
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label htmlFor={`amount-${expense.id}`} className="label">
              Monto
            </label>
            <input
              id={`amount-${expense.id}`}
              type="number"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            />
          </div>

          <div>
            <label htmlFor={`category-${expense.id}`} className="label">
              Categoría
            </label>
            <select
              id={`category-${expense.id}`}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value} className="bg-slate-900">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>

            {success && <p className="text-sm text-emerald-300">{success}</p>}
            {error && <p className="text-sm text-rose-300">{error}</p>}
          </div>
        </form>
      )}
    </div>
  );
}