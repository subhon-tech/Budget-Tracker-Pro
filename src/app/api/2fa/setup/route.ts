import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id

        // Generate TOTP secret
        const secret = authenticator.generateSecret()

        // Generate QR code
        const otpauthUrl = authenticator.keyuri(
            session.user.email!,
            'Evero Budget',
            secret
        )
        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl)

        // Generate 10 backup codes
        const backupCodes: string[] = []
        const hashedBackupCodes: string[] = []
        for (let i = 0; i < 10; i++) {
            const code = crypto.randomBytes(4).toString('hex')
            backupCodes.push(code)
            hashedBackupCodes.push(await bcrypt.hash(code, 10))
        }

        // Store in database (not yet enabled)
        await prisma.twoFactorAuth.upsert({
            where: { userId },
            update: {
                secret,
                isEnabled: false,
                backupCodes: JSON.stringify(hashedBackupCodes),
            },
            create: {
                userId,
                secret,
                isEnabled: false,
                backupCodes: JSON.stringify(hashedBackupCodes),
            },
        })

        return NextResponse.json({
            qrCode: qrCodeDataUrl,
            secret,
            backupCodes,
        })
    } catch (error) {
        console.error('2FA setup error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
