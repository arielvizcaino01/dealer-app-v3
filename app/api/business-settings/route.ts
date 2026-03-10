import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const initialCapital = Number(body.initialCapital);

    if (!Number.isFinite(initialCapital) || initialCapital < 0) {
      return NextResponse.json(
        { error: "El capital inicial no es válido." },
        { status: 400 }
      );
    }

    const existingSettings = await prisma.businessSettings.findFirst({
      where: { userId: session.user.id },
    });

    let settings;

    if (existingSettings) {
      settings = await prisma.businessSettings.update({
        where: { id: existingSettings.id },
        data: { initialCapital },
      });
    } else {
      settings = await prisma.businessSettings.create({
        data: {
          initialCapital,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error guardando business settings:", error);
    return NextResponse.json(
      { error: "No se pudo guardar la configuración." },
      { status: 500 }
    );
  }
}