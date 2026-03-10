'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function CopartImportForm() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const response = await fetch('/api/copart/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: input,
            purchasePrice: purchasePrice === '' ? 0 : Number(purchasePrice),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo importar el vehículo');
        }

        setSuccess('Vehículo importado correctamente');
        setInput('');
        setPurchasePrice('');
        router.push(`/vehicles/${data.id}`);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="copartInput" className="label">
          Link de Copart
        </label>

        <input
          id="copartInput"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ejemplo: https://www.copart.com/lot/12345678"
          className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="purchasePrice" className="label">
          Total pagado en Copart
        </label>

        <input
          id="purchasePrice"
          type="number"
          step="0.01"
          min="0"
          value={purchasePrice}
          onChange={(event) => setPurchasePrice(event.target.value)}
          placeholder="Ejemplo: 4200 (compra + fees de Copart)"
          className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {isPending ? 'Importando...' : 'Importar desde Copart'}
        </button>

        {success && <p className="text-sm text-emerald-300">{success}</p>}
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </div>
    </form>
  );
}