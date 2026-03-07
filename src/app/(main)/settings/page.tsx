'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
    ArrowLeft, User, Shield, Lock, History,
    Loader2, QrCode, Copy, Check, AlertCircle,
    CreditCard, Camera, Trash2, AlertTriangle,
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export default function SettingsPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const { toast } = useToast()

    const [userData, setUserData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Profile
    const [name, setName] = useState('')
    const [savingName, setSavingName] = useState(false)
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Password
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [savingPassword, setSavingPassword] = useState(false)

    // 2FA
    const [setting2FA, setSetting2FA] = useState(false)
    const [qrCode, setQrCode] = useState('')
    const [backupCodes, setBackupCodes] = useState<string[]>([])
    const [verifyCode, setVerifyCode] = useState('')
    const [copied, setCopied] = useState(false)

    // Delete Account
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const [deletePassword, setDeletePassword] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        const res = await fetch('/api/user')
        if (res.ok) {
            const data = await res.json()
            setUserData(data)
            setName(data.name || '')
            setProfileImage(data.image || null)
        }
        setLoading(false)
    }

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

        setUploadingImage(true)
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
                setProfileImage(resizedDataUrl)
                toast({ title: 'Profile picture updated', variant: 'success' as any })
            } else {
                toast({ title: 'Failed to upload image', variant: 'destructive' })
            }
        } catch {
            toast({ title: 'Error uploading image', variant: 'destructive' })
        } finally {
            setUploadingImage(false)
        }
    }

    const handleUpdateName = async () => {
        setSavingName(true)
        const res = await fetch('/api/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        })
        if (res.ok) toast({ title: 'Name updated', variant: 'success' as any })
        else toast({ title: 'Failed to update name', variant: 'destructive' })
        setSavingName(false)
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingPassword(true)
        const res = await fetch('/api/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
        })
        const data = await res.json()
        if (res.ok) {
            toast({ title: 'Password changed', variant: 'success' as any })
            setCurrentPassword(''); setNewPassword('')
        } else {
            toast({ title: data.error || 'Failed', variant: 'destructive' })
        }
        setSavingPassword(false)
    }

    const handleSetup2FA = async () => {
        setSetting2FA(true)
        const res = await fetch('/api/2fa/setup', { method: 'POST' })
        const data = await res.json()
        if (res.ok) {
            setQrCode(data.qrCode)
            setBackupCodes(data.backupCodes)
        }
    }

    const handleVerify2FA = async () => {
        const res = await fetch('/api/2fa/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: verifyCode, enableAfterVerify: true }),
        })
        if (res.ok) {
            toast({ title: '2FA enabled successfully!', variant: 'success' as any })
            setSetting2FA(false); setQrCode(''); setBackupCodes([]); setVerifyCode('')
            fetchUser()
        } else {
            const data = await res.json()
            toast({ title: data.error || 'Invalid code', variant: 'destructive' })
        }
    }

    const handleDisable2FA = async () => {
        const res = await fetch('/api/2fa/disable', { method: 'POST' })
        if (res.ok) {
            toast({ title: '2FA disabled', variant: 'success' as any })
            fetchUser()
        }
    }

    const copyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join('\n'))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    const is2FAEnabled = userData?.twoFactor?.isEnabled

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <div className="mb-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your security and preferences</p>
            </div>
            {/* Profile */}
            <Card className="animate-slide-up">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg group"
                                disabled={uploadingImage}
                            >
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {(userData?.name || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {uploadingImage ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-5 h-5 text-white" />
                                    )}
                                </div>
                            </button>
                        </div>
                        <div>
                            <p className="font-semibold">{userData?.name || 'User'}</p>
                            <p className="text-sm text-muted-foreground">{userData?.email}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Click photo to change</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                        <Button onClick={handleUpdateName} disabled={savingName}>
                            {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </CardContent>
            </Card>


            {/* Security — Password */}
            <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-amber-500" /> Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div><Label>Current Password</Label><Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /></div>
                        <div><Label>New Password</Label><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={8} required /></div>
                        <Button type="submit" disabled={savingPassword}>
                            {savingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Changing...</> : 'Change Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Security — 2FA */}
            <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /> Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security with Google Authenticator</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {is2FAEnabled ? (
                        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-medium text-emerald-500">2FA is enabled</span>
                            </div>
                            <Button variant="destructive" size="sm" onClick={handleDisable2FA}>Disable</Button>
                        </div>
                    ) : setting2FA && qrCode ? (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white dark:bg-white/5 border border-border">
                                <p className="text-sm text-muted-foreground text-center">Scan this QR code with Google Authenticator</p>
                                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 rounded-xl" />
                            </div>

                            {backupCodes.length > 0 && (
                                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-500" /> Backup Codes
                                        </p>
                                        <Button variant="ghost" size="sm" onClick={copyBackupCodes}>
                                            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {backupCodes.map((code, i) => (
                                            <code key={i} className="text-xs font-mono p-1.5 rounded bg-muted text-center">{code}</code>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">Save these codes safely. Each can only be used once.</p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input value={verifyCode} onChange={e => setVerifyCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} className="text-center font-mono tracking-widest" />
                                <Button onClick={handleVerify2FA}>Verify & Enable</Button>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={handleSetup2FA} variant="outline" className="gap-2">
                            <QrCode className="w-4 h-4" /> Setup 2FA
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Subscription */}
            <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-500" /> Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div>
                            <p className="font-medium">
                                {userData?.subscription?.status === 'active' ? 'Premium Plan' : 'Free Plan'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {userData?.subscription?.status === 'active'
                                    ? `Renews ${new Date(userData.subscription.currentPeriodEnd).toLocaleDateString()}`
                                    : 'Upgrade to unlock all features'
                                }
                            </p>
                        </div>
                        {userData?.subscription?.status !== 'active' && (
                            <Button size="sm" onClick={() => router.push('/pricing')}>Upgrade</Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Login History */}
            <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History className="w-5 h-5 text-slate-500" /> Login History</CardTitle>
                    <CardDescription>Recent sign-in activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {userData?.loginHistory?.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">No login history yet</p>
                        )}
                        {userData?.loginHistory?.map((entry: any) => (
                            <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                <div>
                                    <p className="text-sm font-medium">{entry.userAgent || 'Unknown device'}</p>
                                    <p className="text-xs text-muted-foreground">IP: {entry.ip || 'Unknown'}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(entry.createdAt).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone — Delete Account */}
            <Card className="animate-slide-up border-rose-500/20" style={{ animationDelay: '500ms' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-500">
                        <Trash2 className="w-5 h-5" /> Delete Account
                    </CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!showDeleteModal ? (
                        <Button
                            variant="outline"
                            className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete My Account
                        </Button>
                    ) : (
                        <div className="space-y-4 p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 animate-fade-in">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-rose-500">This is permanent</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        All your transactions, categories, subscriptions, settings, and account data will be permanently erased. This cannot be reversed.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">
                                    Type <span className="font-mono font-bold text-rose-500">DELETE</span> to confirm
                                </Label>
                                <Input
                                    value={deleteConfirmText}
                                    onChange={e => setDeleteConfirmText(e.target.value)}
                                    placeholder="Type DELETE"
                                    className="mt-1 font-mono tracking-widest border-rose-500/20 focus-visible:ring-rose-500/30"
                                />
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">Enter your password</Label>
                                <Input
                                    type="password"
                                    value={deletePassword}
                                    onChange={e => setDeletePassword(e.target.value)}
                                    placeholder="Your password"
                                    className="mt-1 border-rose-500/20 focus-visible:ring-rose-500/30"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    variant="destructive"
                                    disabled={deleteConfirmText !== 'DELETE' || !deletePassword || deleting}
                                    onClick={async () => {
                                        setDeleting(true)
                                        try {
                                            const res = await fetch('/api/user', {
                                                method: 'DELETE',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ password: deletePassword }),
                                            })
                                            if (res.ok) {
                                                toast({ title: 'Account deleted. Goodbye!', variant: 'success' as any })
                                                signOut({ callbackUrl: '/login' })
                                            } else {
                                                const data = await res.json()
                                                toast({ title: data.error || 'Failed to delete account', variant: 'destructive' })
                                            }
                                        } catch {
                                            toast({ title: 'Something went wrong', variant: 'destructive' })
                                        } finally {
                                            setDeleting(false)
                                        }
                                    }}
                                    className="gap-2"
                                >
                                    {deleting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                                    ) : (
                                        <><Trash2 className="w-4 h-4" /> Permanently Delete</>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowDeleteModal(false)
                                        setDeleteConfirmText('')
                                        setDeletePassword('')
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
