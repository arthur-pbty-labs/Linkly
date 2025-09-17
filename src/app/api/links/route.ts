import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateShortCode, isValidUrl, formatUrl, getDaysFromNow } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, customCode, expiresAt, maxClicks, isOneTime } = body

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { message: 'URL invalide' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    const formattedUrl = formatUrl(url)

    // Generate or validate short code
    let shortCode = customCode
    if (customCode) {
      // Check if custom code is already taken
      const existing = await prisma.link.findUnique({
        where: { shortCode: customCode }
      })
      if (existing) {
        return NextResponse.json(
          { message: 'Ce code personnalisé est déjà utilisé' },
          { status: 400 }
        )
      }
    } else {
      // Generate unique short code
      do {
        shortCode = generateShortCode()
      } while (await prisma.link.findUnique({ where: { shortCode } }))
    }

    // Set expiration date
    let expirationDate: Date | null = null
    if (session && expiresAt) {
      expirationDate = new Date(expiresAt)
    } else if (!session) {
      // Anonymous users: 7 days expiration
      expirationDate = getDaysFromNow(7)
    }

    // Create the link
    const link = await prisma.link.create({
      data: {
        originalUrl: formattedUrl,
        shortCode,
        expiresAt: expirationDate,
        maxClicks: session ? maxClicks : undefined,
        isOneTime: session ? isOneTime : false,
        userId: session?.user?.id || null,
      },
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const links = await prisma.link.findMany({
      where: {
        userId: session.user?.id,
      },
      include: {
        _count: {
          select: {
            clicks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}