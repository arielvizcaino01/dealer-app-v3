'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type Props = {
  vehicleId: string;
  currentStatus: 'PURCHASED' | 'IN_TRANSIT' | 'IN_REPAIR' | 'READY_FOR_SALE' | 'SOLD';
};

const statusOptions = [
  { value: 'PURCHASED', label: 'Comprado' },
  { value: 'IN_TRANSIT', label: 'En transporte' },
  { value: 'IN_REPAIR', label: 'En reparación' },
  { value: 'READY_FOR_SALE', label: 'Listo para vender' },
  { value: 'SOLD', label: 'Vendido' },
] as const;

export function EditVehicleStatusForm({ vehicleId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo actualizar el estado');
        }

        setSuccess('Estado actualizado');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Estado del vehículo</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Props['currentStatus'])}
          className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white outline-none"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {isPending ? 'Guardando...' : 'Guardar estado'}
      </button>

      {success && <p className="text-sm text-emerald-300">{success}</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </form>
  );
}