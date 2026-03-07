import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    const body = await request.text()
    const headersList = headers()
    const sig = headersList.get('stripe-signature')

    if (!sig) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const subscriptionId = session.subscription as string
                const customerId = session.customer as string

                const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)

                await prisma.subscription.update({
                    where: { stripeCustomerId: customerId },
                    data: {
                        stripeSubscriptionId: subscriptionId,
                        stripePriceId: stripeSubscription.items.data[0]?.price.id,
                        status: 'active',
                        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                    },
                })
                break
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice
                const subscriptionId = invoice.subscription as string

                if (subscriptionId) {
                    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
                    await prisma.subscription.update({
                        where: { stripeSubscriptionId: subscriptionId },
                        data: {
                            status: 'active',
                            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                        },
                    })
                }
                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                await prisma.subscription.update({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        status: 'canceled',
                        stripeSubscriptionId: null,
                    },
                })
                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription
                await prisma.subscription.update({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        status: subscription.status === 'active' ? 'active' : subscription.status,
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    },
                })
                break
            }
        }
    } catch (error) {
        console.error('Webhook handler error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
