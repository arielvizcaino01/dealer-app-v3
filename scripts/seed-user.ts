import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@dealerapp.com';
  const plainPassword = '12345678';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Admin',
      email,
      password: hashedPassword,
    },
  });

  await prisma.vehicle.updateMany({
    where: { userId: null },
    data: { userId: user.id },
  });

  const existingSettings = await prisma.businessSettings.findFirst({
    where: { userId: null },
    orderBy: { createdAt: 'asc' },
  });

  if (existingSettings) {
    await prisma.businessSettings.update({
      where: { id: existingSettings.id },
      data: { userId: user.id },
    });
  } else {
    await prisma.businessSettings.create({
      data: {
        initialCapital: 0,
        userId: user.id,
      },
    });
  }

  console.log('Usuario base creado/asegurado:');
  console.log({ email, password: plainPassword, userId: user.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });