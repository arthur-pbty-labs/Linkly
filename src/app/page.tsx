import { LinkForm } from '@/components/LinkForm'
import { LinkIcon, Shield, BarChart3, QrCode } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Raccourcissez vos liens en toute simplicité
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transformez vos longues URL en liens courts, partageables et personnalisables avec Linkly.
        </p>
      </div>

      {/* Main Form */}
      <div className="mb-16">
        <LinkForm />
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Liens Personnalisés
          </h3>
          <p className="text-gray-600">
            Créez des liens courts personnalisés pour votre marque.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <QrCode className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Code QR Intégré
          </h3>
          <p className="text-gray-600">
            Génération automatique de QR codes pour tous vos liens.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Statistiques Détaillées
          </h3>
          <p className="text-gray-600">
            Suivez les performances de vos liens avec des analytics avancés.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sécurisé & Fiable
          </h3>
          <p className="text-gray-600">
            Protection contre les liens malveillants et expiration contrôlée.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à optimiser vos liens ?
        </h2>
        <p className="text-xl mb-6 text-primary-100">
          Créez un compte pour accéder à toutes les fonctionnalités avancées.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-primary-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
            Créer un compte gratuit
          </button>
          <button className="border border-white text-white font-medium py-3 px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  )
}