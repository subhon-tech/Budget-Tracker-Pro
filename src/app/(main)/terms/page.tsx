'use client'

import { DollarSign, ArrowLeft, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function TermsPage() {
    const router = useRouter()
    const lastUpdated = 'March 3, 2026'

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end">
                    <Button size="sm" onClick={() => router.back()} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Card>
                    <CardContent className="p-8 md:p-12 prose prose-sm dark:prose-invert max-w-none">
                        {/* Hero */}
                        <div className="text-center mb-12 not-prose">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium mb-4">
                                <FileText className="w-4 h-4" /> Legal
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">Terms of Service</h2>
                            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                        </div>

                        <p>
                            Welcome to Evero Budget (&ldquo;the App,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
                            By accessing or using our web application, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
                            Please read them carefully before creating an account or subscribing to our services.
                        </p>

                        <h3>1. Acceptance of Terms</h3>
                        <p>
                            By registering for an account, subscribing to a plan, or otherwise accessing the App,
                            you confirm that you are at least 18 years old, have the legal capacity to enter into
                            this agreement, and agree to abide by these Terms and all applicable laws and regulations.
                            If you do not agree, you must discontinue use immediately.
                        </p>

                        <h3>2. Description of Service</h3>
                        <p>
                            Evero Budget is a subscription-based Software-as-a-Service (SaaS) platform designed
                            to help individuals track personal income, expenses, and financial goals. The App provides
                            tools for transaction categorization, spending analytics, goal tracking, and data visualization.
                        </p>
                        <p>
                            <strong>Important Disclaimer:</strong> The App is a financial <em>tracking</em> tool. It does not
                            provide professional financial advice, investment recommendations, tax guidance, or banking
                            services. You should consult a qualified financial professional for personalized financial advice.
                        </p>

                        <h3>3. Subscription Terms &amp; Billing</h3>
                        <ul>
                            <li>
                                <strong>Pricing:</strong> The Evero Budget Premium subscription is billed at <strong>$9.99 per month</strong> on
                                the monthly plan, or <strong>$7.99 per month</strong> when billed yearly ($95.88/year).
                                All prices are in U.S. Dollars (USD) unless otherwise stated.
                            </li>
                            <li>
                                <strong>Auto-Renewal:</strong> Your subscription will automatically renew at the end of each
                                billing cycle unless you cancel prior to the renewal date. By subscribing, you authorize us to
                                charge your designated payment method on a recurring basis.
                            </li>
                            <li>
                                <strong>7-Day Money-Back Guarantee:</strong> If you are not satisfied with your Premium subscription
                                within the first 7 days, you may request a full refund by emailing <strong>support@everobudget.com</strong>.
                                Refunds are processed within 3-5 business days. For full details, please see our{' '}
                                <button onClick={() => router.push('/refund-policy')} className="text-emerald-500 hover:underline font-semibold">Refund Policy</button>.
                            </li>
                            <li>
                                <strong>Cancellation After 7 Days:</strong> If you cancel your
                                subscription after the 7-day window, you will retain access to Premium features until the end of
                                your current billing period. <strong>No partial refunds</strong> will be issued for unused portions
                                of a billing cycle.
                            </li>
                            <li>
                                <strong>Payment Processing:</strong> Payments are processed securely through Stripe, Inc.
                                We do not store your full credit card details on our servers.
                            </li>
                            <li>
                                <strong>Price Changes:</strong> We reserve the right to modify subscription pricing with at least
                                30 days&apos; prior written notice. Continued use of the App after a price change constitutes
                                acceptance of the new pricing.
                            </li>
                        </ul>

                        <h3>4. Account Security &amp; User Responsibility</h3>
                        <p>You are solely responsible for:</p>
                        <ul>
                            <li>
                                Maintaining the confidentiality of your account password and any Two-Factor Authentication (2FA)
                                tokens, including Google Authenticator codes and backup recovery codes.
                            </li>
                            <li>
                                All activities that occur under your account, whether or not authorized by you.
                            </li>
                            <li>
                                Immediately notifying us at <strong>support@everobudget.com</strong> of any unauthorized
                                access to or use of your account.
                            </li>
                        </ul>
                        <p>
                            We strongly recommend enabling Two-Factor Authentication (2FA) for your account. If you lose
                            access to your 2FA device or backup codes, account recovery may require identity verification
                            and could result in a delay in accessing your account.
                        </p>

                        <h3>5. Acceptable Use Policy</h3>
                        <p>You agree <strong>not</strong> to use Evero Budget for any of the following purposes:</p>
                        <ul>
                            <li>
                                <strong>Data Scraping or Harvesting:</strong> Automated extraction, scraping, or collection of data
                                from the App by bots, crawlers, or any automated means.
                            </li>
                            <li>
                                <strong>Reverse Engineering:</strong> Decompiling, disassembling, reverse engineering, or attempting
                                to derive the source code, algorithms, or architecture of the App.
                            </li>
                            <li>
                                <strong>Illegal Financial Activity:</strong> Using the App to track, facilitate, or obscure proceeds
                                from money laundering, fraud, tax evasion, or any other illegal financial activity.
                            </li>
                            <li>
                                <strong>Abuse or Disruption:</strong> Interfering with, disrupting, or placing undue burden on the
                                App&apos;s servers, networks, or infrastructure.
                            </li>
                            <li>
                                <strong>Impersonation:</strong> Creating accounts under false identities or misrepresenting your
                                affiliation with any person or entity.
                            </li>
                        </ul>

                        <h3>6. Intellectual Property</h3>
                        <p>
                            All content, features, functionality, trademarks, logos, and proprietary technology within
                            Evero Budget are the exclusive property of Evero Budget and its licensors.
                            You are granted a limited, non-exclusive, non-transferable license to use the App for
                            personal, non-commercial purposes in accordance with these Terms. This license does not
                            include the right to sublicense, modify, distribute, or create derivative works.
                        </p>

                        <h3>7. Limitation of Liability</h3>
                        <p>
                            To the maximum extent permitted by applicable law:
                        </p>
                        <ul>
                            <li>
                                Evero Budget is provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> without
                                warranties of any kind, either express or implied, including but not limited to implied warranties
                                of merchantability, fitness for a particular purpose, or non-infringement.
                            </li>
                            <li>
                                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                                arising out of or related to your use or inability to use the App.
                            </li>
                            <li>
                                Our total aggregate liability shall not exceed the amount you paid to us in the twelve (12) months
                                preceding the event giving rise to the claim.
                            </li>
                            <li>
                                We do not guarantee the accuracy, completeness, or reliability of any calculations, categorizations,
                                or analytics generated by the App. Financial decisions made based on the App&apos;s data are made at
                                your own risk.
                            </li>
                        </ul>

                        <h3>8. Account Termination</h3>
                        <p>
                            We reserve the right to suspend or terminate your account, without prior notice, if:
                        </p>
                        <ul>
                            <li>You breach any provision of these Terms of Service.</li>
                            <li>Your subscription payment fails and is not remedied within 7 days.</li>
                            <li>We detect fraudulent, abusive, or illegal activity on your account.</li>
                            <li>Required by law or a valid legal order.</li>
                        </ul>
                        <p>
                            You may cancel your account at any time through the Settings page. Upon cancellation,
                            your data will be retained for a 30-day grace period before permanent deletion, unless
                            you request immediate deletion.
                        </p>

                        <h3>9. Modifications to Terms</h3>
                        <p>
                            We may update these Terms periodically. Material changes will be communicated via email
                            or a prominent notice within the App at least 14 days before they take effect. Continued
                            use of the App after changes become effective constitutes your acceptance of the revised Terms.
                        </p>

                        <h3>10. Governing Law &amp; Dispute Resolution</h3>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the
                            United States. Any disputes arising under these Terms shall first be resolved through
                            good-faith negotiation, followed by binding arbitration in accordance with applicable
                            commercial arbitration rules.
                        </p>

                        <h3>11. Contact Us</h3>
                        <p>
                            If you have questions about these Terms, please contact us at:
                        </p>
                        <ul>
                            <li><strong>Email:</strong> legal@everobudget.com</li>
                            <li><strong>Support:</strong> support@everobudget.com</li>
                        </ul>

                        <div className="not-prose mt-10 pt-8 border-t border-border text-center">
                            <p className="text-sm text-muted-foreground">
                                By using Evero Budget, you acknowledge that you have read, understood, and agree
                                to be bound by these Terms of Service.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center border-t border-border/50">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <button onClick={() => router.push('/privacy')} className="hover:text-foreground transition-colors">Privacy Policy</button>
                    <span>•</span>
                    <button onClick={() => router.push('/about')} className="hover:text-foreground transition-colors">About Us</button>
                    <span>•</span>
                    <span>© 2026 Evero Budget</span>
                </div>
            </footer>
        </div>
    )
}
