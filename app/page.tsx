import Link from 'next/link';
import {
  DollarSign,
  Wrench,
  CarFront,
  TrendingUp,
  Wallet,
  Banknote,
  PiggyBank,
  ChartNoAxesCombined,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/utils';
import { MetricCard } from '@/components/metric-card';
import { StatusBadge } from '@/components/status-badge';
import { BusinessSettingsForm } from '@/components/business-settings-form';

export default async function HomePage() {
  const allVehicles = await prisma.vehicle.findMany({
    include: { expenses: true },
    orderBy: { createdAt: 'desc' },
  });

  const latestVehicles = allVehicles.slice(0, 5);

  const settings = await prisma.businessSettings.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  const initialCapital = settings?.initialCapital ?? 0;

  const totalVehicles = allVehicles.length;
  const inRepair = allVehicles.filter((vehicle) => vehicle.status === 'IN_REPAIR').length;
  const ready = allVehicles.filter((vehicle) => vehicle.status === 'READY_FOR_SALE').length;
  const sold = allVehicles.filter((vehicle) => vehicle.status === 'SOLD').length;
  const purchased = allVehicles.filter((vehicle) => vehicle.status === 'PURCHASED').length;
  const inTransit = allVehicles.filter((vehicle) => vehicle.status === 'IN_TRANSIT').length;

  const totalPurchase = allVehicles.reduce((sum, vehicle) => sum + vehicle.purchasePrice, 0);

  const totalExpenses = allVehicles.reduce((sum, vehicle) => {
    const vehicleExpenses = vehicle.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return sum + vehicleExpenses;
  }, 0);

  const totalInvested = totalPurchase + totalExpenses;

  const estimatedInventoryValue = allVehicles.reduce(
    (sum, vehicle) => sum + vehicle.estimatedSalePrice,
    0
  );

  const estimatedProfit = estimatedInventoryValue - totalInvested;

  const activeVehicles = allVehicles.filter((vehicle) => vehicle.status !== 'SOLD');

  const activeInvested = activeVehicles.reduce((sum, vehicle) => {
    const vehicleExpenses = vehicle.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return sum + vehicle.purchasePrice + vehicleExpenses;
  }, 0);

  const estimatedAvailableCapital = initialCapital - activeInvested;

  return (
    <div className="space-y-6">
      <section className="card p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-soft">
              Dashboard del dealer
            </p>
            <h1 className="text-3xl font-bold md:text-5xl">
              Controla tu inventario, tu capital y tu profit desde un solo lugar.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Esta vista ya te muestra métricas reales de tu operación: cuánto dinero has invertido,
              cuánto capital te queda disponible y cuál es tu profit estimado según todo tu inventario.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vehicles/new"
                className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500"
              >
                Importar vehículo
              </Link>
              <Link
                href="/vehicles"
                className="rounded-2xl border border-border px-4 py-3 font-semibold text-slate-100 hover:bg-white/5"
              >
                Ver inventario
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold">Capital inicial</h2>
            <p className="mt-2 text-sm text-slate-400">
              Guarda el capital con el que comenzaste para ver métricas más reales de tu operación.
            </p>

            <div className="mt-5">
              <BusinessSettingsForm initialCapital={initialCapital} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Capital inicial"
          value={formatMoney(initialCapital)}
          hint="Capital base registrado"
          icon={<PiggyBank className="size-6 text-soft" />}
        />
        <MetricCard
          title="Invertido total"
          value={formatMoney(totalInvested)}
          hint="Compras + todos los gastos"
          icon={<DollarSign className="size-6 text-soft" />}
        />
        <MetricCard
          title="Valor estimado"
          value={formatMoney(estimatedInventoryValue)}
          hint="Suma de venta estimada"
          icon={<TrendingUp className="size-6 text-soft" />}
        />
        <MetricCard
          title="Profit estimado"
          value={formatMoney(estimatedProfit)}
          hint="Valor estimado - costo total"
          icon={<ChartNoAxesCombined className="size-6 text-soft" />}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Vehículos activos"
          value={String(activeVehicles.length)}
          hint="No vendidos actualmente"
          icon={<CarFront className="size-6 text-soft" />}
        />
        <MetricCard
          title="Gastos acumulados"
          value={formatMoney(totalExpenses)}
          hint="Todos los gastos registrados"
          icon={<Wrench className="size-6 text-soft" />}
        />
        <MetricCard
          title="Capital disponible"
          value={formatMoney(estimatedAvailableCapital)}
          hint="Capital inicial - invertido activo"
          icon={<Wallet className="size-6 text-soft" />}
        />
        <MetricCard
          title="Compras totales"
          value={formatMoney(totalPurchase)}
          hint="Suma de compras de vehículos"
          icon={<Banknote className="size-6 text-soft" />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-xl font-semibold">Últimos vehículos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-left text-slate-300">
                <tr>
                  <th className="px-4 py-3">Vehículo</th>
                  <th className="px-4 py-3">Lote</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Compra</th>
                  <th className="px-4 py-3">Venta estimada</th>
                </tr>
              </thead>
              <tbody>
                {latestVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-border/60 text-slate-100">
                    <td className="px-4 py-3">
                      <Link href={`/vehicles/${vehicle.id}`} className="font-semibold hover:text-soft">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </Link>
                      <p className="text-xs text-slate-400">VIN {vehicle.vin}</p>
                    </td>
                    <td className="px-4 py-3">{vehicle.lotNumber}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={vehicle.status} />
                    </td>
                    <td className="px-4 py-3">{formatMoney(vehicle.purchasePrice)}</td>
                    <td className="px-4 py-3">{formatMoney(vehicle.estimatedSalePrice)}</td>
                  </tr>
                ))}

                {latestVehicles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      Todavía no hay vehículos. Empieza importando uno.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-xl font-semibold">Estados rápidos</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>Comprados</span>
              <span>{purchased}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>En transporte</span>
              <span>{inTransit}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>En reparación</span>
              <span>{inRepair}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>Listos para vender</span>
              <span>{ready}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>Vendidos</span>
              <span>{sold}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>Total vehículos</span>
              <span>{totalVehicles}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}