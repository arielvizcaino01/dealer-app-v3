import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { documentId } = await params;

    const document = await prisma.vehicleDocument.findFirst({
      where: {
        id: documentId,
        userId: session.user.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Documento no encontrado." },
        { status: 404 }
      );
    }

    if (document.fileUrl.includes("blob.vercel-storage.com")) {
      await del(document.fileUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    }

    await prisma.vehicleDocument.delete({
      where: {
        id: document.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando documento:", error);

    return NextResponse.json(
      { error: "No se pudo eliminar el documento." },
      { status: 500 }
    );
  }
}