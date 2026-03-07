'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Shield, Zap, Upload, Trash2, Loader2, LogOut } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [userData, setUserData] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchUser = async () => {
        const res = await fetch('/api/user')
        if (res.ok) {
            const data = await res.json()
            setUserData(data)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast({ title: 'Please select an image file', variant: 'destructive' })
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({ title: 'Image must be under 5MB', variant: 'destructive' })
            return
        }

        setUploading(true)
        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            const img = new Image()

            const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.readAsDataURL(file)
            })

            await new Promise<void>((resolve) => {
                img.onload = () => {
                    canvas.width = 256
                    canvas.height = 256
                    const size = Math.min(img.width, img.height)
                    const x = (img.width - size) / 2
                    const y = (img.height - size) / 2
                    ctx.drawImage(img, x, y, size, size, 0, 0, 256, 256)
                    resolve()
                }
                img.src = dataUrl
            })

            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85)

            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: resizedDataUrl }),
            })

            if (res.ok) {
                toast({ title: 'Profile picture updated', variant: 'success' as any })
                fetchUser()
                window.dispatchEvent(new Event('user-data-updated'))
            } else {
                toast({ title: 'Failed to upload image', variant: 'destructive' })
            }
        } catch {
            toast({ title: 'Error uploading image', variant: 'destructive' })
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveImage = async () => {
        setUploading(true)
        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: null }),
            })

            if (res.ok) {
                toast({ title: 'Profile picture removed', variant: 'success' as any })
                fetchUser()
                window.dispatchEvent(new Event('user-data-updated'))
            }
        } catch {
            toast({ title: 'Failed to remove image', variant: 'destructive' })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-card/50 p-8 rounded-3xl border border-border/50 backdrop-blur-sm shadow-xl">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/15 shadow-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                        {userData?.image ? (
                            <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-semibold text-emerald-500/40">
                                {session?.user?.name?.[0].toUpperCase() || 'U'}
                            </span>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">{session?.user?.name || 'User'}</h1>
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                        <Mail className="w-4 h-4" /> {session?.user?.email}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-xl h-9 px-4 flex items-center gap-2 font-medium text-sm bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-none transition-all"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            <Upload className="w-4 h-4" />
                            {userData?.image ? 'Change Photo' : 'Upload Photo'}
                        </Button>

                        {userData?.image && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-xl h-9 px-4 flex items-center gap-2 font-medium text-sm text-rose-500 hover:bg-rose-500/10 transition-all"
                                onClick={handleRemoveImage}
                                disabled={uploading}
                            >
                                <Trash2 className="w-4 h-4" /> Remove
                            </Button>
                        )}

                        {userData?.subscription?.status === 'active' && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md shadow-emerald-500/15">
                                <Zap className="w-3 h-3 fill-white" /> PREMIUM MEMBER
                            </div>
                        )}


                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="rounded-2xl border border-border/50 shadow-md bg-card/60 backdrop-blur-md overflow-hidden group hover:bg-card/80 transition-all duration-300">
                    <CardHeader className="pb-2 pt-6 px-6">
                        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-blue-500" />
                            </div>
                            Account Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/20 border border-border/40 group-hover:bg-muted/30 transition-colors">
                                <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">2FA Status</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold">{userData?.twoFactor?.isEnabled ? 'Protected' : 'At Risk'}</span>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                                        userData?.twoFactor?.isEnabled ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-500'
                                    )}>
                                        {userData?.twoFactor?.isEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/20 border border-border/40 group-hover:bg-muted/30 transition-colors">
                                <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">Account Type</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold">{userData?.subscription?.status === 'active' ? 'Premium Pro' : 'Starter Plan'}</span>
                                    <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">
                                        {userData?.subscription?.status === 'active' ? 'ULTIMATE' : 'FREE'}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full h-12 rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 border border-rose-500/10 font-medium text-sm transition-all duration-300 gap-2 group/logout"
                                onClick={() => signOut({ callbackUrl: '/login' })}
                            >
                                <LogOut className="w-4 h-4 transition-transform group-hover/logout:-translate-x-1" />
                                Log out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border/50 shadow-md bg-card/60 backdrop-blur-md overflow-hidden group hover:bg-card/80 transition-all duration-300">
                    <CardHeader className="pb-2 pt-6 px-6">
                        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-purple-500" />
                            </div>
                            Personal Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/20 border border-border/40 group-hover:bg-muted/30 transition-colors">
                                <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">Name</span>
                                <span className="text-base font-semibold text-foreground">{session?.user?.name || 'User'}</span>
                            </div>
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/20 border border-border/40 group-hover:bg-muted/30 transition-colors">
                                <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">Email</span>
                                <span className="text-sm font-medium text-foreground/80 truncate">{session?.user?.email}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-muted/20 border border-border/40 group-hover:bg-muted/30 transition-colors">
                                    <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">Member Since</span>
                                    <span className="text-xs font-medium">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}</span>
                                </div>
                                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-muted/20 border border-border/40 group-hover:bg-muted/30 transition-colors">
                                    <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">ID Reference</span>
                                    <span className="font-mono text-[10px] font-normal uppercase text-muted-foreground tracking-tight truncate">{userData?.id?.slice(-12) || '...'}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
