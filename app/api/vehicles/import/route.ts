import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = await request.json();

    const lotNumber = String(body.lotNumber || "").trim();
    const vin = String(body.vin || "").trim();
    const make = String(body.make || "").trim();
    const model = String(body.model || "").trim();
    const titleStatus = String(body.titleStatus || "").trim();
    const year = Number(body.year);
    const miles =
      body.miles === "" || body.miles == null ? null : Number(body.miles);
    const purchasePrice = Number(body.purchasePrice || 0);

    if (!lotNumber || !vin || !make || !model || !titleStatus) {
      return NextResponse.json(
        { error: "Todos los campos excepto millas son obligatorios." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return NextResponse.json(
        { error: "El año no es válido." },
        { status: 400 }
      );
    }

    if (miles !== null && (!Number.isFinite(miles) || miles < 0)) {
      return NextResponse.json(
        { error: "Las millas no son válidas." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(purchasePrice) || purchasePrice < 0) {
      return NextResponse.json(
        { error: "El precio de compra no es válido." },
        { status: 400 }
      );
    }

    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        userId: session.user.id,
        OR: [{ lotNumber }, { vin }],
      },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { error: "Ese vehículo ya existe en tu inventario." },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        source: "MANUAL",
        lotNumber,
        vin,
        make,
        model,
        year,
        miles,
        titleStatus,
        purchasePrice,
        estimatedSalePrice: 0,
        userId: session.user.id,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Error importando vehículo manual:", error);
    return NextResponse.json(
      { error: "No se pudo importar el vehículo." },
      { status: 500 }
    );
  }
}