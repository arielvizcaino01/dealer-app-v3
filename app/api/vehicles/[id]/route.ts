import { NextResponse } from 'next/server';
import { VehicleStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const lotNumber =
      body.lotNumber !== undefined ? String(body.lotNumber).trim() : undefined;

    const vin =
      body.vin !== undefined ? String(body.vin).trim() : undefined;

    const make =
      body.make !== undefined ? String(body.make).trim() : undefined;

    const model =
      body.model !== undefined ? String(body.model).trim() : undefined;

    const titleStatus =
      body.titleStatus !== undefined ? String(body.titleStatus).trim() : undefined;

    const year =
      body.year !== undefined && body.year !== ''
        ? Number(body.year)
        : undefined;

    const miles =
      body.miles !== undefined
        ? body.miles === '' || body.miles === null
          ? null
          : Number(body.miles)
        : undefined;

    const purchasePrice =
      body.purchasePrice !== undefined && body.purchasePrice !== ''
        ? Number(body.purchasePrice)
        : undefined;

    const actualSalePrice =
      body.actualSalePrice !== undefined
        ? body.actualSalePrice === '' || body.actualSalePrice === null
          ? null
          : Number(body.actualSalePrice)
        : undefined;

    const status =
      body.status !== undefined ? String(body.status) : undefined;

    if (lotNumber !== undefined && !lotNumber) {
      return NextResponse.json({ error: 'El lote es obligatorio' }, { status: 400 });
    }

    if (vin !== undefined && !vin) {
      return NextResponse.json({ error: 'El VIN es obligatorio' }, { status: 400 });
    }

    if (make !== undefined && !make) {
      return NextResponse.json({ error: 'La marca es obligatoria' }, { status: 400 });
    }

    if (model !== undefined && !model) {
      return NextResponse.json({ error: 'El modelo es obligatorio' }, { status: 400 });
    }

    if (year !== undefined && (!Number.isInteger(year) || year < 1900 || year > 2100)) {
      return NextResponse.json({ error: 'El año no es válido' }, { status: 400 });
    }

    if (miles !== undefined && miles !== null && (!Number.isFinite(miles) || miles < 0)) {
      return NextResponse.json({ error: 'Las millas no son válidas' }, { status: 400 });
    }

    if (purchasePrice !== undefined && (!Number.isFinite(purchasePrice) || purchasePrice < 0)) {
      return NextResponse.json({ error: 'El precio de compra no es válido' }, { status: 400 });
    }

    if (
      actualSalePrice !== undefined &&
      actualSalePrice !== null &&
      (!Number.isFinite(actualSalePrice) || actualSalePrice < 0)
    ) {
      return NextResponse.json({ error: 'La venta real no es válida' }, { status: 400 });
    }

    if (status !== undefined) {
      const allowedStatuses = Object.values(VehicleStatus);
      if (!allowedStatuses.includes(status as VehicleStatus)) {
        return NextResponse.json({ error: 'El estado no es válido' }, { status: 400 });
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...(lotNumber !== undefined && { lotNumber }),
        ...(vin !== undefined && { vin }),
        ...(make !== undefined && { make }),
        ...(model !== undefined && { model }),
        ...(titleStatus !== undefined && { titleStatus }),
        ...(year !== undefined && { year }),
        ...(miles !== undefined && { miles }),
        ...(purchasePrice !== undefined && { purchasePrice }),
        ...(actualSalePrice !== undefined && { actualSalePrice }),
        ...(status !== undefined && { status: status as VehicleStatus }),
      },
    });

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);

    return NextResponse.json(
      { error: 'No se pudo actualizar el vehículo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle:', error);

    return NextResponse.json(
      { error: 'No se pudo eliminar el vehículo' },
      { status: 500 }
    );
  }
}