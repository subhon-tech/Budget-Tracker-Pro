'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Upload, Download, FileText, Lock, CheckCircle2, AlertCircle, ArrowUpDown } from 'lucide-react'

interface Transaction {
    id: string
    amount: number
    description: string
    category: string
    type: string
    date: string
    recurring: boolean
}

export default function ImportExportPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [importing, setImporting] = useState(false)
    const [importResult, setImportResult] = useState<{ count: number; success: boolean } | null>(null)
    const [userData, setUserData] = useState<any>(null)
    const csvInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        Promise.all([
            fetch('/api/transactions').then(res => res.json()),
            fetch('/api/user').then(res => res.json()),
        ]).then(([txData, user]) => {
            setTransactions(txData)
            setUserData(user)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const isPremium = userData?.subscription?.status === 'active'

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImporting(true)
        setImportResult(null)
        try {
            const text = await file.text()
            const lines = text.split('\n').filter(l => l.trim())
            if (lines.length < 2) {
                toast({ title: 'CSV file is empty or invalid', variant: 'destructive' })
                setImporting(false)
                return
            }
            const rows = lines.slice(1)
            let imported = 0
            for (const row of rows) {
                const cols = row.split(',')
                if (cols.length < 3) continue
                const date = cols[0]?.trim()
                const description = cols[1]?.trim().replace(/^"|"$/g, '')
                const amount = parseFloat(cols[2]?.trim())
                const category = cols[3]?.trim() || 'Other'
                const type = cols[4]?.trim()?.toLowerCase() === 'income' ? 'income' : 'expense'
                if (!date || !description || isNaN(amount)) continue
                const parsedDate = new Date(date)
                if (isNaN(parsedDate.getTime())) continue
                await fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: Math.abs(amount),
                        description,
                        category,
                        type: amount < 0 ? 'expense' : type,
                        date: parsedDate.toISOString(),
                        recurring: false,
                    }),
                })
                imported++
            }
            setImportResult({ count: imported, success: true })
            toast({ title: `${imported} transactions imported!`, variant: 'success' as any })
            // Refresh transactions
            const updated = await fetch('/api/transactions').then(r => r.json())
            setTransactions(updated)
        } catch {
            setImportResult({ count: 0, success: false })
            toast({ title: 'Failed to import CSV', variant: 'destructive' })
        }
        setImporting(false)
        if (csvInputRef.current) csvInputRef.current.value = ''
    }

    const handleExport = () => {
        if (transactions.length === 0) {
            toast({ title: 'No transactions to export', variant: 'destructive' })
            return
        }
        const headers = ['Date', 'Description', 'Amount', 'Category', 'Type', 'Recurring']
        const rows = transactions.map(t => [
            new Date(t.date).toLocaleDateString('en-US'),
            `"${t.description.replace(/"/g, '""')}"`,
            t.amount.toFixed(2),
            t.category,
            t.type,
            t.recurring ? 'Yes' : 'No',
        ])
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `evero-transactions-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: 'Transactions exported!', variant: 'success' as any })
    }

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
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    Import / Export
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Bring in transactions from a CSV file, or download your data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Import Card */}
                <Card className="border-2 border-dashed border-border hover:border-emerald-500/40 transition-all">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-lg font-bold mb-1">Import Transactions</h2>
                        <p className="text-xs text-muted-foreground mb-6 max-w-xs">
                            Upload a CSV file to bulk-add transactions. The file should have columns: Date, Description, Amount, Category, Type.
                        </p>

                        {isPremium ? (
                            <>
                                <input
                                    type="file"
                                    ref={csvInputRef}
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleImport}
                                />
                                <Button
                                    onClick={() => csvInputRef.current?.click()}
                                    disabled={importing}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 w-full"
                                >
                                    {importing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Importing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> Choose CSV File
                                        </div>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => router.push('/pricing')}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                            >
                                <Lock className="w-4 h-4 mr-2" /> Unlock with Premium
                            </Button>
                        )}

                        {/* Import Result */}
                        {importResult && (
                            <div className={`mt-4 w-full p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${importResult.success ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'}`}>
                                {importResult.success ? (
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                )}
                                {importResult.success
                                    ? `Successfully imported ${importResult.count} transactions`
                                    : 'Import failed. Please check your file format.'}
                            </div>
                        )}

                        {/* CSV Format Hint */}
                        <div className="mt-6 w-full text-left">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Expected Format</p>
                            <div className="bg-muted/30 rounded-xl p-3 font-mono text-[10px] text-muted-foreground leading-relaxed overflow-x-auto">
                                <p>Date, Description, Amount, Category, Type</p>
                                <p>2026-03-01, &quot;Groceries&quot;, 45.99, Food, expense</p>
                                <p>2026-03-02, &quot;Salary&quot;, 3000, Income, income</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Export Card */}
                <Card className="border-2 border-dashed border-border hover:border-emerald-500/40 transition-all">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                            <Download className="w-8 h-8 text-blue-500" />
                        </div>
                        <h2 className="text-lg font-bold mb-1">Export Transactions</h2>
                        <p className="text-xs text-muted-foreground mb-6 max-w-xs">
                            Download all your transactions as a CSV file. Open it in Excel, Google Sheets, or any spreadsheet app.
                        </p>

                        {isPremium ? (
                            <Button
                                onClick={handleExport}
                                disabled={transactions.length === 0}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 w-full"
                            >
                                <Download className="w-4 h-4 mr-2" /> Export {transactions.length} Transactions
                            </Button>
                        ) : (
                            <Button
                                onClick={() => router.push('/pricing')}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                            >
                                <Lock className="w-4 h-4 mr-2" /> Unlock with Premium
                            </Button>
                        )}

                        {/* Export Info */}
                        <div className="mt-6 w-full space-y-3">
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">CSV Format</p>
                                    <p className="text-[10px] text-muted-foreground">Compatible with Excel, Sheets & Numbers</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">{transactions.length} Transactions</p>
                                    <p className="text-[10px] text-muted-foreground">All your data ready to download</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
