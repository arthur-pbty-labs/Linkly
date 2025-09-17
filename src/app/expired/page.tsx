import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Lien expiré
          </h1>
          <p className="text-gray-600">
            Ce lien n&apos;est plus valide. Il a peut-être expiré ou atteint sa limite d&apos;utilisation.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/" className="btn-primary w-full block">
            Créer un nouveau lien
          </Link>
          <p className="text-sm text-gray-500">
            Contactez la personne qui vous a partagé ce lien pour obtenir un nouveau lien valide.
          </p>
        </div>
      </div>
    </div>
  )
}