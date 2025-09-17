// Types based on Prisma schema
export interface User {
  id: string
  name?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
}

export interface Link {
  id: string
  originalUrl: string
  shortCode: string
  title?: string | null
  description?: string | null
  expiresAt?: Date | null
  maxClicks?: number | null
  isActive: boolean
  isOneTime: boolean
  createdAt: Date
  updatedAt: Date
  userId?: string | null
}

export interface Click {
  id: string
  linkId: string
  userAgent?: string | null
  referer?: string | null
  ip?: string | null
  country?: string | null
  city?: string | null
  createdAt: Date
}

export type LinkWithUser = Link & {
  user?: User | null
  clicks: Click[]
}

export type LinkWithClicks = Link & {
  clicks: Click[]
  _count: {
    clicks: number
  }
}

export interface CreateLinkRequest {
  url: string
  customCode?: string
  expiresAt?: string
  maxClicks?: number
  isOneTime?: boolean
}

export interface LinkStats {
  totalClicks: number
  uniqueClicks: number
  recentClicks: Click[]
  topCountries: { country: string; count: number }[]
  clicksByDate: { date: string; count: number }[]
}