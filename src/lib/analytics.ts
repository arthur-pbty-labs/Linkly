import { NextRequest } from 'next/server'
import { prisma } from './prisma'

interface AnalyticsData {
  ip?: string
  userAgent?: string
  country?: string
  city?: string
  device?: string
  browser?: string
  referrer?: string
}

export async function recordClickEvent(linkId: string, request: NextRequest): Promise<void> {
  try {
    const analytics = await extractAnalyticsData(request)
    
    await prisma.clickEvent.create({
      data: {
        linkId,
        ...analytics,
      }
    })
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des analytics:', error)
  }
}

async function extractAnalyticsData(request: NextRequest): Promise<AnalyticsData> {
  const userAgent = request.headers.get('user-agent') || ''
  const ip = getClientIP(request)
  const referrer = request.headers.get('referer') || undefined

  return {
    ip,
    userAgent,
    country: await getCountryFromIP(ip),
    city: await getCityFromIP(ip),
    device: detectDevice(userAgent),
    browser: detectBrowser(userAgent),
    referrer,
  }
}

function getClientIP(request: NextRequest): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  // Fallback pour le développement local
  return '127.0.0.1'
}

async function getCountryFromIP(ip?: string): Promise<string | undefined> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return undefined
  
  try {
    // Utilisation d'un service gratuit pour la géolocalisation
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country`)
    const data = await response.json()
    return data.country
  } catch {
    return undefined
  }
}

async function getCityFromIP(ip?: string): Promise<string | undefined> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return undefined
  
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=city`)
    const data = await response.json()
    return data.city
  } catch {
    return undefined
  }
}

function detectDevice(userAgent: string): string {
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    if (/iPad/.test(userAgent)) return 'Tablet'
    return 'Mobile'
  }
  return 'Desktop'
}

function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Autre'
}

export async function getAnalyticsSummary(linkId: string) {
  const [
    totalClicks,
    uniqueClicks,
    deviceStats,
    browserStats,
    countryStats,
    dailyStats
  ] = await Promise.all([
    prisma.clickEvent.count({ where: { linkId } }),
    prisma.clickEvent.groupBy({
      by: ['ip'],
      where: { linkId, ip: { not: null } },
      _count: true
    }),
    prisma.clickEvent.groupBy({
      by: ['device'],
      where: { linkId, device: { not: null } },
      _count: true
    }),
    prisma.clickEvent.groupBy({
      by: ['browser'],
      where: { linkId, browser: { not: null } },
      _count: true
    }),
    prisma.clickEvent.groupBy({
      by: ['country'],
      where: { linkId, country: { not: null } },
      _count: true
    }),
    prisma.$queryRaw`
      SELECT DATE(timestamp) as date, COUNT(*) as clicks
      FROM ClickEvent 
      WHERE linkId = ${linkId}
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
      LIMIT 30
    `
  ])

  return {
    totalClicks,
    uniqueClicks: uniqueClicks.length,
    deviceStats: deviceStats.map(d => ({ device: d.device, count: d._count })),
    browserStats: browserStats.map(b => ({ browser: b.browser, count: b._count })),
    countryStats: countryStats.map(c => ({ country: c.country, count: c._count })),
    dailyStats
  }
}