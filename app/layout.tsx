import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dealer App",
  description: "Sistema de inventario para dealer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="min-h-screen">
          <AppHeader />
          <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}