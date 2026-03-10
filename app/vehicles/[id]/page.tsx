export const dynamic = "force-dynamic";

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { ExpenseForm } from '@/components/expense-form';
import { StatusBadge } from '@/components/status-badge';
import { VehicleNotesForm } from '@/components/vehicle-notes-form';
import { DeleteExpenseButton } from '@/components/delete-expense-button';
import { EditExpenseForm } from '@/components/edit-expense-form';
import { EditVehicleFinancialsForm } from '@/components/edit-vehicle-financials-form';
import { EditVehicleDetailsForm } from '@/components/edit-vehicle-details-form';
import { EditVehicleStatusForm } from '@/components/edit-vehicle-status-form';
import { DeleteVehicleButton } from '@/components/delete-vehicle-button';
import { CollapsibleCard } from '@/components/collapsible-card';
import { prisma } from '@/lib/prisma';
import { formatDate, formatMoney } from '@/lib/utils';

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      photos: { orderBy: { createdAt: 'asc' } },
      expenses: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!vehicle) notFound();

  const totalExpenses = vehicle.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCost = vehicle.purchasePrice + totalExpenses;
  const actualProfit =
    vehicle.actualSalePrice != null ? vehicle.actualSalePrice - totalCost : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-soft">
                  {vehicle.source} · Lote {vehicle.lotNumber}
                </p>
                <h1 className="mt-2 text-3xl font-bold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="mt-2 text-slate-400">VIN {vehicle.vin}</p>
              </div>

              <StatusBadge status={vehicle.status} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="label">Lote</p>
                <p className="value">{vehicle.lotNumber}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="label">VIN</p>
                <p className="value break-all">{vehicle.vin}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="label">Marca</p>
                <p className="value">{vehicle.make}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="label">Modelo</p>
                <p className="value">{vehicle.model}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="label">Year</p>
                <p className="value">{vehicle.year}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="label">Millas</p>
                <p className="value">{vehicle.miles?.toLocaleString() || '-'}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="label">Título</p>
                <p className="value">{vehicle.titleStatus || '-'}</p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="label">Creado</p>
                <p className="value">{formatDate(vehicle.createdAt)}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/5 p-4">
              <VehicleNotesForm vehicleId={vehicle.id} initialNotes={vehicle.notes} />
            </div>
          </div>

          <CollapsibleCard
            title="Datos generales"
            description="Puedes editar lote, VIN, marca, modelo, year, millas y título cuando lo necesites."
            buttonLabel="Editar datos generales"
            openButtonLabel="Ocultar datos generales"
          >
            <EditVehicleDetailsForm
              vehicleId={vehicle.id}
              lotNumber={vehicle.lotNumber}
              vin={vehicle.vin}
              make={vehicle.make}
              model={vehicle.model}
              year={vehicle.year}
              miles={vehicle.miles}
              titleStatus={vehicle.titleStatus}
            />
          </CollapsibleCard>
        </div>

        <div className="space-y-6">
          <CollapsibleCard
            title="Estado del vehículo"
            description="Actualiza la etapa actual del vehículo dentro de tu operación."
            buttonLabel="Cambiar estado"
            openButtonLabel="Ocultar estado"
          >
            <EditVehicleStatusForm
              vehicleId={vehicle.id}
              currentStatus={vehicle.status}
            />
          </CollapsibleCard>

          <CollapsibleCard
            title="Resumen financiero"
            description="Consulta compra, gastos, costo total, venta real y profit real."
            buttonLabel="Ver resumen financiero"
            openButtonLabel="Ocultar resumen financiero"
          >
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span>Precio de compra</span>
                <strong>{formatMoney(vehicle.purchasePrice)}</strong>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span>Gastos acumulados</span>
                <strong>{formatMoney(totalExpenses)}</strong>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span>Costo total</span>
                <strong>{formatMoney(totalCost)}</strong>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span>Venta real</span>
                <strong>
                  {vehicle.actualSalePrice != null
                    ? formatMoney(vehicle.actualSalePrice)
                    : '-'}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span>Profit real</span>
                <strong
                  className={
                    actualProfit != null
                      ? actualProfit >= 0
                        ? 'text-emerald-300'
                        : 'text-rose-300'
                      : ''
                  }
                >
                  {actualProfit != null ? formatMoney(actualProfit) : '-'}
                </strong>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard
            title="Datos financieros"
            description="Actualiza precio de compra y venta real cuando cambien."
            buttonLabel="Editar datos financieros"
            openButtonLabel="Ocultar datos financieros"
          >
            <EditVehicleFinancialsForm
              vehicleId={vehicle.id}
              purchasePrice={vehicle.purchasePrice}
              actualSalePrice={vehicle.actualSalePrice}
            />
          </CollapsibleCard>

          <div className="card p-6">
            <h2 className="text-xl font-semibold">Zona de peligro</h2>
            <p className="mt-2 text-sm text-slate-400">
              Eliminar este vehículo borrará también sus gastos y fotos asociadas.
            </p>

            <div className="mt-5">
              <DeleteVehicleButton vehicleId={vehicle.id} />
            </div>
          </div>
        </div>
      </div>

      <section className="card p-6">
        <h2 className="text-2xl font-semibold">Fotos del vehículo</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicle.photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-2xl border border-border bg-black/20"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.url}
                  alt={photo.label || 'Foto de vehículo'}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="px-4 py-3 text-sm text-slate-300">
                {photo.label || 'Foto del vehículo'}
              </div>
            </div>
          ))}

          {vehicle.photos.length === 0 && (
            <p className="text-slate-400">No hay fotos cargadas para este vehículo.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold">Agregar gasto</h2>
          <p className="mt-2 text-sm text-slate-400">
            Transporte, piezas, mano de obra, impuestos y más.
          </p>

          <div className="mt-5">
            <ExpenseForm vehicleId={vehicle.id} />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-semibold">Historial de gastos</h2>

          <div className="mt-5 space-y-3">
            {vehicle.expenses.map((expense) => (
              <div key={expense.id} className="rounded-2xl bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{expense.description}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {expense.category} · {formatDate(expense.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <strong>{formatMoney(expense.amount)}</strong>

                    <EditExpenseForm
                      expense={{
                        id: expense.id,
                        description: expense.description,
                        amount: expense.amount,
                        category: expense.category,
                      }}
                    />

                    <DeleteExpenseButton expenseId={expense.id} />
                  </div>
                </div>
              </div>
            ))}

            {vehicle.expenses.length === 0 && (
              <p className="text-slate-400">Todavía no hay gastos cargados.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}