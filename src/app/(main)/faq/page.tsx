'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
    HelpCircle, ChevronDown, Sparkles, LayoutDashboard,
    CreditCard, Shield, DollarSign, ArrowUpDown, Gift, PieChart,
    FileText, Scale, RotateCcw, Info, ExternalLink
} from 'lucide-react'

interface FaqItem {
    q: string
    a: string
}

interface FaqCategory {
    title: string
    icon: any
    gradient: string
    items: FaqItem[]
}

const faqData: FaqCategory[] = [
    {
        title: 'Getting Started',
        icon: Sparkles,
        gradient: 'from-emerald-500 to-teal-600',
        items: [
            {
                q: 'What is Evero Budget?',
                a: 'Evero Budget is a modern personal finance platform that helps you track income, manage expenses, set monthly spending goals, and understand your spending patterns. It\'s designed to be simple, secure, and beautifully easy to use — without ever asking for your bank login credentials.',
            },
            {
                q: 'How do I create an account?',
                a: 'Click "Sign Up" on the login page. Enter your full name, email, and a password (at least 8 characters). Once registered, you\'ll be redirected to the onboarding flow where you can set up your profile and start tracking.',
            },
            {
                q: 'Is Evero Budget free?',
                a: 'Yes! The Starter plan is completely free and includes up to 2 budget categories, 12 transactions per month, and manual data entry. For unlimited features, CSV/bank imports, and advanced insights, you can upgrade to Premium.',
            },
            {
                q: 'What\'s the difference between Starter and Premium?',
                a: 'Starter (Free): 2 budget categories, 12 transactions/month, manual entry, 2FA security. Premium ($9.99/month or $7.99/month billed yearly): Unlimited categories, unlimited transactions, CSV & bank imports, burn rate & advanced insights, priority support, and custom categories. Both plans include Two-Factor Authentication.',
            },
        ],
    },
    {
        title: 'Dashboard & Tracking',
        icon: LayoutDashboard,
        gradient: 'from-blue-500 to-indigo-600',
        items: [
            {
                q: 'How does the Dashboard work?',
                a: 'Your Dashboard is your financial command center. It shows your total income, total expenses, and net balance at a glance. You\'ll also see your monthly spending goal progress, recent transactions, and a breakdown of spending by category — all updated in real time.',
            },
            {
                q: 'How do I add income or expenses?',
                a: 'Go to the Transactions page and click "Add Transaction." Choose the type (income or expense), enter the amount, description, category, and date. The transaction will instantly appear in your history and update your dashboard totals.',
            },
            {
                q: 'Can I set monthly spending goals?',
                a: 'Absolutely! Your monthly goal is set during onboarding and can be updated anytime in Settings. The dashboard shows a visual progress bar so you can see how close you are to your target each month.',
            },
            {
                q: 'What is the Calendar view?',
                a: 'The Calendar view displays your transactions on a monthly calendar so you can visually see which days had spending activity. It\'s a great way to spot patterns and identify your highest-spending days.',
            },
        ],
    },
    {
        title: 'Budgets & Categories',
        icon: PieChart,
        gradient: 'from-purple-500 to-pink-600',
        items: [
            {
                q: 'How do budgets work?',
                a: 'Budgets let you set spending limits for specific categories (e.g., Food, Transport, Entertainment). You create a budget with a category name, color, and monthly limit. As you add expenses in that category, the budget progress bar fills up so you can track how much you\'ve spent vs. your limit.',
            },
            {
                q: 'How many categories can I create?',
                a: 'Starter users can create up to 2 budget categories. Premium users get unlimited categories, so you can track every aspect of your spending in detail.',
            },
            {
                q: 'Can I customize budget categories?',
                a: 'Yes! Premium users can create fully custom categories with custom names and colors. This lets you organize your spending exactly the way you want — whether it\'s by project, lifestyle, or any system that works for you.',
            },
        ],
    },
    {
        title: 'Recurring Costs',
        icon: CreditCard,
        gradient: 'from-cyan-500 to-blue-600',
        items: [
            {
                q: 'What is the Recurring page?',
                a: 'The Recurring Costs page helps you track all your fixed monthly expenses — services like Netflix, Spotify, GitHub, AWS, and more. You can add items from our built-in Service Library or manually enter any custom cost. The page shows your total monthly spend and active recurring count.',
            },
            {
                q: 'How do recurring costs show up in my history?',
                a: 'Recurring costs are automatically included in your transaction history and dashboard calculations as expenses. They\'re marked with a "Rec" badge so you can easily distinguish them from one-time transactions.',
            },
        ],
    },
    {
        title: 'Import & Export',
        icon: ArrowUpDown,
        gradient: 'from-amber-500 to-orange-600',
        items: [
            {
                q: 'Can I import bank statements?',
                a: 'Yes! Premium users can import transactions via CSV files. Simply export a CSV from your bank, upload it on the Import/Export page, and your transactions will be automatically parsed and added to your account.',
            },
            {
                q: 'Can I export my financial data?',
                a: 'Yes, all users can export their transaction data as a CSV file. Go to the Import/Export page and click "Export." Your complete transaction history will be downloaded as a spreadsheet you can open in Excel, Google Sheets, or any CSV-compatible app.',
            },
        ],
    },
    {
        title: 'Referral Program',
        icon: Gift,
        gradient: 'from-emerald-500 to-teal-600',
        items: [
            {
                q: 'How does the Referral Program work?',
                a: 'Join the Referral Program from the sidebar. You\'ll get a unique referral link. When someone signs up through your link and subscribes to Premium, you earn $2.99 every month for as long as they stay subscribed. It\'s passive income — for life!',
            },
            {
                q: 'What is the $250 milestone bonus?',
                a: 'When you refer 50 Premium users, you receive a one-time $250 bonus on top of your recurring monthly earnings. That means at 50 referrals you\'d earn $250 + $149.50/month ($2.99 × 50) — a powerful income stream!',
            },
            {
                q: 'Who can join the Referral Program?',
                a: 'The Referral Program is available for all users — both Starter and Premium. Anyone can join, share their link, and start earning referral income immediately.',
            },
        ],
    },
    {
        title: 'Security & Privacy',
        icon: Shield,
        gradient: 'from-rose-500 to-red-600',
        items: [
            {
                q: 'Is my financial data safe?',
                a: 'Absolutely. We use enterprise-grade security including encrypted data storage and secure authentication. We never ask for your bank login credentials — all data entry is manual or via CSV import, keeping your bank accounts completely untouched.',
            },
            {
                q: 'Do you support Two-Factor Authentication?',
                a: 'Yes! All users — both Starter and Premium — get access to Two-Factor Authentication (2FA) using authenticator apps like Google Authenticator or Authy. This adds an extra layer of security to your account beyond just a password. You\'ll also receive backup codes in case you lose access to your authenticator.',
            },
            {
                q: 'Do you sell my data?',
                a: 'Never. We have a zero-tolerance policy on data exploitation. We never sell, share, or monetize your personal or financial data with third-party advertisers. Your data belongs to you — period. Read our full Privacy Policy for details.',
            },
        ],
    },
    {
        title: 'Billing & Premium',
        icon: DollarSign,
        gradient: 'from-violet-500 to-purple-600',
        items: [
            {
                q: 'How much does Premium cost?',
                a: 'Premium is $9.99/month on the monthly plan, or $7.99/month when billed yearly ($95.88/year). Both plans include all Premium features: unlimited categories, unlimited transactions, CSV imports, advanced insights, and priority support. Note: 2FA security is available on all plans, including Starter.',
            },
            {
                q: 'How do I cancel my subscription?',
                a: 'You can manage or cancel your Premium subscription anytime from the Settings page. Your Premium features will remain active until the end of your current billing period. No cancellation fees, no questions asked.',
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment partner Stripe. All payment processing is handled by Stripe — we never see or store your full card details.',
            },
        ],
    },
    {
        title: 'Policies & Legal',
        icon: Scale,
        gradient: 'from-slate-500 to-zinc-600',
        items: [
            {
                q: 'Where can I read the Privacy Policy?',
                a: 'You can read our full Privacy Policy at any time by visiting the Privacy Policy page from the links below. It explains what data we collect, how we use it, how we protect it, and your rights as a user. In short: we never sell your data, and we only collect what\'s necessary to provide the service.',
            },
            {
                q: 'What do the Terms of Service cover?',
                a: 'Our Terms of Service outline the rules and guidelines for using Evero Budget. They cover account responsibilities, acceptable use, intellectual property, subscription terms, limitation of liability, and more. We recommend reading them when you sign up.',
            },
            {
                q: 'What is your Refund Policy?',
                a: 'We offer a 7-day money-back guarantee on all Premium subscriptions. If you\'re not satisfied with Premium within the first 7 days of your subscription, contact us at support@everobudget.com and we\'ll issue a full refund — no questions asked. After 7 days, you can cancel anytime and your Premium features will remain active until the end of your current billing period, but no partial refunds are issued.',
            },
            {
                q: 'Where can I learn more about the company?',
                a: 'Visit our About Us page to learn about the team behind Evero Budget, our mission, our values, and why we built this platform. Founded in 2026, we\'re a team of developers and finance experts who believe financial tools should be honest, accessible, and beautifully simple.',
            },
        ],
    },
]

export default function FaqPage() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

    const toggleItem = (key: string) => {
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
            {/* Header */}
            <div className="text-center space-y-4 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold">
                    <HelpCircle className="w-4 h-4" /> Help Center
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                    Frequently Asked <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Questions</span>
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                    Everything you need to know about Evero Budget. Can&apos;t find what you&apos;re looking for? Reach out to our support team.
                </p>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-8">
                {faqData.map((category, catIdx) => (
                    <div key={category.title} className="animate-slide-up" style={{ animationDelay: `${catIdx * 80}ms` }}>
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg`}>
                                <category.icon className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold">{category.title}</h2>
                        </div>

                        {/* Questions */}
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                {category.items.map((item, itemIdx) => {
                                    const key = `${catIdx}-${itemIdx}`
                                    const isOpen = openItems[key]
                                    return (
                                        <div key={key} className={itemIdx > 0 ? 'border-t border-border/50' : ''}>
                                            <button
                                                onClick={() => toggleItem(key)}
                                                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors group"
                                            >
                                                <span className="text-sm font-semibold pr-4 group-hover:text-emerald-500 transition-colors">
                                                    {item.q}
                                                </span>
                                                <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                                            </button>
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <div className="px-5 pb-5 pt-0">
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
                <h2 className="text-xl font-bold mb-4 text-center">Quick Links</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { name: 'Privacy Policy', href: '/privacy', icon: Shield, gradient: 'from-rose-500 to-red-600' },
                        { name: 'Terms of Service', href: '/terms', icon: FileText, gradient: 'from-blue-500 to-indigo-600' },
                        { name: 'Refund Policy', href: '/refund-policy', icon: RotateCcw, gradient: 'from-amber-500 to-orange-600' },
                        { name: 'About Us', href: '/about', icon: Info, gradient: 'from-emerald-500 to-teal-600' },
                    ].map((link) => (
                        <Link key={link.name} href={link.href}>
                            <Card className="group hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                                <CardContent className="p-5 text-center space-y-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-white shadow-lg mx-auto group-hover:scale-110 transition-transform`}>
                                        <link.icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-semibold group-hover:text-emerald-500 transition-colors">{link.name}</p>
                                    <ExternalLink className="w-3 h-3 text-muted-foreground mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Contact CTA */}
            <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/10 animate-slide-up" style={{ animationDelay: '800ms' }}>
                <CardContent className="p-8 text-center space-y-3">
                    <h3 className="text-xl font-bold">Still have questions?</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Our team is here to help! Reach out to us anytime and we&apos;ll get back to you as soon as possible.
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">
                        support@everobudget.com
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
