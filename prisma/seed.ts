import { PrismaClient, ExpenseCategory, VehicleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@dealerapp.com";
  const password = await bcrypt.hash("12345678", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Admin",
      email,
      password,
    },
  });

  await prisma.businessSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      initialCapital: 0,
    },
  });

  const existingVehicle = await prisma.vehicle.findFirst({
    where: {
      userId: user.id,
      lotNumber: "demo-lot-001",
    },
  });

  if (!existingVehicle) {
    await prisma.vehicle.create({
      data: {
        userId: user.id,
        source: "MANUAL",
        lotNumber: "demo-lot-001",
        vin: "1HGBH41JXMN109186",
        year: 2018,
        make: "BMW",
        model: "330XI",
        miles: 85432,
        primaryDamage: "Front End",
        secondaryDamage: "Minor Dent/Scratches",
        titleStatus: "Clean Title",
        fuelType: "Gas",
        engine: "2.0L 4",
        purchasePrice: 4500,
        estimatedSalePrice: 7200,
        actualSalePrice: null,
        status: VehicleStatus.PURCHASED,
        notes: "Vehículo demo para pruebas.",
        thumbnailUrl: null,
        photos: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
              label: "Foto demo 1",
            },
          ],
        },
        expenses: {
          create: [
            {
              description: "Transporte inicial",
              amount: 350,
              category: ExpenseCategory.TRANSPORT,
            },
            {
              description: "Reparación básica",
              amount: 600,
              category: ExpenseCategory.REPAIR,
            },
          ],
        },
      },
    });
  }

  console.log("Seed completado correctamente.");
}

main()
  .catch((error) => {
    console.error("Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });