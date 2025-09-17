import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if the link belongs to the user
    const link = await prisma.link.findUnique({
      where: { id },
    })

    if (!link) {
      return NextResponse.json(
        { message: 'Lien non trouvé' },
        { status: 404 }
      )
    }

    if (!session.user?.id || link.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Delete the link (this will cascade delete clicks due to Prisma schema)
    await prisma.link.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Lien supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}