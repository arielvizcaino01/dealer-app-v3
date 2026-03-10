export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi perfil</h1>
        <p className="mt-1 text-slate-400">
          Información de tu cuenta.
        </p>
      </div>

      <section className="card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="label">Nombre</p>
            <p className="value">{session.user.name || "-"}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="label">Email</p>
            <p className="value break-all">{session.user.email || "-"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}