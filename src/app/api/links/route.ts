import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateShortCode, generateQRCode, isValidUrl, sanitizeUrl, isValidCustomCode, isReservedCode } from "@/lib/utils"
import type { Session } from "next-auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      )
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error("Erreur lors de la récupération des liens:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalUrl, customCode, expiresAt, maxClicks, isOneTime } = body

    if (!originalUrl) {
      return NextResponse.json(
        { error: "L'URL est requise" },
        { status: 400 }
      )
    }

    const sanitizedUrl = sanitizeUrl(originalUrl)
    
    if (!isValidUrl(sanitizedUrl)) {
      return NextResponse.json(
        { error: "URL invalide" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions) as Session | null
    
    let shortCode: string

    // Si un code personnalisé est fourni et que l'utilisateur est connecté
    if (customCode && session?.user) {
      // Validation du code personnalisé
      if (!isValidCustomCode(customCode)) {
        return NextResponse.json(
          { error: "Le code personnalisé doit contenir 3-20 caractères (lettres minuscules, chiffres, tirets et underscores uniquement)" },
          { status: 400 }
        )
      }

      // Vérifier que ce n'est pas un code réservé
      if (isReservedCode(customCode)) {
        return NextResponse.json(
          { error: "Ce code est réservé et ne peut pas être utilisé" },
          { status: 400 }
        )
      }

      // Vérifier que le code n'est pas déjà utilisé
      const existingLink = await prisma.link.findUnique({
        where: { shortCode: customCode }
      })

      if (existingLink) {
        return NextResponse.json(
          { error: "Ce code personnalisé est déjà utilisé" },
          { status: 409 }
        )
      }

      shortCode = customCode
    } else {
      // Génération du code court unique automatique
      let isUnique = false
      
      do {
        shortCode = generateShortCode()
        const existing = await prisma.link.findUnique({
          where: { shortCode }
        })
        isUnique = !existing
      } while (!isUnique)
    }

    // Pour les utilisateurs non connectés, expiration automatique après 7 jours
    let finalExpiresAt: Date | null = null
    
    if (!session?.user) {
      finalExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    } else if (expiresAt) {
      finalExpiresAt = new Date(expiresAt)
    }

    // Génération du QR code
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const shortUrl = `${baseUrl}/${shortCode}`
    const qrCode = await generateQRCode(shortUrl)

    const link = await prisma.link.create({
      data: {
        shortCode,
        originalUrl: sanitizedUrl,
        qrCode,
        expiresAt: finalExpiresAt,
        maxClicks: session?.user ? maxClicks : null,
        isOneTime: session?.user ? isOneTime || false : false,
        userId: session?.user?.id || null,
      },
    })

    return NextResponse.json({
      id: link.id,
      shortCode: link.shortCode,
      shortUrl,
      originalUrl: link.originalUrl,
      qrCode: link.qrCode,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
    })
  } catch (error) {
    console.error("Erreur lors de la création du lien:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}