'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ImportForm() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/vehicles/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkOrLot: value }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo importar el vehículo');
      }

      router.push(`/vehicles/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Pega el link de Copart o escribe el número de lote</label>
        <textarea
          className="mt-2 min-h-28 w-full"
          placeholder="Ejemplo: https://www.copart.com/lot/12345678 o 12345678"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Importando...' : 'Importar vehículo'}
      </button>
    </form>
  );
}
