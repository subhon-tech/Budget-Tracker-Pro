import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authenticator } from 'otplib'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = (session.user as any).id
        const { token, isBackupCode, enableAfterVerify } = await request.json()

        const twoFactor = await prisma.twoFactorAuth.findUnique({
            where: { userId },
        })

        if (!twoFactor) {
            return NextResponse.json({ error: '2FA not set up' }, { status: 400 })
        }

        if (isBackupCode) {
            // Verify backup code
            const hashedCodes: string[] = JSON.parse(twoFactor.backupCodes)
            let foundIndex = -1

            for (let i = 0; i < hashedCodes.length; i++) {
                const isValid = await bcrypt.compare(token, hashedCodes[i])
                if (isValid) {
                    foundIndex = i
                    break
                }
            }

            if (foundIndex === -1) {
                return NextResponse.json({ error: 'Invalid backup code' }, { status: 400 })
            }

            // Remove used backup code
            hashedCodes.splice(foundIndex, 1)
            await prisma.twoFactorAuth.update({
                where: { userId },
                data: { backupCodes: JSON.stringify(hashedCodes) },
            })
        } else {
            // Verify TOTP
            const isValid = authenticator.verify({ token, secret: twoFactor.secret })
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
            }
        }

        // Enable 2FA if this is the initial setup verification
        if (enableAfterVerify && !twoFactor.isEnabled) {
            await prisma.twoFactorAuth.update({
                where: { userId },
                data: { isEnabled: true },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('2FA verify error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
