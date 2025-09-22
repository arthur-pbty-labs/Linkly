import { Header } from "@/components/header"
import { LinkForm } from "@/components/link-form"
import Script from "next/script"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Linkly",
    "url": "https://linkly.serverarthur.duckdns.org",
    "description": "Service gratuit de raccourcissement de liens avec analytics avancés, QR codes et tableau de bord complet.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "featureList": [
      "Raccourcissement d'URLs instantané",
      "Génération automatique de QR codes",
      "Analytics détaillés avec graphiques",
      "Tableau de bord pour gérer vos liens",
      "Liens personnalisés pour utilisateurs connectés",
      "Statistiques de clics en temps réel"
    ],
    "provider": {
      "@type": "Organization",
      "name": "Linkly",
      "url": "https://linkly.serverarthur.duckdns.org"
    }
  }

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Raccourcissez vos liens
                <br />
                <span className="text-blue-200">en toute simplicité</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Créez des liens courts, suivez les statistiques et gérez tout depuis un tableau de bord unique.
              </p>
              <div className="mt-10">
                <p className="text-sm text-blue-200 mb-4">
                  Service 100% gratuit • Analytics avancés • QR codes inclus
                </p>
              </div>
            </div>
          </section>

          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Créer un lien court
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Collez votre URL et obtenez instantanément un lien court avec QR code
                </p>
                <p className="text-sm text-gray-500">
                  Aucune inscription requise • Liens illimités • Analytics disponibles
                </p>
              </div>
              <LinkForm />
            </div>
          </section>

          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Fonctionnalités avancées
                </h2>
                <p className="text-lg text-gray-600">
                  Tout ce dont vous avez besoin pour gérer vos liens efficacement
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Liens personnalisés</h3>
                  <p className="text-gray-600">Créez des liens avec vos propres codes personnalisés pour une meilleure mémorisation.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics détaillés</h3>
                  <p className="text-gray-600">Suivez les performances de vos liens avec des graphiques et statistiques avancés.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Codes automatiques</h3>
                  <p className="text-gray-600">Chaque lien court génère automatiquement un QR code pour un partage facile.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
