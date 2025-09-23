"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Link as LinkIcon, Calendar, MousePointer, Zap, QrCode, Copy, Check, Edit3 } from "lucide-react"

interface Link {
  id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  qrCode?: string
  clicks: number
  maxClicks?: number
  expiresAt?: string
  createdAt: string
  lastAccessAt?: string
  userId?: string
  isOneTime: boolean
}

interface LinkFormProps {
  onLinkCreated?: (link: Link) => void
}

export function LinkForm({ onLinkCreated }: LinkFormProps) {
  const { data: session } = useSession()
  const [url, setUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [maxClicks, setMaxClicks] = useState("")
  const [isOneTime, setIsOneTime] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Link | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
          customCode: customCode || null,
          expiresAt: expiresAt || null,
          maxClicks: maxClicks ? parseInt(maxClicks) : null,
          isOneTime,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création du lien")
      }

      const link = await response.json()
      setResult(link)
      setUrl("")
      setCustomCode("")
      setExpiresAt("")
      setMaxClicks("")
      setIsOneTime(false)
      
      if (onLinkCreated) {
        onLinkCreated(link)
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de la création du lien")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Erreur lors de la copie:", error)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border shadow-sm">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-card-foreground mb-2">
            URL à raccourcir
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {session?.user && (
          <div>
            <label htmlFor="customCode" className="block text-sm font-medium text-card-foreground mb-2">
              <Edit3 className="inline h-4 w-4 mr-1" />
              Code personnalisé (optionnel)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground text-sm">
                {typeof window !== "undefined" ? window.location.origin : ""}/
              </span>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="mon-lien"
                pattern="[a-z0-9-_]{3,20}"
                minLength={3}
                maxLength={20}
                className="block w-full pl-20 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              3-20 caractères, lettres minuscules, chiffres, tirets et underscores uniquement
            </p>
          </div>
        )}

        {session?.user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-card-foreground mb-2">
                Date d&apos;expiration (optionnel)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="maxClicks" className="block text-sm font-medium text-card-foreground mb-2">
                Nombre max de clics (optionnel)
              </label>
              <div className="relative">
                <MousePointer className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="number"
                  id="maxClicks"
                  value={maxClicks}
                  onChange={(e) => setMaxClicks(e.target.value)}
                  min="1"
                  placeholder="Illimité"
                  className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {session?.user && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOneTime"
              checked={isOneTime}
              onChange={(e) => setIsOneTime(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
            />
            <label htmlFor="isOneTime" className="ml-2 block text-sm text-card-foreground">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                Lien à usage unique (supprimé après le premier clic)
              </div>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Création en cours..." : "Raccourcir le lien"}
        </button>

        {!session?.user && (
          <p className="text-sm text-muted-foreground text-center">
            💡 Les liens créés sans compte expirent automatiquement après 7 jours.
            <br />
            <Link href="/auth/signin" className="text-primary hover:text-primary/80">
              Connectez-vous
            </Link>{" "}
            pour plus d&apos;options.
          </p>
        )}
      </form>

      {result && (
        <div className="mt-6 bg-success/10 border border-success/20 rounded-lg p-6">
          <h3 className="text-lg font-medium text-success mb-4">
            ✅ Lien créé avec succès !
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Lien court
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={result.shortUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(result.shortUrl)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {result.qrCode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <QrCode className="inline h-4 w-4 mr-1" />
                  QR Code
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={result.qrCode}
                    alt="QR Code"
                    className="w-24 h-24 border border-gray-300 rounded"
                  />
                  <a
                    href={result.qrCode}
                    download={`qr-code-${result.shortCode}.png`}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Télécharger
                  </a>
                </div>
              </div>
            )}

            {result.expiresAt && (
              <p className="text-sm text-gray-600">
                ⏰ Expire le {new Date(result.expiresAt).toLocaleString("fr-FR")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}