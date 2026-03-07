'use client'

import { DollarSign, Shield, Eye, Users, Heart, Zap, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end">
                    <Button size="sm" onClick={() => router.back()} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

                {/* Hero - Mission */}
                <section className="text-center space-y-6 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium">
                        <Zap className="w-4 h-4" /> Our Mission
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Simplifying financial transparency<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
                            for the modern professional
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We believe everyone deserves a clear, honest picture of their finances — without complexity,
                        hidden fees, or compromised privacy. Evero Budget was built to be the financial tool
                        we ourselves wanted but couldn&apos;t find.
                    </p>
                </section>

                {/* The Story */}
                <section className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Heart className="w-4 h-4 text-blue-500" />
                        </div>
                        Our Story
                    </h3>
                    <Card>
                        <CardContent className="p-8 space-y-5">
                            <p className="text-muted-foreground leading-relaxed">
                                <span className="font-semibold text-foreground">Founded in 2026</span>, Evero Budget
                                was born out of a frustration shared by millions: fragmented financial data spread across
                                bank apps, spreadsheets, and sticky notes — combined with the growing epidemic of
                                <span className="font-semibold text-foreground"> &ldquo;subscription fatigue.&rdquo;</span>
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Our founding team — a mix of software engineers and personal finance enthusiasts — realized
                                that existing budget tools were either too complex for everyday use, too invasive with data
                                collection, or too expensive for the value they provided. We set out to build something different:
                                a streamlined, secure, and beautifully designed app that puts <em>you</em> in control.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Today, Evero Budget helps professionals track income, manage expenses, set monthly
                                goals, and understand spending patterns — all without ever asking for your bank login
                                credentials or selling a single byte of your data.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Values */}
                <section className="space-y-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-purple-500" />
                        </div>
                        Our Values
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: 'Security-First Architecture',
                                description: 'Every feature is designed with security as the foundation — not an afterthought. From AES-256 encryption to mandatory Multi-Factor Authentication, your financial data is protected by enterprise-grade security.',
                                gradient: 'from-blue-500 to-indigo-600',
                                glow: 'bg-blue-500/10',
                            },
                            {
                                icon: Eye,
                                title: 'Absolute Data Privacy',
                                description: 'We have a zero-tolerance policy on data exploitation. We never sell, share, or monetize your personal or financial data with third-party advertisers. Your data belongs to you — period.',
                                gradient: 'from-emerald-500 to-teal-600',
                                glow: 'bg-emerald-500/10',
                            },
                            {
                                icon: Users,
                                title: 'User-Centric Design',
                                description: 'Every button, chart, and interaction is crafted with real users in mind. We obsess over simplicity so you can focus on what matters — understanding and improving your financial health.',
                                gradient: 'from-purple-500 to-pink-600',
                                glow: 'bg-purple-500/10',
                            },
                        ].map((value) => (
                            <Card key={value.title} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${value.glow} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                                <CardContent className="p-6 relative z-10 space-y-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white shadow-lg`}>
                                        <value.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold">{value.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="space-y-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-amber-500" />
                        </div>
                        The Team
                    </h3>
                    <Card>
                        <CardContent className="p-8">
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                We&apos;re a small, agile team of developers and finance experts united by a single belief:
                                that financial tools should be honest, accessible, and beautifully simple.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { name: 'Subhon A.', role: 'Founder & CEO', initials: 'SA', gradient: 'from-emerald-500 to-teal-600' },
                                    { name: 'Engineering Lead', role: 'Backend & Security', initials: 'EL', gradient: 'from-blue-500 to-indigo-600' },
                                    { name: 'UX Designer', role: 'Product Design', initials: 'UX', gradient: 'from-purple-500 to-pink-600' },
                                    { name: 'Finance Advisor', role: 'Financial Strategy', initials: 'FA', gradient: 'from-amber-500 to-orange-600' },
                                ].map((member) => (
                                    <div key={member.name} className="text-center space-y-3">
                                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg mx-auto`}>
                                            {member.initials}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* CTA */}
                <section className="text-center py-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                        <CardContent className="p-10 space-y-4">
                            <h3 className="text-2xl font-bold">Ready to take control of your finances?</h3>
                            <p className="text-muted-foreground">Join thousands of professionals who trust Evero Budget.</p>
                            <div className="flex items-center justify-center gap-3 pt-2">
                                <Button onClick={() => router.push('/pricing#starter')} className="px-8 transition-all hover:scale-105 shadow-xl shadow-emerald-500/20">
                                    Get Started Free
                                </Button>
                                <Button variant="outline" onClick={() => router.push('/pricing')}>
                                    View Pricing
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

            </main>

            <footer className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center border-t border-border/50">
                <p className="text-xs text-muted-foreground">© 2026 Evero Budget. All rights reserved.</p>
            </footer>
        </div>
    )
}
