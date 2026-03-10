'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type Props = {
  vehicleId: string;
  lotNumber: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  miles: number | null;
  titleStatus: string | null;
};

export function EditVehicleDetailsForm({
  vehicleId,
  lotNumber,
  vin,
  make,
  model,
  year,
  miles,
  titleStatus,
}: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [lot, setLot] = useState(lotNumber);
  const [vehicleVin, setVehicleVin] = useState(vin);
  const [vehicleMake, setVehicleMake] = useState(make);
  const [vehicleModel, setVehicleModel] = useState(model);
  const [vehicleYear, setVehicleYear] = useState(String(year));
  const [vehicleMiles, setVehicleMiles] = useState(miles != null ? String(miles) : '');
  const [vehicleTitle, setVehicleTitle] = useState(titleStatus ?? '');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setError('');
    setSuccess('');
    setIsOpen(true);
  }

  function handleCancel() {
    setLot(lotNumber);
    setVehicleVin(vin);
    setVehicleMake(make);
    setVehicleModel(model);
    setVehicleYear(String(year));
    setVehicleMiles(miles != null ? String(miles) : '');
    setVehicleTitle(titleStatus ?? '');
    setError('');
    setSuccess('');
    setIsOpen(false);
  }

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
          body: JSON.stringify({
            lotNumber: lot,
            vin: vehicleVin,
            make: vehicleMake,
            model: vehicleModel,
            year: Number(vehicleYear),
            miles: vehicleMiles === '' ? null : Number(vehicleMiles),
            titleStatus: vehicleTitle,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo actualizar el vehículo');
        }

        setSuccess('Datos generales actualizados');
        router.refresh();
        setIsOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  if (!isOpen) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleOpen}
          className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500"
        >
          Editar datos generales
        </button>

        {success && <p className="text-sm text-emerald-300">{success}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Lote</label>
          <input
            value={lot}
            onChange={(e) => setLot(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="label">VIN</label>
          <input
            value={vehicleVin}
            onChange={(e) => setVehicleVin(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="label">Marca</label>
          <input
            value={vehicleMake}
            onChange={(e) => setVehicleMake(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="label">Modelo</label>
          <input
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="label">Year</label>
          <input
            type="number"
            value={vehicleYear}
            onChange={(e) => setVehicleYear(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="label">Millas</label>
          <input
            type="number"
            value={vehicleMiles}
            onChange={(e) => setVehicleMiles(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Título</label>
          <input
            value={vehicleTitle}
            onChange={(e) => setVehicleTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
            placeholder="Clean / Salvage / Rebuilt"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {isPending ? 'Guardando...' : 'Guardar datos generales'}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="rounded-2xl border border-border px-4 py-3 font-semibold text-slate-100 hover:bg-white/5 disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>

      {success && <p className="text-sm text-emerald-300">{success}</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </form>
  );
}