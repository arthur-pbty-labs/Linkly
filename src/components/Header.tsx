'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogIn, LogOut, User, LinkIcon } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Linkly</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Accueil
            </Link>
            {session && (
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Tableau de bord
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center space-x-2 btn-primary"
              >
                <LogIn className="h-5 w-5" />
                <span>Connexion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}