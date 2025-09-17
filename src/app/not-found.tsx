import Link from 'next/link'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Lien introuvable
          </h1>
          <p className="text-gray-600">
            Le lien que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/" className="btn-primary w-full block">
            Créer un nouveau lien
          </Link>
          <p className="text-sm text-gray-500">
            Vérifiez l&apos;URL ou contactez la personne qui vous a partagé ce lien.
          </p>
        </div>
      </div>
    </div>
  )
}