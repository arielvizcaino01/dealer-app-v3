"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

type UserMenuProps = {
  name?: string | null;
  email?: string | null;
};

export function UserMenu({ name, email }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  const label = name || email || "Mi cuenta";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/5"
      >
        👤 {label}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-border bg-slate-950/95 p-2 shadow-xl">
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-semibold text-white">{name || "Usuario"}</p>
            <p className="text-xs text-slate-400 break-all">{email || "-"}</p>
          </div>

          <div className="mt-2 flex flex-col">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              Mi perfil
            </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-xl px-3 py-2 text-left text-sm text-rose-300 hover:bg-white/5"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}