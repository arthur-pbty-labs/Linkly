import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur
          </h1>
          <p className="text-gray-600">
            Une erreur s&apos;est produite lors de la redirection. Veuillez réessayer plus tard.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/" className="btn-primary w-full block">
            Retour à l&apos;accueil
          </Link>
          <p className="text-sm text-gray-500">
            Si le problème persiste, contactez le support technique.
          </p>
        </div>
      </div>
    </div>
  )
}