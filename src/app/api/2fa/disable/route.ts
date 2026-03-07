import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id

        await prisma.twoFactorAuth.delete({
            where: { userId },
        }).catch(() => { })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('2FA disable error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
