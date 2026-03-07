import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { categorize } from '@/lib/categorize'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id

        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        })

        return NextResponse.json(transactions)
    } catch (error) {
        console.error('Get transactions error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id

        // Check subscription status and limits
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true }
        })

        const isPremium = user?.subscription?.status === 'active'

        if (!isPremium) {
            const now = new Date()
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

            const monthlyCount = await prisma.transaction.count({
                where: {
                    userId,
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            })

            if (monthlyCount >= 12) {
                return NextResponse.json({
                    error: 'Monthly limit reached (12/12)',
                    limitReached: true
                }, { status: 403 })
            }
        }

        const body = await request.json()
        const { amount, description, category, type, date, recurring } = body

        const finalCategory = category || categorize(description)

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                amount: parseFloat(amount),
                description,
                category: finalCategory,
                type,
                date: new Date(date),
                recurring: recurring || false,
            },
        })

        return NextResponse.json(transaction, { status: 201 })
    } catch (error) {
        console.error('Create transaction error:', error)
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
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 })
        }

        // Verify ownership
        const transaction = await prisma.transaction.findFirst({
            where: { id, userId },
        })

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
        }

        await prisma.transaction.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete transaction error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
