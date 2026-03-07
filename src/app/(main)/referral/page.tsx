'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
    Gift, Copy, Check, DollarSign, Users, TrendingUp,
    Sparkles, ArrowRight, ExternalLink, Trophy, Star
} from 'lucide-react'

interface ReferralData {
    id: string
    referredEmail: string
    status: string
    monthlyPayout: number
    createdAt: string
}

interface AffiliateData {
    id: string
    referralCode: string
    totalEarnings: number
    isActive: boolean
    createdAt: string
    referrals: ReferralData[]
    activeCount: number
    monthlyIncome: number
}

export default function AffiliatePage() {
    const [affiliate, setAffiliate] = useState<AffiliateData | null>(null)
    const [loading, setLoading] = useState(true)
    const [activating, setActivating] = useState(false)
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchAffiliate()
    }, [])

    const fetchAffiliate = async () => {
        try {
            const res = await fetch('/api/referral')
            const data = await res.json()
            setAffiliate(data.affiliate)
        } catch {
            toast({ title: 'Failed to load referral data', variant: 'destructive' })
        } finally {
            setLoading(false)
        }
    }

    const handleActivate = async () => {
        setActivating(true)
        try {
            const res = await fetch('/api/referral', { method: 'POST' })
            const data = await res.json()
            setAffiliate(data.affiliate)
            toast({ title: '🎉 Welcome to the Referral Program!', variant: 'success' as any })
        } catch {
            toast({ title: 'Failed to activate', variant: 'destructive' })
        } finally {
            setActivating(false)
        }
    }

    const referralLink = affiliate
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${affiliate.referralCode}`
        : ''

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        toast({ title: 'Link copied to clipboard!', variant: 'success' as any })
        setTimeout(() => setCopied(false), 2000)
    }

    const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    const bonusMilestone = 50
    const bonusAmount = 250
    const bonusProgress = affiliate ? Math.min(affiliate.activeCount / bonusMilestone, 1) : 0
    const bonusEarned = affiliate ? affiliate.activeCount >= bonusMilestone : false
    const referralsToBonus = affiliate ? Math.max(bonusMilestone - affiliate.activeCount, 0) : bonusMilestone

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        )
    }

    // Not yet an affiliate — show activation page
    if (!affiliate) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
                {/* Hero */}
                <div className="text-center space-y-6 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold">
                        <Sparkles className="w-4 h-4" /> Referral Program
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
                        Earn <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">$2.99/mo</span>
                        <br />for life
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Share your unique referral link. When someone subscribes to Premium through your link,
                        you earn <strong className="text-foreground">$2.99 every month</strong> for as long as they stay subscribed.
                    </p>
                </div>

                {/* How It Works */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        {
                            step: '01',
                            title: 'Join Program',
                            desc: 'Click the button below to activate your referral account and get your unique link.',
                            icon: Gift,
                            gradient: 'from-emerald-500 to-teal-600',
                        },
                        {
                            step: '02',
                            title: 'Share Your Link',
                            desc: 'Share your referral link with friends, on social media, or anywhere you like.',
                            icon: ExternalLink,
                            gradient: 'from-blue-500 to-indigo-600',
                        },
                        {
                            step: '03',
                            title: 'Earn Monthly',
                            desc: 'Earn $2.99/month per referral for life. Hit 50 referrals and get a $250 one-time bonus!',
                            icon: DollarSign,
                            gradient: 'from-amber-500 to-orange-600',
                        },
                    ].map((item, i) => (
                        <Card key={i} className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                            <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 blur-xl group-hover:opacity-20 transition`} />
                            <CardContent className="p-6 relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg mb-4`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Step {item.step}</p>
                                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bonus Milestone Card */}
                <Card className="relative overflow-hidden border-amber-500/20">
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl" />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shrink-0">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-1">🏆 $250 Milestone Bonus</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Refer <strong className="text-foreground">50 Premium users</strong> and receive a <strong className="text-foreground">$250 one-time bonus</strong> on top of your recurring monthly earnings. That&apos;s $250 + $149.50/month!
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA */}
                <div className="text-center">
                    <Button
                        onClick={handleActivate}
                        disabled={activating}
                        className="h-14 px-10 text-lg font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white shadow-xl shadow-emerald-500/25 rounded-2xl transition-all hover:scale-105"
                    >
                        {activating ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                            <Gift className="w-5 h-5 mr-2" />
                        )}
                        {activating ? 'Activating...' : 'Join Referral Program'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">Available for all users. No extra fees. Start earning instantly.</p>
                </div>
            </div>
        )
    }

    // Active affiliate — show dashboard
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold mb-3">
                        <Sparkles className="w-3 h-3" /> Active Partner
                    </div>
                    <h1 className="text-xl font-black tracking-tight">Referral Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track your referrals and earnings in real time.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                    {
                        title: 'Total Earnings',
                        value: fmt(affiliate.totalEarnings),
                        icon: DollarSign,
                        gradient: 'from-emerald-500 to-teal-600',
                        textGradient: 'from-emerald-400 to-teal-500',
                        glow: 'bg-emerald-500/10',
                    },
                    {
                        title: 'Active Referrals',
                        value: affiliate.activeCount.toString(),
                        icon: Users,
                        gradient: 'from-blue-500 to-indigo-600',
                        textGradient: 'from-blue-400 to-indigo-500',
                        glow: 'bg-blue-500/10',
                    },
                    {
                        title: 'Monthly Income',
                        value: fmt(affiliate.monthlyIncome),
                        icon: TrendingUp,
                        gradient: 'from-amber-500 to-orange-600',
                        textGradient: 'from-amber-400 to-orange-500',
                        glow: 'bg-amber-500/10',
                    },
                ].map((card, i) => (
                    <Card key={card.title} className="relative overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${card.glow} blur-2xl`} />
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>
                                    <card.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${card.textGradient}`}>
                                {card.value}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* $250 Milestone Bonus Progress */}
            <Card className={`relative overflow-hidden animate-slide-up ${bonusEarned ? 'border-amber-500/30' : ''}`} style={{ animationDelay: '250ms' }}>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl" />
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bonusEarned ? 'from-amber-500 to-orange-600' : 'from-slate-400 to-slate-500'} flex items-center justify-center text-white shadow-lg shrink-0`}>
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold">$250 Milestone Bonus</h3>
                                {bonusEarned && (
                                    <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                        🎉 Earned!
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {bonusEarned
                                    ? 'Congratulations! You\'ve earned a $250 one-time bonus for reaching 50 referrals!'
                                    : `Refer ${referralsToBonus} more Premium user${referralsToBonus === 1 ? '' : 's'} to unlock your $250 one-time bonus.`
                                }
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {affiliate.activeCount}/{bonusMilestone}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">referrals</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
                        <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${bonusEarned
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                }`}
                            style={{ width: `${bonusProgress * 100}%` }}
                        />
                    </div>

                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-medium">
                        <span>0 referrals</span>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500" />
                            <span className="text-amber-600 font-bold">50 referrals = $250 bonus</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Referral Link */}
            <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <CardContent className="p-6">
                    <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-emerald-500" /> Your Referral Link
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">Share this link. You earn $2.99/month for every Premium subscriber.</p>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-mono truncate text-muted-foreground">
                            {referralLink}
                        </div>
                        <Button
                            onClick={copyLink}
                            className="h-12 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shrink-0"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </Button>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                            💡 <strong>Tip:</strong> Share on social media, send to friends, or embed in your blog.
                            Every Premium signup through your link earns you <strong>$2.99/month for life</strong>.
                            Bring 50 users and get a <strong>$250 one-time bonus</strong>!
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Referrals Table */}
            <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                <CardContent className="p-6">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Referrals
                        <span className="text-xs font-normal text-muted-foreground ml-auto">{affiliate.referrals.length} total</span>
                    </h2>

                    {affiliate.referrals.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium">No referrals yet</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Share your link to start earning!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {affiliate.referrals.map(ref => (
                                <div key={ref.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-black text-blue-500">
                                            {ref.referredEmail[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{ref.referredEmail}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Joined {new Date(ref.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${ref.status === 'active'
                                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                        }`}>
                                        {ref.status}
                                    </span>
                                    <span className="text-sm font-bold text-emerald-500 shrink-0">
                                        +{fmt(ref.monthlyPayout)}/mo
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Friendly Reminder */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 animate-slide-up" style={{ animationDelay: '500ms' }}>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed text-center">
                    🎁 <strong>Reminder:</strong> The Referral Program is available for all Starter and Premium users.
                    Keep sharing your link to grow your earnings every month!
                </p>
            </div>
        </div>
    )
}
