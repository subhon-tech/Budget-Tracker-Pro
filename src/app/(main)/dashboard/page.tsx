'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import {
    Plus, Search, Trash2, TrendingUp, TrendingDown, DollarSign, Target, Zap,
    ChevronDown, ChevronLeft, Lock, History as HistoryIcon,
    PieChart as PieChartIcon, Settings
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts'
import { cn } from '@/lib/utils'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_COLORS, BILLS_SUBCATEGORIES } from '@/lib/categorize'
import { useTheme } from '@/components/theme-provider'

interface Transaction {
    id: string
    amount: number
    description: string
    category: string
    type: string
    date: string
    recurring: boolean
}

interface UserSubscription {
    id: string
    platform: string
    price: number
    startDate: string
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { toast } = useToast()
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
    const [monthlyGoal, setMonthlyGoal] = useState(2000)
    const [loading, setLoading] = useState(true)

    // Form state
    const [showForm, setShowForm] = useState(false)
    const [formType, setFormType] = useState<'income' | 'expense'>('expense')
    const [formAmount, setFormAmount] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [formCategory, setFormCategory] = useState('')
    const [formSubCategory, setFormSubCategory] = useState('')
    const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
    const [formRecurring, setFormRecurring] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [isSubView, setIsSubView] = useState(false)

    // Search & filter
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('')

    // Goal editing
    const [editingGoal, setEditingGoal] = useState(false)
    const [goalInput, setGoalInput] = useState('')

    const [userData, setUserData] = useState<any>(null)

    const fetchData = useCallback(async () => {
        try {
            const [txRes, goalRes, userRes, subRes] = await Promise.all([
                fetch('/api/transactions'),
                fetch('/api/goals'),
                fetch('/api/user'),
                fetch('/api/subscriptions')
            ])
            if (txRes.ok) {
                const txData = await txRes.json()
                setTransactions(txData)
            }
            if (goalRes.ok) {
                const goalData = await goalRes.json()
                setMonthlyGoal(goalData.monthlyGoal)
            }
            if (userRes.ok) {
                const userVal = await userRes.json()
                setUserData(userVal)
            }
            if (subRes.ok) {
                const subData = await subRes.json()
                setSubscriptions(Array.isArray(subData) ? subData : [])
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }
        if (status === 'authenticated') {
            fetchData()
        }
    }, [status, router, fetchData])

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyTx = transactions.filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const monthlyCount = monthlyTx.length
    const monthlyIncome = monthlyTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const subscriptionTotal = subscriptions.reduce((s, sub) => s + sub.price, 0)
    const monthlyExpenses = monthlyTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) + subscriptionTotal
    const totalBalance = transactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0) - subscriptionTotal

    const categoryData = Object.entries(
        monthlyTx.filter(t => t.type === 'expense').reduce((acc: Record<string, number>, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
        }, subscriptionTotal > 0 ? { 'Recurring': subscriptionTotal } : {})
    ).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 })).sort((a, b) => b.value - a.value)

    const trendData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        const m = d.getMonth()
        const y = d.getFullYear()
        const txs = transactions.filter(t => { const td = new Date(t.date); return td.getMonth() === m && td.getFullYear() === y })
        return {
            Income: Math.round(txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) * 100) / 100,
            Expenses: Math.round(txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) * 100) / 100,
        }
    })

    const last3Months = trendData.slice(-3)
    const burnRate = Math.round((last3Months.reduce((s, m) => s + m.Expenses, 0) / 3) * 100) / 100

    const allHistory = [...transactions, ...subscriptions.map(sub => ({
        id: `sub-${sub.id}`,
        amount: sub.price,
        description: sub.platform,
        category: 'Recurring',
        type: 'expense',
        date: sub.startDate,
        isSubscription: true
    }))]

    const goalPct = monthlyGoal > 0 ? Math.min((monthlyExpenses / monthlyGoal) * 100, 100) : 0
    const goalRemaining = monthlyGoal - monthlyExpenses
    const isPremium = userData?.subscription?.status === 'active'

    const filtered = allHistory
        .filter(t => {
            const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || (t.category || '').toLowerCase().includes(search.toLowerCase())
            const matchCat = !filterCategory || t.category === filterCategory
            return matchSearch && matchCat
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formAmount || !formDescription || !formDate) return

        if (!isPremium) {
            if (monthlyCount >= 12) {
                toast({ title: 'Monthly limit reached', description: 'Upgrade to Premium for unlimited transactions!', variant: 'destructive' })
                router.push('/pricing'); return
            }
            const currentCategories = Array.from(new Set(transactions.map(t => t.category)))
            if (!currentCategories.includes(formCategory) && currentCategories.length >= 2 && formCategory) {
                toast({ title: 'Category limit reached', description: 'Free users are limited to 2 categories.', variant: 'destructive' })
                router.push('/pricing'); return
            }
        }

        setSubmitting(true)
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: formAmount,
                    description: formDescription,
                    category: (formCategory === 'Bills & Utilities' && formSubCategory) ? `Bills & Utilities: ${formSubCategory}` : formCategory || undefined,
                    type: formType,
                    date: formDate,
                    recurring: formRecurring,
                }),
            })
            if (res.ok) {
                const tx = await res.json()
                setTransactions(prev => [tx, ...prev])
                setFormAmount(''); setFormDescription(''); setFormCategory(''); setFormSubCategory(''); setFormRecurring(false)
                setIsSubView(false); setShowForm(false)
                toast({ title: 'Transaction added', variant: 'success' as any })
            }
        } catch { toast({ title: 'Failed to add transaction', variant: 'destructive' }) }
        finally { setSubmitting(false) }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTransactions(prev => prev.filter(t => t.id !== id))
                toast({ title: 'Transaction deleted', variant: 'success' as any })
            }
        } catch { toast({ title: 'Failed to delete', variant: 'destructive' }) }
    }

    const handleSaveGoal = async () => {
        const val = parseFloat(goalInput)
        if (val > 0) {
            await fetch('/api/goals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monthlyGoal: val }),
            })
            setMonthlyGoal(val); setEditingGoal(false)
            toast({ title: 'Monthly goal updated', variant: 'success' as any })
        }
    }

    const fmt = (val: number) => `$${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Welcome back, {session?.user?.name || 'User'}</p>
                </div>
                <ThemeToggle />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                    { title: 'Total Balance', value: totalBalance, icon: DollarSign, gradient: 'from-blue-500 to-indigo-600', textGradient: 'from-blue-400 to-indigo-500', glow: 'bg-blue-500/10' },
                    { title: 'Monthly Income', value: monthlyIncome, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600', textGradient: 'from-emerald-400 to-teal-500', glow: 'bg-emerald-500/10' },
                    { title: 'Monthly Expenses', value: monthlyExpenses, icon: TrendingDown, gradient: 'from-rose-500 to-pink-600', textGradient: 'from-rose-400 to-pink-500', glow: 'bg-rose-500/10' },
                    { title: 'Burn Rate', value: burnRate, icon: Zap, gradient: 'from-amber-500 to-orange-600', textGradient: 'from-amber-400 to-orange-500', glow: 'bg-amber-500/10', isLocked: !isPremium },
                ].map((card, i) => (
                    <Card key={card.title} className={cn("relative overflow-hidden animate-slide-up", card.isLocked && "opacity-80")} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl", card.glow)} />
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg", card.gradient)}>
                                    <card.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className={cn("text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r", card.textGradient)}>
                                    {card.isLocked ? 'Premium' : fmt(card.value)}
                                </p>
                                {card.isLocked && <Lock className="w-4 h-4 text-amber-500" />}
                            </div>
                            {card.title === 'Burn Rate' && !card.isLocked && (
                                <p className="text-[10px] text-muted-foreground mt-1">Avg of last 3 months</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3">
                    <Card className="animate-slide-up h-full">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-emerald-500" /> Add Transaction
                            </h2>
                            <form onSubmit={handleAddTransaction} className="space-y-4">
                                <div className="flex rounded-xl overflow-hidden border border-border">
                                    <button type="button" onClick={() => setFormType('expense')}
                                        className={cn("flex-1 py-2 text-xs font-semibold transition-all", formType === 'expense' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'bg-muted/50 text-muted-foreground')}>
                                        Expense
                                    </button>
                                    <button type="button" onClick={() => setFormType('income')}
                                        className={cn("flex-1 py-2 text-xs font-semibold transition-all", formType === 'income' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-muted/50 text-muted-foreground')}>
                                        Income
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">$</span>
                                        <Input type="number" step="0.01" min="0.01" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0.00" className="pl-7 h-10 text-sm" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Description</label>
                                    <Input value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="e.g. Starbucks" className="h-10 text-sm" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider flex justify-between">
                                        Category {!isPremium && <span className="text-[9px] font-bold text-amber-600 border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 rounded">PREMIUM</span>}
                                    </label>
                                    <div className="relative min-h-[40px] rounded-xl border border-input bg-background/50 overflow-hidden">
                                        {!isSubView ? (
                                            <select
                                                value={formCategory}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (val === 'Bills & Utilities') { setFormCategory(val); setIsSubView(true) }
                                                    else { setFormCategory(val); setFormSubCategory('') }
                                                }}
                                                className="w-full h-10 px-3 py-2 text-sm bg-transparent border-none focus:ring-0 appearance-none cursor-pointer"
                                            >
                                                <option value="">Auto-detect</option>
                                                {(formType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => {
                                                    const currentCats = Array.from(new Set(transactions.map(t => t.category)))
                                                    const isLocked = !isPremium && (c === 'Bills & Utilities' || (!currentCats.includes(c) && currentCats.length >= 2))
                                                    return <option key={c} value={c} disabled={isLocked}>{c} {isLocked ? '🔒' : ''}</option>
                                                })}
                                            </select>
                                        ) : (
                                            <div className="flex items-center animate-in slide-in-from-right duration-300">
                                                <button type="button" onClick={() => { setIsSubView(false); setFormSubCategory('') }} className="p-3 border-r border-input hover:bg-muted transition-colors">
                                                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <select value={formSubCategory} onChange={e => setFormSubCategory(e.target.value)} className="w-full h-10 px-3 py-2 text-sm bg-transparent border-none focus:ring-0 appearance-none cursor-pointer font-medium">
                                                    <option value="">Select Bill Type...</option>
                                                    {BILLS_SUBCATEGORIES.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        {!isSubView && <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown className="w-4 h-4 text-muted-foreground" /></div>}
                                    </div>
                                    {!isSubView && formSubCategory && formCategory === 'Bills & Utilities' && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                            <span className="text-[10px] font-bold text-emerald-600">Current: {formSubCategory}</span>
                                            <button type="button" onClick={() => { setFormSubCategory(''); setIsSubView(true) }} className="p-0.5 hover:bg-emerald-500/20 rounded"><Settings className="w-2.5 h-2.5 text-emerald-600" /></button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Date</label>
                                    <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="h-10 text-sm" required />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer py-1">
                                    <input type="checkbox" checked={formRecurring} onChange={e => setFormRecurring(e.target.checked)} className="w-4 h-4 rounded border-border text-emerald-500 accent-emerald-500" />
                                    <span className="text-sm text-muted-foreground">🔄 Recurring</span>
                                </label>
                                <Button type="submit" className="w-full h-10 font-bold" disabled={submitting}>{submitting ? '...' : `Add entry`}</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-5">
                    <Card className="animate-slide-up h-full">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                                <HistoryIcon className="w-5 h-5 text-blue-500" /> History
                                <span className="text-xs font-normal text-muted-foreground ml-auto">{filtered.length} entries</span>
                            </h2>
                            <div className="relative mb-5">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 h-10 text-sm" />
                            </div>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                                {filtered.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground opacity-50"><p className="text-xs">Nothing found</p></div>
                                ) : (
                                    filtered.map(t => (
                                        <div key={t.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group relative">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#94a3b8' }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate leading-tight flex items-center gap-2">
                                                    {t.description}
                                                    {(t as any).isSubscription && <span className="text-[8px] bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Rec</span>}
                                                </p>
                                                <span className="text-xs text-muted-foreground">{t.category.replace(': ', ' • ')} • {fmtDate(t.date)}</span>
                                            </div>
                                            <span className={cn("text-sm font-bold shrink-0", t.type === 'income' ? 'text-emerald-500' : 'text-rose-500')}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </span>
                                            {!(t as any).isSubscription ? (
                                                <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"><Trash2 className="w-4 h-4" /></button>
                                            ) : <div className="w-8 shrink-0" />}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="animate-slide-up">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-orange-500" /> Monthly Goal</h2>
                                <button className="text-xs text-emerald-600 font-bold hover:underline" onClick={() => { setGoalInput(monthlyGoal.toString()); setEditingGoal(!editingGoal) }}>{editingGoal ? 'Cancel' : 'Set'}</button>
                            </div>
                            {editingGoal ? (
                                <div className="flex gap-2 animate-fade-in">
                                    <Input value={goalInput} onChange={e => setGoalInput(e.target.value)} className="h-9 text-sm" type="number" autoFocus />
                                    <Button onClick={handleSaveGoal} size="sm" className="h-9">Save</Button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-baseline justify-between mb-2">
                                        <span className="text-xl font-bold">{fmt(monthlyExpenses)} <span className="text-xs text-muted-foreground font-normal">/ {fmt(monthlyGoal)}</span></span>
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest", goalPct >= 100 ? 'text-rose-500' : 'text-emerald-500')}>{goalPct >= 100 ? 'Limit Reached' : 'On Track'}</span>
                                    </div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div className={cn("h-full transition-all duration-1000", goalPct >= 100 ? 'bg-rose-500' : 'bg-emerald-500')} style={{ width: `${Math.min(goalPct, 100)}%` }} />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">{goalRemaining >= 0 ? `${fmt(goalRemaining)} remaining until limit` : `Over budget by ${fmt(Math.abs(goalRemaining))}`}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="animate-slide-up">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-purple-500" /> Spending</h2>
                            {categoryData.length === 0 ? <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">No data for this month</div> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <RePieChart>
                                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value">
                                            {categoryData.map(e => <Cell key={e.name} fill={CATEGORY_COLORS[e.name] || '#94a3b8'} stroke="transparent" />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: 'none', borderRadius: '8px', fontSize: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    </RePieChart>
                                </ResponsiveContainer>
                            )}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {categoryData.slice(0, 4).map(e => (
                                    <div key={e.name} className="flex items-center gap-1.5 overflow-hidden">
                                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[e.name] || '#94a3b8' }} />
                                        <span className="text-[10px] text-muted-foreground truncate">{e.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
