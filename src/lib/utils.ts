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