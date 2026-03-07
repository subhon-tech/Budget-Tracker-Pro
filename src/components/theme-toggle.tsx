'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <div className={cn("w-10 h-10 rounded-xl bg-muted/50 border border-border", className)} />
    )

    return (
        <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={cn(
                "px-3 py-2.5 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-all group shadow-sm active:scale-95 flex items-center gap-2.5",
                className
            )}
        >
            {resolvedTheme === 'dark' ? (
                <>
                    <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform" />
                    <span className="text-sm font-semibold whitespace-nowrap">Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="w-5 h-5 text-indigo-500 group-hover:-rotate-12 transition-transform" />
                    <span className="text-sm font-semibold whitespace-nowrap">Dark Mode</span>
                </>
            )}
        </button>
    )
}
