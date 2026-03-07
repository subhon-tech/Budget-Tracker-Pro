import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const subscriptions = await prisma.fixedSubscription.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(subscriptions)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { platform, price, startDate } = await req.json()

    if (!platform || !price || !startDate) {
        return NextResponse.json({ error: 'Platform, price, and start date are required' }, { status: 400 })
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice)) {
        return NextResponse.json({ error: 'Invalid price format' }, { status: 400 })
    }

    const parsedDate = new Date(startDate)
    if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    try {
        const subscription = await prisma.fixedSubscription.create({
            data: {
                userId,
                platform,
                price: parsedPrice,
                startDate: parsedDate,
            },
        })

        return NextResponse.json(subscription)
    } catch (err: any) {
        console.error('Subscription creation error:', err)
        return NextResponse.json({
            error: 'Failed to create subscription in database',
            details: err.message || 'Unknown error'
        }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { id } = await req.json()

    await prisma.fixedSubscription.deleteMany({
        where: { id, userId },
    })

    return NextResponse.json({ success: true })
}
