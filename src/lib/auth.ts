import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
        newUser: '/signup',
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required')
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { twoFactor: true },
                })

                if (!user || !user.hashedPassword) {
                    throw new Error('Invalid credentials')
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if (!isPasswordValid) {
                    throw new Error('Invalid credentials')
                }

                // Record login history
                await prisma.loginHistory.create({
                    data: {
                        userId: user.id,
                        ip: 'unknown',
                        userAgent: 'unknown',
                    },
                })

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    requiresTwoFactor: user.twoFactor?.isEnabled ?? false,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.requiresTwoFactor = (user as any).requiresTwoFactor ?? false
                token.twoFactorVerified = false
            }

            // Explicitly strip large data from the token to prevent header errors
            if (token.picture) delete token.picture;
            if (token.image) delete token.image;

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string
                (session.user as any).requiresTwoFactor = token.requiresTwoFactor as boolean
                (session.user as any).twoFactorVerified = token.twoFactorVerified as boolean
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
