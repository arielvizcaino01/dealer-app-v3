'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type Props = {
  vehicleId: string;
  purchasePrice: number;
  actualSalePrice: number | null;
};

export function EditVehicleFinancialsForm({
  vehicleId,
  purchasePrice,
  actualSalePrice,
}: Props) {
  const router = useRouter();
  const [purchase, setPurchase] = useState(String(purchasePrice));
  const [actualSale, setActualSale] = useState(
    actualSalePrice != null ? String(actualSalePrice) : ''
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const res = await fetch(`/api/vehicles/${vehicleId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            purchasePrice: Number(purchase),
            actualSalePrice: actualSale === '' ? null : Number(actualSale),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'No se pudo actualizar');
        }

        setSuccess('Datos actualizados');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Precio de compra</label>
        <input
          type="number"
          value={purchase}
          onChange={(e) => setPurchase(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
        />
      </div>

      <div>
        <label className="label">Venta real</label>
        <input
          type="number"
          value={actualSale}
          onChange={(e) => setActualSale(e.target.value)}
          placeholder="Vacío si no se ha vendido"
          className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500"
      >
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </button>

      {success && <p className="text-sm text-emerald-300">{success}</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </form>
  );
}