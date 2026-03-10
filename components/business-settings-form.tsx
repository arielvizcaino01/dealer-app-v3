'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type BusinessSettingsFormProps = {
  initialCapital: number;
};

export function BusinessSettingsForm({ initialCapital }: BusinessSettingsFormProps) {
  const router = useRouter();
  const [capital, setCapital] = useState(String(initialCapital));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const response = await fetch('/api/business-settings', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initialCapital: Number(capital),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo guardar el capital inicial');
        }

        setSuccess('Capital inicial guardado');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="initialCapital" className="label">
          Capital inicial
        </label>
        <input
          id="initialCapital"
          type="number"
          step="0.01"
          value={capital}
          onChange={(event) => setCapital(event.target.value)}
          placeholder="Ejemplo: 25000"
          className="mt-2 w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? 'Guardando...' : 'Guardar capital'}
        </button>

        {success && <p className="text-sm text-emerald-300">{success}</p>}
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </div>
    </form>
  );
}