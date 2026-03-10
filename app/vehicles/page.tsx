import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/utils';
import { StatusBadge } from '@/components/status-badge';

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    include: { expenses: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="mt-1 text-slate-400">
            Vista central para tus carros activos y vendidos.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Total de vehículos: {vehicles.length}
          </p>
        </div>

        <Link
          href="/vehicles/new"
          className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500"
        >
          Importar vehículo
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-300">
              <tr>
                <th className="px-4 py-3">Vehículo</th>
                <th className="px-4 py-3">Lote</th>
                <th className="px-4 py-3">Millas</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Compra</th>
                <th className="px-4 py-3">Gastos</th>
                <th className="px-4 py-3">Costo total</th>
                <th className="px-4 py-3">Venta estimada</th>
                <th className="px-4 py-3">Profit estimado</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => {
                const totalExpenses = vehicle.expenses.reduce(
                  (sum, expense) => sum + expense.amount,
                  0
                );

                const totalCost = vehicle.purchasePrice + totalExpenses;
                const estimatedProfit = vehicle.estimatedSalePrice - totalCost;

                return (
                  <tr
                    key={vehicle.id}
                    className="border-t border-border/60 text-slate-100"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="font-semibold hover:text-soft"
                      >
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </Link>
                      <p className="text-xs text-slate-400">VIN {vehicle.vin}</p>
                    </td>

                    <td className="px-4 py-3">{vehicle.lotNumber}</td>

                    <td className="px-4 py-3">
                      {vehicle.miles?.toLocaleString() || '-'}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={vehicle.status} />
                    </td>

                    <td className="px-4 py-3">
                      {formatMoney(vehicle.purchasePrice)}
                    </td>

                    <td className="px-4 py-3">
                      {formatMoney(totalExpenses)}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {formatMoney(totalCost)}
                    </td>

                    <td className="px-4 py-3">
                      {formatMoney(vehicle.estimatedSalePrice)}
                    </td>

                    <td
                      className={`px-4 py-3 font-semibold ${
                        estimatedProfit >= 0
                          ? 'text-emerald-300'
                          : 'text-rose-300'
                      }`}
                    >
                      {formatMoney(estimatedProfit)}
                    </td>
                  </tr>
                );
              })}

              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                    No hay vehículos todavía. Usa “Importar vehículo” para cargar el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}