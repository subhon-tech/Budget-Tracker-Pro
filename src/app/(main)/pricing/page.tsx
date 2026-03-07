'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Zap, BarChart3, Shield, Globe, ArrowLeft, DollarSign } from 'lucide-react'

const plans = [
    {
        name: 'Starter',
        price: '0',
        description: 'Perfect for basic expense tracking',
        features: [
            { text: 'Max 2 budget categories', included: true },
            { text: '12 transactions per month', included: true },
            { text: 'Manual data entry only', included: true },
            { text: 'Standard login security', included: true },
            { text: 'CSV/Bank import', included: false },
            { text: '2FA Security', included: true },
            { text: 'Advanced insights', included: false },
        ],
        cta: 'Continue for Free',
        popular: false,
    },
    {
        name: 'Premium',
        price: '9.99',
        yearlyPrice: '7.99',
        description: 'Advanced features for serious tracking',
        features: [
            { text: 'Unlimited budget categories', included: true },
            { text: 'Unlimited transactions', included: true },
            { text: 'CSV & Bank imports', included: true },
            { text: 'Mandatory 2FA Security', included: true },
            { text: 'Burn Rate & Advanced insights', included: true },
            { text: 'Priority support', included: true },
            { text: 'Custom categories', included: true },
        ],
        cta: 'Get Premium Now',
        popular: true,
    },
]

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null)
    const [isYearly, setIsYearly] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()

    const handleSubscribe = async (plan: string) => {
        if (!session) {
            router.push('/login')
            return
        }

        if (plan === 'Starter') {
            router.push('/dashboard')
            return
        }

        setLoading(plan)
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interval: isYearly ? 'year' : 'month' })
            })
            const data = await res.json()

            if (data.url) {
                window.location.href = data.url
            } else {
                alert('Failed to create checkout session.')
            }
        } catch {
            alert('Something went wrong')
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Evero Budget</h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest -mt-0.5 font-bold">Pro Finance</p>
                        </div>
                    </div>
                    <Button size="sm" onClick={() => router.back()} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Choose your plan</h2>
                    <p className="text-xl text-muted-foreground mb-8">Simple, transparent pricing for everyone.</p>

                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-12 h-6 rounded-full bg-muted transition-colors focus:outline-none"
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-500 transition-transform ${isYearly ? 'translate-x-6' : ''}`} />
                        </button>
                        <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Yearly</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold animate-pulse">Save 20%</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <Card id={plan.name.toLowerCase()} key={plan.name} className={`relative flex flex-col ${plan.popular ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10' : ''}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                    <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-4xl font-bold">
                                        ${isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                                    </span>
                                    <span className="text-muted-foreground">/{isYearly ? 'year billed monthly' : 'month'}</span>
                                </div>
                                <CardDescription className="mt-2">{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 space-y-6">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            {feature.included ? (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 shrink-0">
                                                    <Check className="w-3 h-3 text-emerald-500" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                                </div>
                                            )}
                                            <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => handleSubscribe(plan.name)}
                                    className={`w-full py-6 text-lg ${plan.popular ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                                    disabled={loading !== null}
                                >
                                    {loading === plan.name ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        plan.cta
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 max-w-3xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left py-4 font-medium text-muted-foreground">Feature</th>
                                        <th className="text-center py-4 font-medium text-muted-foreground">Starter</th>
                                        <th className="text-center py-4 font-medium text-muted-foreground">Premium</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { label: 'Budget Categories', starter: 'Max 2', premium: 'Unlimited' },
                                        { label: 'Monthly Transactions', starter: 'Max 12', premium: 'Unlimited' },
                                        { label: 'Data Entry', starter: 'Manual Only', premium: 'Manual + CSV + Bank' },
                                        { label: '2FA Security', starter: 'Yes', premium: 'Yes' },
                                        { label: 'Burn Rate & Insights', starter: 'No', premium: 'Included' },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-border/50">
                                            <td className="py-4 font-medium">{row.label}</td>
                                            <td className="text-center py-4 text-muted-foreground">{row.starter}</td>
                                            <td className="text-center py-4 text-emerald-500 font-medium">{row.premium}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
