import { Header } from "@/components/header"
import { LinkForm } from "@/components/link-form"
import { Link, Shield, BarChart3, QrCode } from "lucide-react"

export default function Home() {
  return (
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
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Créer un lien court
              </h2>
              <p className="text-lg text-gray-600">
                Collez votre URL et obtenez instantanément un lien court avec QR code
              </p>
            </div>
            <LinkForm />
          </div>
        </section>
      </main>
    </div>
  )
}
