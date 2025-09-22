import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Erreur - Linkly",
  description: "Une erreur s'est produite. Retournez à l'accueil pour créer de nouveaux liens raccourcis.",
  robots: "noindex, nofollow",
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <AlertTriangle className="mx-auto h-24 w-24 text-red-500" />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Erreur
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Une erreur s&apos;est produite lors du traitement de votre demande.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}