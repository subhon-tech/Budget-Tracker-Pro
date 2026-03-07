import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account with that email exists, a reset link has been generated.',
                resetUrl: null,
            })
        }

        // Generate a secure random token
        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

        // Delete any existing tokens for this email
        await prisma.verificationToken.deleteMany({
            where: { identifier: email },
        })

        // Store the token
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        })

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const resetUrl = `${baseUrl}/reset-password?token=${token}`

        return NextResponse.json({
            message: 'Reset link generated successfully.',
            resetUrl,
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}
