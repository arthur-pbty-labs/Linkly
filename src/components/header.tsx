"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User, LogOut, BarChart3 } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Linkly
          </Link>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-muted-foreground hover:text-primary transition-colors"
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
                        className="h-8 w-8 rounded-full border-2 border-border"
                      />
                    )}
                    <span className="text-sm font-medium text-card-foreground">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-muted-foreground hover:text-destructive transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
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