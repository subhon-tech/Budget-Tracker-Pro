import { Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md mx-auto px-4">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Zap className="w-7 h-7 text-white stroke-[2.5px]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[24px] font-bold tracking-tight leading-tight">Evero Budget</h1>
                            <p className="text-[12px] text-muted-foreground/60 uppercase tracking-[0.2em] font-black -mt-0.5">Pro Finance</p>
                        </div>
                    </div>
                </div>

                {children}
            </div>
        </div>
    )
}
