'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type VehicleNotesFormProps = {
  vehicleId: string;
  initialNotes: string | null;
};

export function VehicleNotesForm({ vehicleId, initialNotes }: VehicleNotesFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}/notes`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notes }),
        });

        if (!response.ok) {
          throw new Error('No se pudieron guardar las notas');
        }

        setSuccess('Notas guardadas correctamente');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="notes" className="label">
          Notas
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Escribe aquí observaciones del vehículo, piezas pendientes, detalles de reparación, título, transporte, etc."
          className="mt-2 min-h-[140px] w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? 'Guardando...' : 'Guardar notas'}
        </button>

        {success && <p className="text-sm text-emerald-300">{success}</p>}
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </div>
    </form>
  );
}