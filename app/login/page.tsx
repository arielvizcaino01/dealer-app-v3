"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4 p-6">
        <div>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-slate-400">Entra a tu inventario privado.</p>
        </div>

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="label">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full"
            placeholder="Tu contraseña"
          />
        </div>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-sm text-slate-400">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-white hover:underline">
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  );
}