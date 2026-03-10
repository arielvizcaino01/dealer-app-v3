import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const notes = typeof body.notes === 'string' ? body.notes : '';

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { notes },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'No se pudieron actualizar las notas' },
      { status: 500 }
    );
  }
}