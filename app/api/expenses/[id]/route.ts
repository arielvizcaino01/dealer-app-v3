import { NextResponse } from "next/server";
import { ExpenseCategory } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { id: vehicleId } = await params;
    const body = await request.json();

    const description = String(body.description || "").trim();
    const amount = Number(body.amount);
    const category = String(body.category || "OTHER") as ExpenseCategory;

    if (!description) {
      return NextResponse.json(
        { error: "La descripción es obligatoria." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: "El monto no es válido." },
        { status: 400 }
      );
    }

    const allowed = Object.values(ExpenseCategory);
    if (!allowed.includes(category)) {
      return NextResponse.json(
        { error: "La categoría no es válida." },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "El vehículo no existe." },
        { status: 404 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        vehicleId,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creando gasto:", error);
    return NextResponse.json(
      { error: "No se pudo guardar el gasto." },
      { status: 500 }
    );
  }
}