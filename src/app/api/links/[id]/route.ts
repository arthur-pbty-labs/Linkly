import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      )
    }

    const link = await prisma.link.findUnique({
      where: { id }
    })

    if (!link) {
      return NextResponse.json(
        { error: "Lien non trouvé" },
        { status: 404 }
      )
    }

    if (link.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      )
    }

    await prisma.link.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Lien supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du lien:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}