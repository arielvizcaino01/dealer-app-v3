import Link from 'next/link';
import { CarFront, LayoutDashboard, PlusCircle } from 'lucide-react';
import { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-950 to-slate-900">
      <header className="border-b border-border/70 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3 font-semibold text-white">
            <div className="rounded-2xl bg-indigo-600 p-2">
              <CarFront className="size-5" />
            </div>
            <div>
              <p>Aurijo Auto Import SRL</p>
              <p className="text-xs text-slate-400">AURIJO RESUELVE</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="rounded-xl border border-border px-3 py-2 text-slate-200 hover:bg-white/5">
              <span className="inline-flex items-center gap-2"><LayoutDashboard className="size-4" /> Dashboard</span>
            </Link>
            <Link href="/vehicles" className="rounded-xl border border-border px-3 py-2 text-slate-200 hover:bg-white/5">
              Inventario
            </Link>
            <Link href="/vehicles/new" className="rounded-xl bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-500">
              <span className="inline-flex items-center gap-2"><PlusCircle className="size-4" /> Importar carro</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">{children}</main>
    </div>
  );
}
