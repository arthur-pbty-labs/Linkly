import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getAnalyticsSummary } from "@/lib/analytics"
import { prisma } from "@/lib/prisma"
import { createSerializableResponse } from "@/lib/serialization"
import type { Session } from "next-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      )
    }

    // Vérifier que l'utilisateur possède ce lien
    const link = await prisma.link.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!link || link.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Lien non trouvé ou accès non autorisé" },
        { status: 404 }
      )
    }

    const analytics = await getAnalyticsSummary(id)
    
    // S'assurer que toutes les données sont sérialisables
    const serializableAnalytics = createSerializableResponse(analytics)
    
    return NextResponse.json(serializableAnalytics)
  } catch (error) {
    console.error("Erreur lors de la récupération des analytics:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}