import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params

    const link = await prisma.link.findUnique({
      where: { shortCode }
    })

    if (!link) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    // Vérifier si le lien a expiré
    if (link.expiresAt && new Date() > link.expiresAt) {
      // Supprimer le lien expiré
      await prisma.link.delete({
        where: { id: link.id }
      })
      return NextResponse.redirect(new URL('/expired', request.url))
    }

    // Vérifier si le nombre maximum de clics est atteint
    if (link.maxClicks && link.clicks >= link.maxClicks) {
      return NextResponse.redirect(new URL('/limit-reached', request.url))
    }

    // Mettre à jour les statistiques et l'historique
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.$transaction([
      // Mettre à jour le compteur principal
      prisma.link.update({
        where: { id: link.id },
        data: {
          clicks: { increment: 1 },
          lastAccessAt: new Date(),
        },
      }),
      // Créer ou mettre à jour l'entrée d'historique pour aujourd'hui
      prisma.clickHistory.upsert({
        where: {
          linkId_date: {
            linkId: link.id,
            date: today
          }
        },
        update: {
          clicks: { increment: 1 }
        },
        create: {
          linkId: link.id,
          date: today,
          clicks: 1
        }
      })
    ])

    // Si c'est un lien à usage unique, le supprimer après utilisation
    if (link.isOneTime) {
      await prisma.link.delete({
        where: { id: link.id }
      })
    }

    return NextResponse.redirect(link.originalUrl)
  } catch (error) {
    console.error("Erreur lors de la redirection:", error)
    return NextResponse.redirect(new URL('/error', request.url))
  }
}