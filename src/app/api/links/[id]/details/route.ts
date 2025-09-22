import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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

    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        clickHistory: {
          orderBy: { date: 'asc' }
        }
      }
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

    // Générer l'historique des clics par jour pour les 30 derniers jours
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
    
    const clickHistory = []
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + (i * 24 * 60 * 60 * 1000))
      const dateString = date.toISOString().split('T')[0]
      
      const dayClicks = await prisma.clickHistory.aggregate({
        where: {
          linkId: link.id,
          date: {
            gte: new Date(dateString),
            lt: new Date(new Date(dateString).getTime() + 24 * 60 * 60 * 1000)
          }
        },
        _sum: {
          clicks: true
        }
      })

      clickHistory.push({
        date: dateString,
        clicks: dayClicks._sum.clicks || 0
      })
    }

    return NextResponse.json({
      ...link,
      clickHistory
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des détails:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
