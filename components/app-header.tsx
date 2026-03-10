import Link from "next/link";
import { auth } from "@/auth";
import { UserMenu } from "@/components/user-menu";

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="border-b border-border bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-white">
            Dealer App
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Dashboard
            </Link>

            <Link
              href="/vehicles"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Inventario
            </Link>

            <Link
              href="/vehicles/new"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Importar
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <UserMenu
              name={session.user.name ?? null}
              email={session.user.email ?? null}
            />
          ) : (
            <Link
              href="/login"
              className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/5"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}