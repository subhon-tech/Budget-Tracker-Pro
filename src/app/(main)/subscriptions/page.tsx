'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, X, AlertCircle } from 'lucide-react'

interface UserSub {
    id: string
    platform: string
    price: number
    startDate: string
    createdAt: string
}

// Platform definitions with high-quality custom icons and brand colors
const PLATFORMS = [
    { name: 'Netflix', color: '#E50914' },
    { name: 'YouTube Premium', color: '#FF0000' },
    { name: 'Spotify', color: '#1DB954' },
    { name: 'Disney+', color: '#113CCF' },
    { name: 'Apple One', color: '#000000' },
    { name: 'Amazon Prime', color: '#00A8E1' },
    { name: 'ChatGPT Plus', color: '#10A37F' },
    { name: 'Adobe CC', color: '#FF0000' },
    { name: 'Microsoft 365', color: '#D83B01' },
    { name: 'Google One', color: '#4285F4' },
    { name: 'Dropbox', color: '#0061FF' },
    { name: 'Dribbble', color: '#EA4C89' },
]

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<UserSub[]>([])
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState<string | null>(null)
    const [addPrice, setAddPrice] = useState('')
    const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0])

    // Custom manual entry state
    const [customName, setCustomName] = useState('')
    const [customPrice, setCustomPrice] = useState('')
    const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0])
    const [isAddingCustom, setIsAddingCustom] = useState(false)

    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetch('/api/subscriptions')
            .then(res => res.json())
            .then(data => {
                setSubscriptions(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const activePlatforms = new Set(subscriptions.map(s => s.platform))
    const totalMonthly = subscriptions.reduce((sum, s) => sum + s.price, 0)
    const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

    const handleAdd = async (platform: string, price: string, date: string, clearFn?: () => void) => {
        if (!price || !platform) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, price: price, startDate: date }),
            })
            if (res.ok) {
                const sub = await res.json()
                setSubscriptions(prev => [sub, ...prev])
                setAdding(null)
                setAddPrice('')
                if (clearFn) clearFn()
                toast({ title: `${platform} added`, variant: 'success' as any })
            } else {
                const errorData = await res.json().catch(() => ({}))
                toast({
                    title: 'Failed to add',
                    description: errorData.details || errorData.error || 'Server error',
                    variant: 'destructive'
                })
            }
        } catch (err) {
            console.error('Subscription error:', err)
            toast({ title: 'Network error', description: 'Could not reach server', variant: 'destructive' })
        }
        setSubmitting(false)
    }

    const handleRemove = async (id: string, name: string) => {
        try {
            const res = await fetch('/api/subscriptions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            if (res.ok) {
                setSubscriptions(prev => prev.filter(s => s.id !== id))
                toast({ title: `${name} removed`, variant: 'success' as any })
            }
        } catch {
            toast({ title: 'Failed to remove', variant: 'destructive' })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Recurring Costs</h1>
                <p className="text-sm text-muted-foreground">Manage your fixed monthly services and subscriptions</p>
            </div>

            {/* Main Action Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

                {/* Active Subs List */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Active Recurring <span className="bg-emerald-500/10 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">{subscriptions.length}</span>
                        </h2>
                    </div>

                    {subscriptions.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted bg-muted/20 p-8 text-center animate-fade-in">
                            <AlertCircle className="w-8 h-8 text-muted-foreground/30 mb-3" />
                            <p className="text-sm font-medium text-muted-foreground">No active recurring items yet.</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Add your favorite platforms from the library below.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {subscriptions.map(sub => {
                                const platform = PLATFORMS.find(p => p.name === sub.platform)
                                return (
                                    <div key={sub.id} className="group relative bg-card h-24 rounded-2xl border border-border/50 p-4 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all hover:-translate-y-1">
                                        <div className="flex items-center gap-4 h-full">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                                                style={{ backgroundColor: `${platform?.color || '#8b5cf6'}15`, color: platform?.color || '#8b5cf6' }}
                                            >
                                                <span className="text-xl font-black">{sub.platform[0]}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black truncate leading-none mb-1">{sub.platform}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{fmt(sub.price)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(sub.id, sub.platform)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all transform scale-75 group-hover:scale-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Service Explorer & Manual Entry */}
                <div className="xl:col-span-2 space-y-4">

                    {/* Standalone Stats Card */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
                        <div className="relative bg-card border border-emerald-500/20 backdrop-blur-md rounded-[2rem] p-6 flex items-center justify-around overflow-hidden shadow-xl shadow-emerald-500/5">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Monthly Spend</p>
                                <p className="text-3xl font-black text-emerald-500 tabular-nums leading-none">{fmt(totalMonthly)}</p>
                            </div>
                            <div className="h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-4"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Active</p>
                                <p className="text-3xl font-black text-foreground tabular-nums leading-none">{subscriptions.length}</p>
                            </div>

                            {/* Subtle decorative elements */}
                            <div className="absolute left-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>

                    <Card className="rounded-[2.5rem] border-muted/50 shadow-xl bg-gradient-to-b from-card to-background overflow-hidden transition-all duration-500">
                        <CardContent className="p-6 space-y-6">

                            {/* Manual Entry Section */}
                            <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600">Manual Entry</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsAddingCustom(!isAddingCustom)}
                                        className="h-6 w-6 rounded-full p-0"
                                    >
                                        <Plus className={`w-4 h-4 transition-transform duration-300 ${isAddingCustom ? 'rotate-45' : ''}`} />
                                    </Button>
                                </div>

                                {isAddingCustom && (
                                    <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-300">
                                        <Input
                                            placeholder="Service Name"
                                            value={customName}
                                            onChange={e => setCustomName(e.target.value)}
                                            className="h-9 text-xs bg-background"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="number" step="0.01" placeholder="Price"
                                                value={customPrice}
                                                onChange={e => setCustomPrice(e.target.value)}
                                                className="h-9 text-xs bg-background"
                                            />
                                            <Input
                                                type="date"
                                                value={customDate}
                                                onChange={e => setCustomDate(e.target.value)}
                                                className="h-9 text-xs bg-background"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => handleAdd(customName, customPrice, customDate, () => {
                                                setCustomName(''); setCustomPrice(''); setIsAddingCustom(false);
                                            })}
                                            disabled={submitting || !customName || !customPrice}
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-9 text-xs"
                                        >
                                            Confirm Custom
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Service Library List */}
                            <div className="space-y-4">
                                <h2 className="text-sm font-bold">Library</h2>

                                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                                    {PLATFORMS.map(platform => {
                                        const isActive = activePlatforms.has(platform.name)
                                        const isAdding = adding === platform.name

                                        return (
                                            <div
                                                key={platform.name}
                                                className={`rounded-xl border transition-all duration-300 ${isActive
                                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                                    : 'bg-background hover:border-emerald-500/30 border-transparent hover:bg-muted/30'
                                                    }`}
                                            >
                                                <div className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                                                            style={{ backgroundColor: `${platform.color}15`, color: platform.color }}
                                                        >
                                                            <span className="text-sm font-black">{platform.name[0]}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold truncate">{platform.name}</p>
                                                            {isActive && <span className="text-[7px] font-black uppercase text-emerald-500 tracking-tighter">Active</span>}
                                                        </div>

                                                        {!isActive && !isAdding && (
                                                            <button
                                                                onClick={() => setAdding(platform.name)}
                                                                className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all font-bold"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}

                                                        {isAdding && (
                                                            <button onClick={() => setAdding(null)} className="p-1 hover:bg-muted rounded">
                                                                <X className="w-3 h-3 text-muted-foreground" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {isAdding && (
                                                        <div className="mt-3 pt-3 border-t border-dashed border-border flex flex-col gap-2 animate-in slide-in-from-top-1 duration-300">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Input
                                                                    type="number" step="0.01" placeholder="Price"
                                                                    value={addPrice} onChange={e => setAddPrice(e.target.value)}
                                                                    className="h-8 text-xs bg-background"
                                                                />
                                                                <Input
                                                                    type="date" value={addDate} onChange={e => setAddDate(e.target.value)}
                                                                    className="h-8 text-xs bg-background"
                                                                />
                                                            </div>
                                                            <Button
                                                                onClick={() => handleAdd(platform.name, addPrice, addDate)}
                                                                disabled={submitting || !addPrice}
                                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-8 text-xs"
                                                            >
                                                                Confirm
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(var(--muted-foreground), 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(var(--muted-foreground), 0.2);
                }
            `}</style>
        </div>
    )
}
