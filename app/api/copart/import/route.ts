import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractCopartData } from '@/lib/copart';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    const purchasePrice = Number(body.purchasePrice || 0);

    console.log('Import request recibida:', { url, purchasePrice });

    if (!url) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    if (!Number.isFinite(purchasePrice) || purchasePrice < 0) {
      return NextResponse.json(
        { error: 'El total pagado en Copart no es válido' },
        { status: 400 }
      );
    }

    const copartData = await extractCopartData(url);

    if (!copartData.lotNumber) {
      return NextResponse.json(
        { error: 'No se pudo leer el número de lote de Copart' },
        { status: 400 }
      );
    }

    const safeVin =
      copartData.vin && copartData.vin.trim() !== ''
        ? copartData.vin.trim()
        : `PENDINGVIN-${copartData.lotNumber}`;

    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [{ lotNumber: copartData.lotNumber }, { vin: safeVin }],
      },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Este vehículo ya está importado' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        source: 'COPART',
        lotNumber: copartData.lotNumber,
        vin: safeVin,
        year: copartData.year || 0,
        make: copartData.make || 'Unknown',
        model: copartData.model || 'Unknown',
        miles: copartData.miles,
        primaryDamage: copartData.primaryDamage || null,
        secondaryDamage: copartData.secondaryDamage || null,
        fuelType: copartData.fuelType || null,
        engine: copartData.engine || null,
        purchasePrice,
        estimatedSalePrice: 0,
        thumbnailUrl: copartData.photos[0] || null,
        photos: {
          create: copartData.photos.map((photoUrl) => ({
            url: photoUrl,
          })),
        },
      },
    });

    console.log('Vehículo creado desde Copart:', vehicle.id);

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error importando vehículo Copart:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo importar el vehículo',
      },
      { status: 500 }
    );
  }
}