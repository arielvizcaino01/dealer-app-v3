'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function DeleteVehicleButton({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const confirmed = window.confirm(
      '¿Seguro que quieres eliminar este vehículo? También se borrarán sus gastos y fotos.'
    );

    if (!confirmed) return;

    setError('');

    startTransition(async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo eliminar el vehículo');
        }

        router.push('/vehicles');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-2xl border border-red-400/30 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
      >
        {isPending ? 'Eliminando...' : 'Eliminar vehículo'}
      </button>

      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  );
}