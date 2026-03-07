'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    DollarSign,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    BarChart3
} from 'lucide-react'

const steps = [
    {
        title: "Welcome to Evero Budget",
        description: "Your journey to financial freedom starts here. We've built the most secure and intuitive budget tracker for professionals.",
        icon: DollarSign,
        color: "bg-emerald-500",
        features: ["Bank-level encryption", "Real-time tracking", "Smart insights"]
    },
    {
        title: "Add Your First Income",
        description: "To get started, tell us how much you earn each month. This sets the foundation for your budget goals.",
        icon: TrendingUp,
        color: "bg-blue-500",
        tips: "Tip: Include all sources like salary, freelance work, and investments."
    },
    {
        title: "Secure Your Future",
        description: "All users enjoy 2FA security to protect their accounts. Premium unlocks unlimited transaction tracking and advanced insights.",
        icon: ShieldCheck,
        color: "bg-purple-500",
        features: ["Unlimited Categories", "Advanced Burn Rate", "2FA for All Users"]
    }
]

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const router = useRouter()

    const next = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            router.push('/pricing')
        }
    }

    const step = steps[currentStep]
    const Icon = step.icon

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-xl w-full">
                <div className="mb-8 flex justify-center gap-2">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-emerald-500' : 'w-2 bg-muted'
                                }`}
                        />
                    ))}
                </div>

                <Card className="animate-slide-up border-none shadow-2xl bg-background/60 backdrop-blur-xl">
                    <CardContent className="pt-12 pb-8 px-8 text-center">
                        <div className={`w-20 h-20 rounded-3xl ${step.color} mx-auto flex items-center justify-center mb-8 shadow-lg shadow-${step.color.split('-')[1]}-500/20 text-white animate-bounce-slow`}>
                            <Icon className="w-10 h-10" />
                        </div>

                        <h1 className="text-3xl font-bold mb-4 tracking-tight">{step.title}</h1>
                        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{step.description}</p>

                        {step.features && (
                            <div className="grid grid-cols-1 gap-3 mb-8 text-left max-w-xs mx-auto">
                                {step.features.map((f) => (
                                    <div key={f} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="text-sm font-medium">{f}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {step.tips && (
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-8">
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    {step.tips}
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={next}
                            size="lg"
                            className="w-full h-14 text-lg font-bold group"
                        >
                            {currentStep === steps.length - 1 ? 'See Pricing Plans' : 'Next'}
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        {currentStep < steps.length - 1 && (
                            <button
                                onClick={() => router.push('/pricing')}
                                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Skip to dashboard
                            </button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
