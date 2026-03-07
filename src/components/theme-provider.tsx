'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => { },
    resolvedTheme: 'light',
})

export function useTheme() {
    return useContext(ThemeContext)
}

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light')
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const stored = localStorage.getItem('evero-theme') as Theme | null
        if (stored) {
            setThemeState(stored)
        }
    }, [])

    useEffect(() => {
        const resolved = theme === 'system' ? getSystemTheme() : theme
        setResolvedTheme(resolved)

        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(resolved)

        localStorage.setItem('evero-theme', theme)
    }, [theme])

    // Listen for system theme changes when set to 'system'
    useEffect(() => {
        if (theme !== 'system') return
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? 'dark' : 'light'
            setResolvedTheme(newTheme)
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(newTheme)
        }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [theme])

    const setTheme = (t: Theme) => setThemeState(t)

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
