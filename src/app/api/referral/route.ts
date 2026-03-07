import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// GET — Fetch current user's affiliate data
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            affiliate: {
                include: {
                    referrals: {
                        orderBy: { createdAt: 'desc' },
                    },
                },
            },
        },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.affiliate) {
        return NextResponse.json({ affiliate: null })
    }

    const activeReferrals = user.affiliate.referrals.filter(r => r.status === 'active')
    const monthlyIncome = activeReferrals.length * 2.99

    return NextResponse.json({
        affiliate: {
            ...user.affiliate,
            activeCount: activeReferrals.length,
            monthlyIncome: Math.round(monthlyIncome * 100) / 100,
        },
    })
}

// POST — Activate user as affiliate
export async function POST() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { affiliate: true },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Already an affiliate
    if (user.affiliate) {
        return NextResponse.json({ affiliate: user.affiliate })
    }

    // Generate a unique 8-char referral code
    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase()

    const affiliate = await prisma.affiliate.create({
        data: {
            userId: user.id,
            referralCode,
        },
        include: {
            referrals: true,
        },
    })

    return NextResponse.json({
        affiliate: {
            ...affiliate,
            activeCount: 0,
            monthlyIncome: 0,
        },
    })
}
