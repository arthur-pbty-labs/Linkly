"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Github, Mail, Home } from "lucide-react"
import Link from "next/link"
import Head from "next/head"

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  if (!providers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Connexion - Linkly</title>
        <meta name="description" content="Connectez-vous à Linkly pour créer des liens personnalisés et accéder à vos analytics détaillés." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connectez-vous à Linkly
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Accédez à votre tableau de bord et gérez vos liens
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
            {Object.values(providers).map((provider: Provider) => (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    provider.id === "github"
                      ? "bg-gray-800 hover:bg-gray-700 focus:ring-gray-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {provider.id === "github" ? (
                      <Github className="h-5 w-5" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                  </span>
                  Continuer avec {provider.name}
                </button>
              </div>
            ))}
          </div>
          
          {/* Bouton de retour à l'accueil */}
          <div className="pt-4">
            <Link
              href="/"
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Home className="h-5 w-5 text-gray-400" />
              </span>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}