import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params
    
    // Find the link
    const link = await prisma.link.findUnique({
      where: { shortCode },
    })

    if (!link) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    // Check if link is active
    if (!link.isActive) {
      return NextResponse.redirect(new URL('/expired', request.url))
    }

    // Check if link has expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      await prisma.link.update({
        where: { id: link.id },
        data: { isActive: false },
      })
      return NextResponse.redirect(new URL('/expired', request.url))
    }

    // Check if max clicks reached
    if (link.maxClicks) {
      const clickCount = await prisma.click.count({
        where: { linkId: link.id },
      })
      
      if (clickCount >= link.maxClicks) {
        await prisma.link.update({
          where: { id: link.id },
          data: { isActive: false },
        })
        return NextResponse.redirect(new URL('/expired', request.url))
      }
    }

    // Get request headers for analytics
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined
    const referer = headersList.get('referer') || undefined
    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0] || headersList.get('x-real-ip') || undefined

    // Record the click
    await prisma.click.create({
      data: {
        linkId: link.id,
        userAgent,
        referer,
        ip,
      },
    })

    // If it's a one-time link, deactivate it
    if (link.isOneTime) {
      await prisma.link.update({
        where: { id: link.id },
        data: { isActive: false },
      })
    }

    // Redirect to the original URL
    return NextResponse.redirect(link.originalUrl)
  } catch (error) {
    console.error('Error redirecting:', error)
    return NextResponse.redirect(new URL('/error', request.url))
  }
}