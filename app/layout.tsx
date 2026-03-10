import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'Aurijo Auto Import SRL',
  description: 'Inventario profesional de vehículos con gastos, profit e importación desde Copart.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
