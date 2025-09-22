"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User, LogOut, BarChart3 } from "lucide-react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Linkly
          </Link>
          
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {session.user.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ""}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}