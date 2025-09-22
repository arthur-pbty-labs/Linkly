"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { LinkForm } from "@/components/link-form"
import { Trash2, Copy, Eye, Calendar, MousePointer, QrCode, Check } from "lucide-react"

interface Link {
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
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchLinks()
    }
  }, [session])

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links")
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des liens:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteLink = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) return

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setLinks(links.filter(link => link.id !== id))
      } else {
        alert("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const copyToClipboard = async (text: string, shortCode: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(shortCode)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error("Erreur lors de la copie:", error)
    }
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tableau de bord
          </h1>
          <p className="text-lg text-gray-600">
            Gérez vos liens et consultez leurs statistiques
          </p>
        </div>

        {/* Formulaire de création */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Créer un nouveau lien
          </h2>
          <LinkForm onLinkCreated={fetchLinks} />
        </div>

        {/* Liste des liens */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Mes liens ({links.length})
          </h2>
          
          {links.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                Vous n'avez encore créé aucun lien.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {links.map((link) => (
                <div key={link.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {baseUrl}/{link.shortCode}
                        </h3>
                        <button
                          onClick={() => copyToClipboard(`${baseUrl}/${link.shortCode}`, link.shortCode)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {copied === link.shortCode ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mb-3 truncate">
                        → {link.originalUrl}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MousePointer className="h-4 w-4" />
                          {link.clicks} clic{link.clicks !== 1 ? "s" : ""}
                          {link.maxClicks && ` / ${link.maxClicks}`}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Créé le {new Date(link.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                        
                        {link.lastAccessAt && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Dernier accès: {new Date(link.lastAccessAt).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                        
                        {link.expiresAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Expire le {new Date(link.expiresAt).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                        
                        {link.isOneTime && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            Usage unique
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {link.qrCode && (
                        <a
                          href={link.qrCode}
                          download={`qr-code-${link.shortCode}.png`}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Télécharger le QR code"
                        >
                          <QrCode className="h-5 w-5" />
                        </a>
                      )}
                      
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}