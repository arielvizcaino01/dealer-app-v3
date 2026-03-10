import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lotNumber = String(body.lotNumber || '').trim();
    const vin = String(body.vin || '').trim();
    const make = String(body.make || '').trim();
    const model = String(body.model || '').trim();
    const titleStatus = String(body.titleStatus || '').trim();
    const year = Number(body.year);
    const miles =
      body.miles === '' || body.miles == null ? null : Number(body.miles);

    if (!lotNumber || !vin || !make || !model || !titleStatus) {
      return NextResponse.json(
        { error: 'Todos los campos excepto millas son obligatorios.' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return NextResponse.json(
        { error: 'El año no es válido.' },
        { status: 400 }
      );
    }

    if (miles !== null && (!Number.isFinite(miles) || miles < 0)) {
      return NextResponse.json(
        { error: 'Las millas no son válidas.' },
        { status: 400 }
      );
    }

    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [{ lotNumber }, { vin }],
      },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Ese vehículo ya existe en el inventario.' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        source: 'MANUAL',
        lotNumber,
        vin,
        make,
        model,
        year,
        miles,
        titleStatus,
        purchasePrice: 0,
        estimatedSalePrice: 0,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Error creando vehículo manual:', error);
    return NextResponse.json(
      { error: 'No se pudo crear el vehículo.' },
      { status: 500 }
    );
  }
}