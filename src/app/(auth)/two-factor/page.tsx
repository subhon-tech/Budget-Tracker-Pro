'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Shield, AlertCircle, KeyRound } from 'lucide-react'

export default function TwoFactorPage() {
    const [code, setCode] = useState('')
    const [useBackup, setUseBackup] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: code, isBackupCode: useBackup }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Invalid code')
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="animate-slide-up">
            <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                    {useBackup
                        ? 'Enter one of your backup codes'
                        : 'Enter the 6-digit code from your authenticator app'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="code">{useBackup ? 'Backup Code' : 'Verification Code'}</Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="code"
                                type="text"
                                placeholder={useBackup ? 'Enter backup code' : '000000'}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="pl-10 text-center text-lg tracking-widest font-mono"
                                maxLength={useBackup ? 20 : 6}
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                        ) : (
                            'Verify'
                        )}
                    </Button>

                    <button
                        type="button"
                        onClick={() => { setUseBackup(!useBackup); setCode(''); setError('') }}
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {useBackup ? '← Use authenticator app' : 'Use a backup code instead'}
                    </button>
                </form>
            </CardContent>
        </Card>
    )
}
