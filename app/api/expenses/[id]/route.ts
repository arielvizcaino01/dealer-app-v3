import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const description =
      typeof body.description === 'string' ? body.description.trim() : '';
    const amount = Number(body.amount);
    const category =
      typeof body.category === 'string' ? body.category : 'OTHER';

    if (!description) {
      return NextResponse.json(
        { error: 'La descripción es obligatoria' },
        { status: 400 }
      );
    }

    if (Number.isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { error: 'El monto debe ser un número válido' },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        description,
        amount,
        category,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'No se pudo actualizar el gasto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'No se pudo eliminar el gasto' },
      { status: 500 }
    );
  }
}