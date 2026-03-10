'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function ManualVehicleForm() {
  const router = useRouter();

  const [lotNumber, setLotNumber] = useState('');
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [miles, setMiles] = useState('');
  const [titleStatus, setTitleStatus] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    startTransition(async () => {
      try {
        const response = await fetch('/api/vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lotNumber,
            vin,
            make,
            model,
            year: Number(year),
            miles: miles === '' ? null : Number(miles),
            titleStatus,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo crear el vehículo');
        }

        router.push(`/vehicles/${data.id}`);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Lote</label>
          <input
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
            placeholder="77342985"
          />
        </div>

        <div>
          <label className="label">VIN</label>
          <input
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
            placeholder="WBA..."
          />
        </div>

        <div>
          <label className="label">Marca</label>
          <input
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
            placeholder="BMW"
          />
        </div>

        <div>
          <label className="label">Modelo</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
            placeholder="330 XI"
          />
        </div>

        <div>
          <label className="label">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
            placeholder="2018"
          />
        </div>

        <div>
          <label className="label">Millas</label>
          <input
            type="number"
            value={miles}
            onChange={(e) => setMiles(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
            placeholder="85000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Título</label>
          <input
            value={titleStatus}
            onChange={(e) => setTitleStatus(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
            placeholder="Clean Title / Salvage / Rebuilt"
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {isPending ? 'Guardando...' : 'Guardar vehículo'}
      </button>
    </form>
  );
}