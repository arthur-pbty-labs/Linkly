'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Copy, ExternalLink, Download } from 'lucide-react'
import { generateQRCode } from '@/lib/qrcode'

interface LinkFormProps {
  onLinkCreated?: () => void
}

export function LinkForm({ onLinkCreated }: LinkFormProps) {
  const { data: session } = useSession()
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [maxClicks, setMaxClicks] = useState('')
  const [isOneTime, setIsOneTime] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{shortCode: string, id: string} | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          customCode: customCode || undefined,
          expiresAt: expiresAt || undefined,
          maxClicks: maxClicks ? parseInt(maxClicks) : undefined,
          isOneTime,
        }),
      })

      if (response.ok) {
        const link = await response.json()
        setResult(link)
        
        // Generate QR code
        const shortUrl = `${window.location.origin}/${link.shortCode}`
        const qrCodeDataUrl = await generateQRCode(shortUrl)
        setQrCode(qrCodeDataUrl)
        
        // Reset form
        setUrl('')
        setCustomCode('')
        setExpiresAt('')
        setMaxClicks('')
        setIsOneTime(false)
        
        onLinkCreated?.()
      } else {
        const error = await response.json()
        alert(error.message || 'Erreur lors de la création du lien')
      }
    } catch (error) {
      console.error('Error creating link:', error)
      alert('Erreur lors de la création du lien')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Lien copié dans le presse-papiers!')
  }

  const downloadQRCode = () => {
    if (!qrCode || !result) return
    
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `qr-${result.shortCode}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (result) {
    const shortUrl = `${window.location.origin}/${result.shortCode}`
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lien créé avec succès!</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien court
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="input-field"
              />
              <button
                onClick={() => copyToClipboard(shortUrl)}
                className="btn-secondary"
              >
                <Copy className="h-4 w-4" />
              </button>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {qrCode && (
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Code QR</h3>
              <img src={qrCode} alt="QR Code" className="w-32 h-32" />
              <button
                onClick={downloadQRCode}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger le QR Code</span>
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setResult(null)
              setQrCode(null)
            }}
            className="btn-primary w-full"
          >
            Créer un nouveau lien
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Raccourcir une URL
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            URL à raccourcir *
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="input-field"
            required
          />
        </div>

        {session && (
          <>
            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-2">
                Code personnalisé (optionnel)
              </label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="mon-lien-perso"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                  Date d&apos;expiration (optionnel)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="maxClicks" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre maximum de clics (optionnel)
                </label>
                <input
                  type="number"
                  id="maxClicks"
                  value={maxClicks}
                  onChange={(e) => setMaxClicks(e.target.value)}
                  placeholder="100"
                  min="1"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isOneTime"
                checked={isOneTime}
                onChange={(e) => setIsOneTime(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isOneTime" className="ml-2 block text-sm text-gray-700">
                Usage unique (se désactive après le premier clic)
              </label>
            </div>
          </>
        )}

        {!session && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Sans compte :</strong> Les liens expirent automatiquement après 7 jours. 
              Connectez-vous pour personnaliser l&apos;expiration et accéder à plus d&apos;options.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Création en cours...' : 'Raccourcir l&apos;URL'}
        </button>
      </form>
    </div>
  )
}