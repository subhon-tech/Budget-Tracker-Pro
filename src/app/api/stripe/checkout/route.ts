import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id
        const userEmail = session.user.email!

        // Find or create Stripe customer
        let subscription = await prisma.subscription.findUnique({
            where: { userId },
        })

        let stripeCustomerId: string

        if (subscription?.stripeCustomerId) {
            stripeCustomerId = subscription.stripeCustomerId
        } else {
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: { userId },
            })
            stripeCustomerId = customer.id

            subscription = await prisma.subscription.upsert({
                where: { userId },
                update: { stripeCustomerId },
                create: {
                    userId,
                    stripeCustomerId,
                    status: 'inactive',
                },
            })
        }

        // Create Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID!,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
            metadata: { userId },
        })

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }
}
