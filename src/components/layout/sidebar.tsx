'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
    LayoutDashboard,
    ArrowLeftRight,
    PieChart,
    CalendarDays,
    ArrowUpDown,
    CreditCard,
    Settings,
    User,
    LogOut,
    Zap,
    Briefcase,
    PanelLeftClose,
    PanelLeftOpen,
    Gift,
    HelpCircle,
    Moon,
    Sun
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    { name: 'Import/Export', href: '/import-export', icon: ArrowUpDown },
    { name: 'Recurring', href: '/subscriptions', icon: CreditCard },
]

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()
    const [userData, setUserData] = useState<any>(null)
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('/api/user')
            if (res.ok) {
                const data = await res.json()
                setUserData(data)
            }
        }

        if (session) {
            fetchUser()
        }

        window.addEventListener('user-data-updated', fetchUser)
        return () => window.removeEventListener('user-data-updated', fetchUser)
    }, [session])

    const isPremium = userData?.subscription?.status === 'active'

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen border-r border-border/50 bg-background/50 backdrop-blur-xl flex flex-col z-40 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className={cn(
                "p-6 pb-2 flex items-center justify-between",
                isCollapsed && "px-4 justify-center"
            )}>
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-[1.25rem] bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
                            <Zap className="w-6 h-6 text-white stroke-[2.5px]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[20px] font-bold tracking-tight leading-tight text-foreground whitespace-nowrap">Evero Budget</h1>
                            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] font-black -mt-0.5 whitespace-nowrap">Pro Finance</p>
                        </div>
                    </Link>
                )}
                {isCollapsed && (
                    <div className="w-11 h-11 rounded-[1.25rem] bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Zap className="w-6 h-6 text-white stroke-[2.5px]" />
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground",
                        isCollapsed && "absolute -right-3 top-8 bg-background border border-border shadow-sm rounded-full z-10 p-1"
                    )}
                >
                    {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                isCollapsed && "justify-center px-0",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5",
                                isActive ? "text-emerald-500" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            {!isCollapsed && item.name}
                        </Link>
                    )
                })}

                <div className="pt-6">
                    {!isCollapsed && <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Platform</p>}
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                            isCollapsed && "justify-center px-0",
                            pathname === '/settings'
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                        )}
                    >
                        <Settings className="w-5 h-5" />
                        {!isCollapsed && "Settings"}
                    </Link>
                    <Link
                        href="/referral"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                            isCollapsed && "justify-center px-0",
                            pathname === '/referral'
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                        )}
                    >
                        <Gift className="w-5 h-5" />
                        {!isCollapsed && "Referral"}
                    </Link>
                    <Link
                        href="/faq"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                            isCollapsed && "justify-center px-0",
                            pathname === '/faq'
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                        )}
                    >
                        <HelpCircle className="w-5 h-5" />
                        {!isCollapsed && "FAQ"}
                    </Link>
                </div>
            </nav>

            {!isCollapsed && !isPremium && (
                <div className="px-4 mb-4">
                    <button
                        onClick={() => router.push('/pricing')}
                        className="w-full p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-left group hover:border-emerald-500/40 transition-all shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-1.5 rounded-lg bg-emerald-500 text-white">
                                <Zap className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">UPGRADE</span>
                        </div>
                        <p className="text-xs font-bold mb-1">Unlock Premium</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">Get unlimited categories and bank imports.</p>
                    </button>
                </div>
            )}

            <div className={cn(
                "p-4 border-t border-border/50 bg-muted/20",
                isCollapsed && "p-2 py-4"
            )}>
                <div className={cn(
                    "flex items-center gap-3 p-2 group cursor-pointer",
                    isCollapsed && "justify-center p-0"
                )} onClick={() => router.push('/profile')}>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-border group-hover:border-emerald-500/50 transition-colors">
                            {userData?.image ? (
                                <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                                    {session?.user?.name?.[0].toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        {isPremium && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center shadow-lg">
                                <Zap className="w-2 h-2 text-white fill-white" />
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate group-hover:text-emerald-500 transition-colors">{session?.user?.name || 'User'}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    signOut({ callbackUrl: '/login' });
                                }}
                                className="p-2 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}
