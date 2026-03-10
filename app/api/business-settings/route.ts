import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.businessSettings.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'No se pudo obtener la configuración' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const initialCapital = Number(body.initialCapital);

    if (Number.isNaN(initialCapital) || initialCapital < 0) {
      return NextResponse.json(
        { error: 'El capital inicial debe ser un número válido' },
        { status: 400 }
      );
    }

    const existing = await prisma.businessSettings.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    const settings = existing
      ? await prisma.businessSettings.update({
          where: { id: existing.id },
          data: { initialCapital },
        })
      : await prisma.businessSettings.create({
          data: { initialCapital },
        });

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'No se pudo guardar el capital inicial' },
      { status: 500 }
    );
  }
}