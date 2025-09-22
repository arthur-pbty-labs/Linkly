import { nanoid } from 'nanoid'
import QRCode from 'qrcode'

export function generateShortCode(): string {
  return nanoid(8)
}

export async function generateQRCode(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url)
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error)
    throw new Error('Impossible de générer le QR code')
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function sanitizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

export function isValidCustomCode(code: string): boolean {
  return /^[a-z0-9-_]{3,20}$/.test(code)
}

// Codes réservés que les utilisateurs ne peuvent pas utiliser
export const  RESERVED_CODES = [
  'api', 'auth', 'dashboard', 'admin', 'www', 'app', 'mail', 'ftp',
  'login', 'register', 'signin', 'signup', 'logout', 'home', 'about',
  'contact', 'help', 'support', 'docs', 'blog', 'news', 'static',
  'assets', 'public', 'private', 'error', 'expired', 'limit-reached'
]

export function isReservedCode(code: string): boolean {
  return RESERVED_CODES.includes(code.toLowerCase())
}