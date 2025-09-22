import Link from "next/link"
import { Ban } from "lucide-react"

export default function LimitReachedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Ban className="mx-auto h-24 w-24 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Limite atteinte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ce lien a atteint son nombre maximum de clics et n'est plus disponible.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}