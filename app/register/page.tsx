"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear la cuenta");
      }

      setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesión.");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleRegister} className="card w-full max-w-md p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-400">
            Regístrate para usar tu inventario privado.
          </p>
        </div>

        <div>
          <label className="label">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full"
            placeholder="Tu nombre"
          />
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
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {error && <p className="text-sm text-rose-300">{error}</p>}
        {success && <p className="text-sm text-emerald-300">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-white hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}