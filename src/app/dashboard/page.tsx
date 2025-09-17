'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { LinkWithClicks } from '@/types'
import { DashboardStats } from '@/components/DashboardStats'
import { LinksTable } from '@/components/LinksTable'
import { LinkForm } from '@/components/LinkForm'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [links, setLinks] = useState<LinkWithClicks[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLinks()
    }
  }, [status])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links')
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      }
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkCreated = () => {
    fetchLinks() // Refresh the links list
  }

  const handleLinkDeleted = (linkId: string) => {
    setLinks(links.filter(link => link.id !== linkId))
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Accès non autorisé
        </h1>
        <p className="text-gray-600 mb-8">
          Vous devez être connecté pour accéder au tableau de bord.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="btn-primary"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue, {session.user?.name}! Gérez vos liens et consultez vos statistiques.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <DashboardStats links={links} />
      </div>

      {/* Quick Link Creation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Créer un nouveau lien
          </h2>
          <LinkForm onLinkCreated={handleLinkCreated} />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Raccourcis
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              📊 Voir toutes les statistiques
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              📥 Exporter les données
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              ⚙️ Paramètres du compte
            </button>
          </div>
        </div>
      </div>

      {/* Links Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Mes liens ({links.length})
        </h2>
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des liens...</p>
          </div>
        ) : (
          <LinksTable links={links} onLinkDeleted={handleLinkDeleted} />
        )}
      </div>
    </div>
  )
}