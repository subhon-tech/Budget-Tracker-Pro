'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Plus, Trash2, Edit2, X, Check, Wallet, TrendingUp, AlertCircle, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { CATEGORY_COLORS } from '@/lib/categorize'

interface Budget {
    id: string
    category: string
    limit: number
}

interface Transaction {
    id: string
    amount: number
    category: string
    type: string
    date: string
}

interface UserSubscription {
    id: string
    platform: string
    price: number
    startDate: string
}

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
    const [monthlyGoal, setMonthlyGoal] = useState(2000)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    // Create budget form
    const [showCreate, setShowCreate] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [newLimit, setNewLimit] = useState('')

    // Edit goal
    const [editingGoal, setEditingGoal] = useState(false)
    const [goalInput, setGoalInput] = useState('')

    // Edit budget
    const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null)
    const [editLimit, setEditLimit] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [txRes, goalRes, subRes] = await Promise.all([
                fetch('/api/transactions'),
                fetch('/api/goals'),
                fetch('/api/subscriptions'),
            ])
            const txData = await txRes.json()
            const goalData = await goalRes.json()
            const subData = await subRes.json()
            setTransactions(txData)
            setMonthlyGoal(goalData.monthlyGoal)
            setSubscriptions(Array.isArray(subData) ? subData : [])

            const saved = localStorage.getItem('evero-budgets')
            if (saved) setBudgets(JSON.parse(saved))
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    const saveBudgets = (updated: Budget[]) => {
        setBudgets(updated)
        localStorage.setItem('evero-budgets', JSON.stringify(updated))
    }

    // Current month transactions
    const now = new Date()
    const monthName = now.toLocaleString('default', { month: 'long' })
    const monthlyTx = transactions.filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense'
    })

    const subscriptionTotal = subscriptions.reduce((s, sub) => s + sub.price, 0)
    const totalExpenses = monthlyTx.reduce((s, t) => s + t.amount, 0) + subscriptionTotal
    const totalIncome = transactions.filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'income'
    }).reduce((s, t) => s + t.amount, 0)

    const actualSavings = totalIncome - totalExpenses

    // Get spending per category
    const categorySpending: Record<string, number> = {}
    if (subscriptionTotal > 0) {
        categorySpending['Recurring'] = subscriptionTotal
    }
    monthlyTx.forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
    })

    const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    const handleCreateBudget = () => {
        if (!newCategory.trim() || !newLimit) return
        const budget: Budget = {
            id: Date.now().toString(),
            category: newCategory.trim(),
            limit: parseFloat(newLimit),
        }
        saveBudgets([...budgets, budget])
        setNewCategory('')
        setNewLimit('')
        setShowCreate(false)
        toast({ title: '✅ Budget created!', variant: 'success' as any })
    }

    const handleDeleteBudget = (id: string) => {
        saveBudgets(budgets.filter(b => b.id !== id))
        toast({ title: 'Budget removed', variant: 'success' as any })
    }

    const handleEditBudget = (id: string) => {
        if (!editLimit) return
        saveBudgets(budgets.map(b => b.id === id ? { ...b, limit: parseFloat(editLimit) } : b))
        setEditingBudgetId(null)
        setEditLimit('')
        toast({ title: 'Budget updated', variant: 'success' as any })
    }

    const handleSaveGoal = async () => {
        const val = parseFloat(goalInput)
        if (isNaN(val) || val <= 0) return
        const res = await fetch('/api/goals', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ monthlyGoal: val }),
        })
        if (res.ok) {
            setMonthlyGoal(val)
            setEditingGoal(false)
            toast({ title: '✅ Savings goal updated!', variant: 'success' as any })
        }
    }

    const allCategories = Array.from(new Set(transactions.map(t => t.category))).sort()
    const usedCategories = budgets.map(b => b.category)
    const availableCategories = allCategories.filter(c => !usedCategories.includes(c))

    // Summary stats
    const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0)
    const totalSpentOnBudgets = budgets.reduce((s, b) => s + (categorySpending[b.category] || 0), 0)
    const overBudgetCount = budgets.filter(b => (categorySpending[b.category] || 0) >= b.limit).length

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    Budgets
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Set spending limits for each category so you know when to stop spending.
                </p>
            </div>

            {/* Quick Overview - 3 summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Wallet className="w-4.5 h-4.5 text-emerald-500" />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Budgeted</p>
                        </div>
                        <p className="text-2xl font-bold">{fmt(totalBudgeted)}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            across {budgets.length} {budgets.length === 1 ? 'category' : 'categories'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <DollarSign className="w-4.5 h-4.5 text-blue-500" />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Spent So Far</p>
                        </div>
                        <p className="text-2xl font-bold">{fmt(totalSpentOnBudgets)}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            {totalBudgeted > 0 ? `${Math.round((totalSpentOnBudgets / totalBudgeted) * 100)}% of your budgets used` : 'No budgets set yet'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-9 h-9 rounded-xl ${overBudgetCount > 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10'} flex items-center justify-center`}>
                                {overBudgetCount > 0 ? (
                                    <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                                ) : (
                                    <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</p>
                        </div>
                        <p className={`text-2xl font-bold ${overBudgetCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {overBudgetCount > 0 ? `${overBudgetCount} Over` : 'On Track'}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            {overBudgetCount > 0 ? `${overBudgetCount} ${overBudgetCount === 1 ? 'category' : 'categories'} exceeded` : budgets.length > 0 ? 'All budgets within limits ✨' : 'Create a budget to start'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content: Two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Spending Limits */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Target className="w-5 h-5 text-amber-500" /> Spending Limits
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Set a max amount you want to spend per category each month.
                            </p>
                        </div>
                        <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            size="sm"
                            onClick={() => setShowCreate(true)}
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> Add Limit
                        </Button>
                    </div>

                    {/* Create Budget Inline Form */}
                    {showCreate && (
                        <Card className="animate-fade-in border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                            <CardContent className="p-5">
                                <p className="text-sm font-semibold mb-1">New Spending Limit</p>
                                <p className="text-xs text-muted-foreground mb-4">Pick a category and decide the most you want to spend on it this month.</p>
                                <div className="flex gap-3">
                                    <select
                                        value={newCategory}
                                        onChange={e => setNewCategory(e.target.value)}
                                        className="flex-1 h-11 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="">Choose a category...</option>
                                        {availableCategories.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                        {availableCategories.length === 0 && (
                                            <option disabled>Add transactions first to see categories here</option>
                                        )}
                                    </select>
                                    <div className="relative w-36">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                                        <Input
                                            type="number"
                                            value={newLimit}
                                            onChange={e => setNewLimit(e.target.value)}
                                            placeholder="e.g. 200"
                                            className="pl-7 h-11"
                                            min="1"
                                        />
                                    </div>
                                    <Button onClick={handleCreateBudget} className="bg-emerald-500 hover:bg-emerald-600 text-white h-11 px-5">
                                        Save
                                    </Button>
                                    <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                                        <X className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Budget List */}
                    {budgets.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Target className="w-8 h-8 text-emerald-500/40" />
                                </div>
                                <h3 className="font-semibold text-base mb-1.5">No spending limits set yet</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5">
                                    A budget helps you control your spending. For example, set a $300 limit on Food &amp; Drink so you don't overspend.
                                </p>
                                <Button
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                    onClick={() => setShowCreate(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Create Your First Budget
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {budgets.map(budget => {
                                const spent = categorySpending[budget.category] || 0
                                const pct = Math.min((spent / budget.limit) * 100, 100)
                                const isOver = spent >= budget.limit
                                const isNear = pct >= 75 && !isOver
                                const remaining = budget.limit - spent

                                return (
                                    <Card key={budget.id} className={`group transition-all ${isOver ? 'border-rose-500/30 bg-rose-500/[0.02]' : ''}`}>
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-3.5 h-3.5 rounded-full"
                                                        style={{ backgroundColor: CATEGORY_COLORS[budget.category] || '#94a3b8' }}
                                                    />
                                                    <span className="font-semibold">{budget.category}</span>
                                                    {isOver && (
                                                        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                                                            OVER LIMIT
                                                        </span>
                                                    )}
                                                    {isNear && (
                                                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                            ALMOST THERE
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {editingBudgetId === budget.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-xs text-muted-foreground mr-1">$</span>
                                                            <Input
                                                                type="number"
                                                                value={editLimit}
                                                                onChange={e => setEditLimit(e.target.value)}
                                                                className="h-7 w-20 text-xs"
                                                                autoFocus
                                                                onKeyDown={e => e.key === 'Enter' && handleEditBudget(budget.id)}
                                                            />
                                                            <button onClick={() => handleEditBudget(budget.id)} className="p-1 rounded hover:bg-emerald-500/10 text-emerald-500">
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => setEditingBudgetId(null)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => { setEditingBudgetId(budget.id); setEditLimit(budget.limit.toString()) }}
                                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-all"
                                                                title="Edit limit"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBudget(budget.id)}
                                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                                                title="Remove budget"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="h-3 w-full bg-muted rounded-full overflow-hidden mb-2">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>

                                            {/* Labels */}
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">
                                                    Spent <b className={isOver ? 'text-rose-500' : ''}>{fmt(spent)}</b> of {fmt(budget.limit)}
                                                </span>
                                                <span className={`font-semibold ${isOver ? 'text-rose-500' : isNear ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                    {isOver ? `${fmt(spent - budget.limit)} over` : `${fmt(remaining)} left`}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column - Monthly Savings Goal */}
                <div className="space-y-4">
                    <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-xl shadow-emerald-500/20">
                        <CardContent className="p-6 space-y-5">
                            <div>
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Monthly Savings Goal
                                </h2>
                                <p className="text-xs opacity-80 mt-1">
                                    How much do you want to save in {monthName}?
                                </p>
                            </div>

                            {editingGoal ? (
                                <div className="space-y-3">
                                    <p className="text-sm opacity-90">Enter your savings target:</p>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 font-semibold">$</span>
                                        <Input
                                            type="number"
                                            value={goalInput}
                                            onChange={e => setGoalInput(e.target.value)}
                                            className="pl-7 bg-white/90 text-emerald-900 border-white/50 font-bold"
                                            autoFocus
                                            onKeyDown={e => e.key === 'Enter' && handleSaveGoal()}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveGoal} variant="secondary" className="flex-1 bg-white text-emerald-600 hover:bg-emerald-50 border-none font-bold">
                                            Save
                                        </Button>
                                        <Button onClick={() => setEditingGoal(false)} variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-3xl font-black">{fmt(monthlyGoal)}</p>

                                    <div className="bg-white/10 rounded-xl p-4 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="opacity-75">Saved so far</span>
                                            <span className="font-bold">{fmt(Math.max(0, actualSavings))}</span>
                                        </div>
                                        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${actualSavings >= monthlyGoal ? 'bg-white' : 'bg-white/60'}`}
                                                style={{ width: `${Math.min((Math.max(0, actualSavings) / monthlyGoal) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-[11px] opacity-70">
                                            {actualSavings >= monthlyGoal
                                                ? '🎉 Goal reached! Great job!'
                                                : `${fmt(monthlyGoal - Math.max(0, actualSavings))} more to reach your goal`}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => { setGoalInput(monthlyGoal.toString()); setEditingGoal(true) }}
                                        variant="secondary"
                                        className="w-full bg-white text-emerald-600 hover:bg-emerald-50/90 border-none font-bold"
                                    >
                                        Change Goal
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* How it works explainer */}
                    <Card>
                        <CardContent className="p-5">
                            <h3 className="font-semibold text-sm mb-3">💡 How Budgets Work</h3>
                            <div className="space-y-3 text-xs text-muted-foreground">
                                <div className="flex gap-2.5">
                                    <span className="font-bold text-emerald-500 text-sm">1</span>
                                    <p><b className="text-foreground">Set a limit</b> — choose a category (like Food or Shopping) and set a max you want to spend.</p>
                                </div>
                                <div className="flex gap-2.5">
                                    <span className="font-bold text-emerald-500 text-sm">2</span>
                                    <p><b className="text-foreground">Track progress</b> — the bar fills up as you add transactions in that category.</p>
                                </div>
                                <div className="flex gap-2.5">
                                    <span className="font-bold text-emerald-500 text-sm">3</span>
                                    <p><b className="text-foreground">Stay in control</b> — you'll see a warning when you're close to your limit.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
