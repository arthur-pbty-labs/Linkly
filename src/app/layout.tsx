import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'Linkly - Raccourcisseur d\'URL moderne',
  description: 'Transformez vos longues URL en liens courts, partageables et personnalisables avec Linkly.',
  keywords: ['raccourcisseur', 'URL', 'liens courts', 'QR code'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}