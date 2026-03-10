export const dynamic = 'force-dynamic';


import Link from 'next/link';
import { ManualVehicleForm } from '@/components/manual-vehicle-form';

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nuevo vehículo</h1>
          <p className="mt-1 text-slate-400">
            Carga manual rápida con solo los datos generales esenciales.
          </p>
        </div>

        <Link
          href="/vehicles"
          className="rounded-2xl border border-border px-4 py-3 font-semibold text-slate-100 hover:bg-white/5"
        >
          Volver al inventario
        </Link>
      </div>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Datos generales</h2>
        <p className="mt-2 text-sm text-slate-400">
          Lote, VIN, marca, modelo, year, millas y título.
        </p>

        <div className="mt-5">
          <ManualVehicleForm />
        </div>
      </section>
    </div>
  );
}