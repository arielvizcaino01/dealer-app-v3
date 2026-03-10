'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  'TRANSPORT',
  'PARTS',
  'LABOR',
  'TAXES',
  'REPAIR',
  'OTHER',
] as const;

export function ExpenseForm({ vehicleId }: { vehicleId: string }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('TRANSPORT');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount: Number(amount), category }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar el gasto');

      setDescription('');
      setAmount('');
      setCategory('TRANSPORT');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="label">Descripción</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-2 w-full" placeholder="Ejemplo: bumper delantero" />
        </div>
        <div>
          <label className="label">Monto</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} required type="number" min="0" step="0.01" className="mt-2 w-full" placeholder="280" />
        </div>
      </div>
      <div>
        <label className="label">Categoría</label>
        <select value={category} onChange={(e) => setCategory(e.target.value as (typeof categories)[number])} className="mt-2 w-full">
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      <button type="submit" disabled={saving} className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-60">
        {saving ? 'Guardando...' : 'Agregar gasto'}
      </button>
    </form>
  );
}
