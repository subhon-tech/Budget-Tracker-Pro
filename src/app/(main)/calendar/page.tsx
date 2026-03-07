'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => {
                setTransactions(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthName = currentDate.toLocaleString('default', { month: 'long' })

    // Calendar grid calculation
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year

    // Group transactions by date string (YYYY-MM-DD)
    const txByDate: Record<string, Transaction[]> = {}
    transactions.forEach(t => {
        const d = new Date(t.date)
        if (d.getMonth() === month && d.getFullYear() === year) {
            const key = d.toISOString().split('T')[0]
            if (!txByDate[key]) txByDate[key] = []
            txByDate[key].push(t)
        }
    })

    const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
    const goToday = () => setCurrentDate(new Date())

    // Selected date transactions
    const selectedTx = selectedDate ? (txByDate[selectedDate] || []) : []
    const selectedDateObj = selectedDate ? new Date(selectedDate + 'T12:00:00') : null

    // Monthly summary
    const monthlyIncome = Object.values(txByDate).flat().filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const monthlyExpenses = Object.values(txByDate).flat().filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    // Build calendar grid cells
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    Calendar
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                    See your transactions on a monthly calendar view.
                </p>
            </div>

            {/* Monthly Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Income</p>
                        <p className="text-lg font-bold text-emerald-500">+{fmt(monthlyIncome)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Expenses</p>
                        <p className="text-lg font-bold text-rose-500">-{fmt(monthlyExpenses)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Net</p>
                        <p className={`text-lg font-bold ${monthlyIncome - monthlyExpenses >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {monthlyIncome - monthlyExpenses >= 0 ? '+' : ''}{fmt(monthlyIncome - monthlyExpenses)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <Card className="lg:col-span-2 overflow-hidden">
                    <CardContent className="p-4">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="text-center">
                                <h2 className="text-lg font-bold">{monthName} {year}</h2>
                                {!isCurrentMonth && (
                                    <button onClick={goToday} className="text-[9px] text-emerald-500 font-bold hover:underline mt-0">
                                        Go to today
                                    </button>
                                )}
                            </div>
                            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 mb-1">
                            {DAYS.map(d => (
                                <div key={d} className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-wider py-1.5">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {cells.map((day, i) => {
                                if (day === null) {
                                    return <div key={`empty-${i}`} className="aspect-square" />
                                }

                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                const dayTx = txByDate[dateStr] || []
                                const hasIncome = dayTx.some(t => t.type === 'income')
                                const hasExpense = dayTx.some(t => t.type === 'expense')
                                const isToday = isCurrentMonth && today.getDate() === day
                                const isSelected = selectedDate === dateStr

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                                        className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all text-sm relative
                                            ${isToday ? 'bg-emerald-500/10 border border-emerald-500/30 font-bold text-emerald-600' : ''}
                                            ${isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105' : ''}
                                            ${!isToday && !isSelected ? 'hover:bg-muted/70' : ''}
                                        `}
                                    >
                                        <span className={`text-[11px] font-medium ${isSelected ? 'text-white font-bold' : ''}`}>{day}</span>
                                        {dayTx.length > 0 && (
                                            <div className="flex gap-0.5">
                                                {hasIncome && (
                                                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                                                )}
                                                {hasExpense && (
                                                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-rose-500'}`} />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/50">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[9px] text-muted-foreground">Income</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span className="text-[9px] text-muted-foreground">Expense</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-md bg-emerald-500/10 border border-emerald-500/30" />
                                <span className="text-[9px] text-muted-foreground">Today</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Panel: Day Detail */}
                <div>
                    <Card className={`sticky top-8 transition-all ${selectedDate ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : ''}`}>
                        <CardContent className="p-6">
                            {selectedDate && selectedDateObj ? (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-base">
                                                {selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedTx.length} transaction{selectedTx.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <button onClick={() => setSelectedDate(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    {selectedTx.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p className="text-sm">No transactions this day</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5">
                                            {selectedTx.map(t => (
                                                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                                                    <div className="w-2.5 h-2.5 rounded-full shrink-0"
                                                        style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#94a3b8' }} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold truncate">{t.description}</p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {t.category.replace(': ', ' • ')}
                                                            {t.recurring && ' • 🔄'}
                                                        </p>
                                                    </div>
                                                    <span className={`text-sm font-bold shrink-0 ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                                    </span>
                                                </div>
                                            ))}

                                            {/* Day totals */}
                                            <div className="pt-3 mt-3 border-t border-border/50 space-y-1">
                                                {selectedTx.some(t => t.type === 'income') && (
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Day's income</span>
                                                        <span className="font-bold text-emerald-500">
                                                            +{fmt(selectedTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))}
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedTx.some(t => t.type === 'expense') && (
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Day's expenses</span>
                                                        <span className="font-bold text-rose-500">
                                                            -{fmt(selectedTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                        <ChevronLeft className="w-6 h-6 text-emerald-500/40" />
                                    </div>
                                    <p className="text-sm font-medium mb-1">Select a day</p>
                                    <p className="text-xs">Click on any date to see its transactions.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
