import { PrismaClient, ExpenseCategory, VehicleStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.expense.deleteMany();
  await prisma.vehiclePhoto.deleteMany();
  await prisma.vehicle.deleteMany();

  const vehicle = await prisma.vehicle.create({
    data: {
      lotNumber: '87654321',
      vin: '1HGCM82633A123456',
      year: 2020,
      make: 'Honda',
      model: 'Accord Sport',
      miles: 52110,
      primaryDamage: 'Front End',
      secondaryDamage: 'Minor Dent / Scratches',
      fuelType: 'Gasoline',
      engine: '1.5L Turbo',
      purchasePrice: 5200,
      estimatedSalePrice: 9800,
      status: VehicleStatus.IN_REPAIR,
      thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', label: 'Subasta frente' },
          { url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', label: 'Subasta lateral' },
        ],
      },
      expenses: {
        create: [
          { category: ExpenseCategory.TRANSPORT, description: 'Transporte de subasta al taller', amount: 350 },
          { category: ExpenseCategory.PARTS, description: 'Bumper delantero', amount: 280 },
          { category: ExpenseCategory.LABOR, description: 'Mano de obra reparación', amount: 620 },
        ],
      },
    },
  });

  console.log(`Vehículo de ejemplo creado: ${vehicle.make} ${vehicle.model}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
