import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                twoFactor: { select: { isEnabled: true } },
                subscription: { select: { status: true, currentPeriodEnd: true } },
                loginHistory: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    select: { id: true, ip: true, userAgent: true, createdAt: true },
                },
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id
        const body = await request.json()
        const { name, currentPassword, newPassword, image } = body

        const updateData: any = {}

        if (name !== undefined) {
            updateData.name = name
        }

        if (image !== undefined) {
            updateData.image = image
        }

        if (currentPassword && newPassword) {
            const user = await prisma.user.findUnique({ where: { id: userId } })
            if (!user?.hashedPassword) {
                return NextResponse.json({ error: 'Cannot change password for OAuth accounts' }, { status: 400 })
            }

            const isValid = await bcrypt.compare(currentPassword, user.hashedPassword)
            if (!isValid) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
            }

            if (newPassword.length < 8) {
                return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
            }

            updateData.hashedPassword = await bcrypt.hash(newPassword, 12)
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No changes provided' }, { status: 400 })
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id

        // Verify password before deletion
        const body = await request.json().catch(() => ({}))
        const { password } = body

        if (password) {
            const user = await prisma.user.findUnique({ where: { id: userId } })
            if (user?.hashedPassword) {
                const isValid = await bcrypt.compare(password, user.hashedPassword)
                if (!isValid) {
                    return NextResponse.json({ error: 'Incorrect password' }, { status: 400 })
                }
            }
        }

        // Delete user — cascading deletes are configured in the schema
        await prisma.user.delete({ where: { id: userId } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete account error:', error)
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }
}
