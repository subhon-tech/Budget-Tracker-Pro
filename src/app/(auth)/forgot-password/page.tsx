'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [resetUrl, setResetUrl] = useState<string | null>(null)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Something went wrong')
            } else {
                setSent(true)
                setResetUrl(data.resetUrl)
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
                <CardTitle>Forgot password?</CardTitle>
                <CardDescription>
                    {sent ? 'Your reset link is ready' : 'Enter your email to reset your password'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {sent ? (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex flex-col items-center gap-3 py-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                A password reset link has been generated for <strong className="text-foreground">{email}</strong>
                            </p>
                        </div>

                        {resetUrl && (
                            <a
                                href={resetUrl}
                                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Reset My Password
                            </a>
                        )}

                        <p className="text-center text-xs text-muted-foreground">
                            This link expires in 1 hour.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>

                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to login
                        </Link>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}
