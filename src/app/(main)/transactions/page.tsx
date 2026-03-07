'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeftRight, Search, Trash2, Lock, Zap, Crown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY_COLORS } from '@/lib/categorize'

interface Transaction {
    id: string
    amount: number
    description: string
    category: string
    type: string
    date: string
    recurring: boolean
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [subscriptions, setSubscriptions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState('')
    const [userData, setUserData] = useState<any>(null)
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        Promise.all([
            fetch('/api/transactions').then(res => res.json()),
            fetch('/api/user').then(res => res.json()),
            fetch('/api/subscriptions').then(res => res.json()),
        ]).then(([txData, user, subData]) => {
            setTransactions(txData)
            setUserData(user)
            setSubscriptions(Array.isArray(subData) ? subData : [])
            setLoading(false)
        })
    }, [])

    const isPremium = userData?.subscription?.status === 'active'

    // Combine for full history
    const virtualSubs = subscriptions.map(sub => ({
        id: `sub-${sub.id}`,
        amount: sub.price,
        description: sub.platform,
        category: 'Recurring',
        type: 'expense',
        date: sub.startDate,
        isSubscription: true
    }))

    const allHistory = [...transactions, ...virtualSubs]

    // Monthly counts for free plan
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const monthlyTx = transactions.filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    const monthlyCount = monthlyTx.length

    const handleDelete = async (id: string) => {
        const res = await fetch('/api/transactions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        if (res.ok) {
            setTransactions(prev => prev.filter(t => t.id !== id))
            toast({ title: 'Transaction deleted', variant: 'success' as any })
        } else {
            toast({ title: 'Failed to delete', variant: 'destructive' })
        }
    }

    const filtered = allHistory.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
            (t.category || '').toLowerCase().includes(search.toLowerCase())
        const matchesType = !filterType || t.type === filterType
        return matchesSearch && matchesType
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Transactions</h1>
                    <p className="text-sm text-muted-foreground">View and manage all your financial activity</p>
                </div>
                <div className="flex items-center gap-2">

                    {!isPremium && (
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${monthlyCount >= 12 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-muted text-muted-foreground'}`}>
                                <Zap className="w-3 h-3" />
                                {monthlyCount}/12 this month
                            </div>
                            <Button size="sm" variant="outline" className="text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10" onClick={() => router.push('/pricing')}>
                                <Crown className="w-3 h-3 mr-1" /> Upgrade
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Free Plan Warning Banner */}
            {!isPremium && monthlyCount >= 10 && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-amber-600">
                                {monthlyCount >= 12 ? 'Monthly limit reached!' : `Only ${12 - monthlyCount} transactions left this month`}
                            </p>
                            <p className="text-xs text-muted-foreground">Upgrade to Premium for unlimited transactions</p>
                        </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90" onClick={() => router.push('/pricing')}>
                        Go Premium
                    </Button>
                </div>
            )}
            <Card>
                <CardContent className="p-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input value={search} onChange={e => setSearch(e.target.value)} className="pl-10" placeholder="Search transactions..." />
                        </div>
                        <div className="flex rounded-xl overflow-hidden border border-border shrink-0">
                            <button onClick={() => setFilterType('')}
                                className={`px-4 py-2 text-xs font-semibold transition-all ${!filterType ? 'bg-emerald-500 text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
                                All
                            </button>
                            <button onClick={() => setFilterType('income')}
                                className={`px-4 py-2 text-xs font-semibold transition-all ${filterType === 'income' ? 'bg-emerald-500 text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
                                Income
                            </button>
                            <button onClick={() => setFilterType('expense')}
                                className={`px-4 py-2 text-xs font-semibold transition-all ${filterType === 'expense' ? 'bg-rose-500 text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
                                Expenses
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-muted/30 text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</p>
                            <p className="text-lg font-bold">{filtered.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/5 text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Income</p>
                            <p className="text-lg font-bold text-emerald-500">
                                {fmt(filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-500/5 text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expenses</p>
                            <p className="text-lg font-bold text-rose-500">
                                {fmt(filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))}
                            </p>
                        </div>
                    </div>

                    {/* Transaction List */}
                    <div className="space-y-2">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-medium">No transactions found</p>
                            </div>
                        ) : (
                            filtered.map((t) => (
                                <div key={t.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#94a3b8' }} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate flex items-center gap-2">
                                            {t.description}
                                            {(t as any).isSubscription && (
                                                <span className="text-[8px] bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Rec</span>
                                            )}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-muted-foreground">{(t.category || '').replace(': ', ' • ')}</span>
                                            <span className="text-xs text-muted-foreground/50">•</span>
                                            <span className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            {(t as any).recurring && <><span className="text-xs text-muted-foreground/50">•</span><span className="text-xs">🔄</span></>}
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold shrink-0 ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                    </span>

                                    {!(t as any).isSubscription ? (
                                        <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <div className="w-8 shrink-0" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
