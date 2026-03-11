"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type VehicleDocument = {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  createdAt: string;
};

const documentTypes = [
  { value: "TITLE_PHOTO", label: "Foto del título" },
  { value: "TAX_PAYMENT", label: "Pago de impuestos" },
  { value: "SHIP_PAYMENT", label: "Pago de barco" },
  { value: "TRANSPORT_RECEIPT", label: "Recibo de transporte" },
  { value: "REPAIR_INVOICE", label: "Factura de reparación" },
  { value: "OTHER", label: "Otro documento" },
];

export function VehicleDocumentsManager({
  vehicleId,
  documents,
}: {
  vehicleId: string;
  documents: VehicleDocument[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("OTHER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    if (!file) {
      setError("Debes seleccionar un archivo.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("vehicleId", vehicleId);

      const res = await fetch("/api/vehicles/documents", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : null;

      if (!res.ok) {
        throw new Error(data?.error || "Error subiendo archivo.");
      }

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(documentId: string) {
    const confirmDelete = window.confirm("¿Eliminar este documento?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/vehicles/documents/${documentId}`, {
        method: "DELETE",
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : null;

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo eliminar el documento.");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error eliminando documento.");
      console.error("Delete error:", err);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="label">Tipo de documento</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 w-full"
            disabled={loading}
          >
            {documentTypes.map((doc) => (
              <option key={doc.value} value={doc.value}>
                {doc.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Archivo</label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-2 w-full"
            disabled={loading}
          />
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Subiendo..." : "Subir documento"}
        </button>
      </form>

      <div className="space-y-3">
        {documents.length === 0 ? (
          <p className="text-slate-400">Todavía no hay documentos.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
            >
              <div>
                <p className="font-medium">{doc.fileName}</p>
                <p className="text-xs text-slate-400">
                  {doc.type} · {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-400 hover:underline"
                >
                  Ver
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  className="text-sm text-rose-400 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}