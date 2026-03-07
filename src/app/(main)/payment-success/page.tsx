'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-md w-full text-center">
                <CardContent className="pt-8 pb-8 space-y-6">
                    {/* Animated checkmark */}
                    <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center animate-checkmark shadow-lg shadow-emerald-500/30">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            Payment Successful!
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </h1>
                        <p className="text-muted-foreground">
                            Welcome to Evero Budget! You now have full access to all premium features.
                        </p>
                    </div>

                    <div className="glass-card p-4 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Plan</span>
                            <span className="font-medium">Premium Monthly</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-medium">$9.99/month</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-medium text-emerald-500">Active</span>
                        </div>
                    </div>

                    <Button asChild size="lg" className="w-full text-base">
                        <Link href="/dashboard">
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
