import { prisma } from '../src/lib/prisma'

async function cleanupExpiredLinks() {
  try {
    const now = new Date()
    
    // Supprimer les liens expirés
    const deletedLinks = await prisma.link.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    })
    
    console.log(`🧹 Nettoyage terminé: ${deletedLinks.count} liens expirés supprimés`)
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le nettoyage
cleanupExpiredLinks()