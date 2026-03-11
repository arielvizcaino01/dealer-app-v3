import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { VehicleDocumentType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const vehicleId = String(formData.get("vehicleId") || "");
    const type = String(formData.get("type") || "OTHER") as VehicleDocumentType;

    if (!file) {
      return NextResponse.json(
        { error: "Debes seleccionar un archivo." },
        { status: 400 }
      );
    }

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehículo no válido." },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: session.user.id,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehículo no encontrado." },
        { status: 404 }
      );
    }

    const allowedTypes = Object.values(VehicleDocumentType);
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: "Tipo de documento no válido." },
        { status: 400 }
      );
    }

    const blob = await put(
      `${session.user.id}/${vehicleId}/${Date.now()}-${file.name}`,
      file,
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    const document = await prisma.vehicleDocument.create({
      data: {
        fileName: file.name,
        fileUrl: blob.url,
        mimeType: file.type || null,
        type,
        vehicleId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error subiendo documento:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo subir el documento.",
      },
      { status: 500 }
    );
  }
}