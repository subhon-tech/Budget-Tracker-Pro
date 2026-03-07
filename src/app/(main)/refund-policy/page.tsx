'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RotateCcw, ArrowLeft, CheckCircle2, Clock, Mail, Shield, AlertCircle } from 'lucide-react'

export default function RefundPolicyPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end">
                    <Button size="sm" onClick={() => router.back()} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

                {/* Hero */}
                <section className="text-center space-y-4 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium">
                        <RotateCcw className="w-4 h-4" /> Refund Policy
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">Refund Policy</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We want you to be completely satisfied with Evero Budget. If you&apos;re not, here&apos;s how our refund process works.
                    </p>
                    <p className="text-xs text-muted-foreground">Last updated: March 3, 2026</p>
                </section>

                {/* Key Highlights */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    {[
                        {
                            icon: Clock,
                            title: '7-Day Guarantee',
                            desc: 'Full refund within 7 days of your first Premium subscription — no questions asked.',
                            gradient: 'from-emerald-500 to-teal-600',
                        },
                        {
                            icon: CheckCircle2,
                            title: 'Easy Cancellation',
                            desc: 'Cancel anytime from Settings. Premium stays active until the end of your billing period.',
                            gradient: 'from-blue-500 to-indigo-600',
                        },
                        {
                            icon: Mail,
                            title: 'Quick Support',
                            desc: 'Email us at support@everobudget.com and we\'ll process your refund within 3-5 business days.',
                            gradient: 'from-amber-500 to-orange-600',
                        },
                    ].map((item) => (
                        <Card key={item.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
                            <CardContent className="p-6 relative z-10 space-y-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                {/* Detailed Policy */}
                <section className="space-y-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-amber-500" />
                        </div>
                        Detailed Refund Terms
                    </h3>

                    <Card>
                        <CardContent className="p-8 space-y-8">
                            {/* Section 1 */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-xs font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">01</span>
                                    7-Day Money-Back Guarantee
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    If you subscribe to Premium and are not satisfied within the <strong className="text-foreground">first 7 days</strong>,
                                    you are eligible for a full refund. Simply email us at
                                    <strong className="text-foreground"> support@everobudget.com</strong> with your account email and the reason
                                    for your request. We&apos;ll process the refund within 3-5 business days — no questions asked.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-xs font-black bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full">02</span>
                                    After 7 Days
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    After the 7-day window, you can <strong className="text-foreground">cancel your subscription at any time</strong> from
                                    the Settings page. Your Premium features will remain active until the end of your current billing
                                    cycle (month or year). No partial refunds are issued for unused time within a billing period.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-xs font-black bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full">03</span>
                                    Yearly Plans
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    The same 7-day money-back guarantee applies to yearly subscriptions. If you cancel within
                                    the first 7 days of your yearly plan, you&apos;ll receive a full refund. After that, cancellation
                                    will stop renewal, and you&apos;ll retain Premium access until the end of your current annual billing period.
                                </p>
                            </div>

                            {/* Section 4 */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-xs font-black bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">04</span>
                                    Referral Earnings
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    Referral earnings are non-refundable once paid out. If a referred user requests a refund and
                                    their Premium subscription is cancelled, the associated referral commission will be adjusted
                                    accordingly in your next payout cycle.
                                </p>
                            </div>

                            {/* Section 5 */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-xs font-black bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full">05</span>
                                    Exceptional Circumstances
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    In cases of billing errors, duplicate charges, or unauthorized transactions, please contact us
                                    immediately at <strong className="text-foreground">support@everobudget.com</strong>. We will investigate
                                    and resolve such issues promptly, including issuing full refunds where appropriate.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* How to Request */}
                <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/10">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-amber-500" />
                                <h3 className="text-xl font-bold">How to Request a Refund</h3>
                            </div>
                            <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                                <li>Email <strong className="text-foreground">support@everobudget.com</strong> with the subject line &quot;Refund Request.&quot;</li>
                                <li>Include the email address associated with your Evero Budget account.</li>
                                <li>Briefly describe your reason for the refund (optional but helpful).</li>
                                <li>Our team will review and process your request within <strong className="text-foreground">3-5 business days</strong>.</li>
                                <li>The refund will be credited to your original payment method via Stripe.</li>
                            </ol>
                        </CardContent>
                    </Card>
                </section>

            </main>

            <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center border-t border-border/50">
                <p className="text-xs text-muted-foreground">© 2026 Evero Budget. All rights reserved.</p>
            </footer>
        </div>
    )
}
