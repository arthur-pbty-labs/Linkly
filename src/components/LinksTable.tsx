import { useState } from 'react'
import { LinkWithClicks } from '@/types'
import { Copy, ExternalLink, QrCode, Trash2, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { generateQRCode } from '@/lib/qrcode'

interface LinksTableProps {
  links: LinkWithClicks[]
  onLinkDeleted: (linkId: string) => void
}

export function LinksTable({ links, onLinkDeleted }: LinksTableProps) {
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({})

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Lien copié!')
  }

  const handleShowQRCode = async (shortCode: string) => {
    if (qrCodes[shortCode]) {
      // Remove QR code if already shown
      const newQrCodes = { ...qrCodes }
      delete newQrCodes[shortCode]
      setQrCodes(newQrCodes)
    } else {
      // Generate and show QR code
      try {
        const shortUrl = `${window.location.origin}/${shortCode}`
        const qrCodeDataUrl = await generateQRCode(shortUrl)
        setQrCodes(prev => ({ ...prev, [shortCode]: qrCodeDataUrl }))
      } catch (error) {
        console.error('Error generating QR code:', error)
        alert('Erreur lors de la génération du QR code')
      }
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lien ?')) {
      return
    }

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onLinkDeleted(linkId)
      } else {
        alert('Erreur lors de la suppression du lien')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      alert('Erreur lors de la suppression du lien')
    }
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Eye className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun lien trouvé
        </h3>
        <p className="text-gray-600">
          Créez votre premier lien raccourci pour commencer!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL originale
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clics
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créé le
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((link) => {
              const shortUrl = `${window.location.origin}/${link.shortCode}`
              const isExpired = link.expiresAt && new Date() > new Date(link.expiresAt)
              const isMaxClicks = link.maxClicks && (link._count?.clicks || 0) >= link.maxClicks
              
              return (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {link.shortCode}
                      </code>
                      <button
                        onClick={() => copyToClipboard(shortUrl)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copier le lien"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                        title="Ouvrir le lien"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    {qrCodes[link.shortCode] && (
                      <div className="mt-2">
                        <img 
                          src={qrCodes[link.shortCode]} 
                          alt="QR Code" 
                          className="w-24 h-24"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs" title={link.originalUrl}>
                      {link.originalUrl}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {link._count?.clicks || 0}
                      {link.maxClicks && (
                        <span className="text-gray-500">
                          /{link.maxClicks}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      !link.isActive || isExpired || isMaxClicks
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {!link.isActive || isExpired || isMaxClicks ? 'Inactif' : 'Actif'}
                    </span>
                    {link.expiresAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        Expire: {formatDate(new Date(link.expiresAt))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(new Date(link.createdAt))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleShowQRCode(link.shortCode)}
                        className="text-primary-600 hover:text-primary-900"
                        title={qrCodes[link.shortCode] ? 'Masquer QR' : 'Afficher QR'}
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}