"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { ArrowLeft, Copy, Check, QrCode, Calendar, MousePointer, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"
import Head from "next/head"

interface LinkDetail {
  id: string
  shortCode: string
  originalUrl: string
  qrCode?: string
  clicks: number
  maxClicks?: number
  expiresAt?: string
  createdAt: string
  lastAccessAt?: string
  isOneTime: boolean
  clickHistory: {
    date: string
    clicks: number
  }[]
}

export default function LinkDetails({ params }: { params: Promise<{ linkId: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [link, setLink] = useState<LinkDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [linkId, setLinkId] = useState<string>("")

  useEffect(() => {
    params.then(p => setLinkId(p.linkId))
  }, [params])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user && linkId) {
      fetchLinkDetails()
    }
  }, [session, linkId])

  const fetchLinkDetails = async () => {
    try {
      const response = await fetch(`/api/links/${linkId}/details`)
      if (response.ok) {
        const data = await response.json()
        setLink(data)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
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

  const maxClicks = Math.max(...(link?.clickHistory.map(h => h.clicks) || [0]))
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user || !link) {
    return null
  }

  return (
    <>
      <Head>
        <title>{link ? `Analytics - ${link.shortCode}` : 'Analytics'} - Linkly</title>
        <meta name="description" content={`Statistiques détaillées et analytics pour le lien ${link?.shortCode || 'raccourci'} avec graphiques de performance.`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Statistiques du lien
          </h1>
          <p className="text-lg text-gray-600">
            Analysez les performances de votre lien raccourci
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations du lien */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations du lien
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien court
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${baseUrl}/${link.shortCode}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(`${baseUrl}/${link.shortCode}`)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de destination
                  </label>
                  <p className="text-sm text-gray-600 break-all bg-gray-50 p-3 rounded-md">
                    {link.originalUrl}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500">Total des clics</span>
                    <span className="text-2xl font-bold text-blue-600">{link.clicks}</span>
                  </div>
                  {link.maxClicks && (
                    <div>
                      <span className="block text-gray-500">Limite</span>
                      <span className="text-2xl font-bold text-gray-900">{link.maxClicks}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Créé le {new Date(link.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                  
                  {link.lastAccessAt && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Dernier accès: {new Date(link.lastAccessAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  )}
                  
                  {link.expiresAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Expire le {new Date(link.expiresAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  )}
                  
                  {link.isOneTime && (
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Usage unique
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QR Code */}
            {link.qrCode && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <QrCode className="inline h-5 w-5 mr-2" />
                  QR Code
                </h3>
                <div className="text-center">
                  <img
                    src={link.qrCode}
                    alt="QR Code"
                    className="mx-auto w-48 h-48 border border-gray-300 rounded"
                  />
                  <a
                    href={link.qrCode}
                    download={`qr-code-${link.shortCode}.png`}
                    className="mt-4 inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Télécharger
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Graphiques */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <TrendingUp className="inline h-5 w-5 mr-2" />
                Évolution des clics
              </h2>
              
              {link.clickHistory.length > 0 ? (
                <div className="space-y-6">
                  {/* Graphique en barres simple */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Clics par jour (30 derniers jours)
                    </h3>
                    <div className="space-y-2">
                      {link.clickHistory.slice(-30).map((day, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-20 text-sm text-gray-600 flex-shrink-0">
                            {new Date(day.date).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit"
                            })}
                          </div>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full transition-all duration-300"
                              style={{
                                width: maxClicks > 0 ? `${(day.clicks / maxClicks) * 100}%` : "0%"
                              }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                              {day.clicks}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statistiques résumées */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {link.clickHistory.reduce((sum, day) => sum + day.clicks, 0)}
                      </div>
                      <div className="text-sm text-gray-500">Total des clics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(link.clickHistory.reduce((sum, day) => sum + day.clicks, 0) / Math.max(link.clickHistory.length, 1) * 10) / 10}
                      </div>
                      <div className="text-sm text-gray-500">Moyenne/jour</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.max(...link.clickHistory.map(day => day.clicks))}
                      </div>
                      <div className="text-sm text-gray-500">Pic maximum</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {link.clickHistory.filter(day => day.clicks > 0).length}
                      </div>
                      <div className="text-sm text-gray-500">Jours actifs</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MousePointer className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Aucun clic enregistré pour ce lien
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics avancés */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Analytics avancés
          </h2>
          <AdvancedAnalytics linkId={link.id} />
        </div>
      </main>
    </div>
    </>
  )
}
