'use client'

import { DollarSign, ArrowLeft, Lock, Shield, Database, Globe, Trash2, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPage() {
    const router = useRouter()
    const lastUpdated = 'February 25, 2026'

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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: Lock, title: 'AES-256 Encryption', desc: 'Bank-grade data protection', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { icon: Shield, title: 'No Data Sales', desc: 'We never sell your data', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { icon: Database, title: 'You Own Your Data', desc: 'Delete anytime, no questions', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    ].map((item) => (
                        <Card key={item.title} className="text-center">
                            <CardContent className="p-5 space-y-2">
                                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mx-auto`}>
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <p className="font-semibold text-sm">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardContent className="p-8 md:p-12 prose prose-sm dark:prose-invert max-w-none">
                        {/* Hero */}
                        <div className="text-center mb-12 not-prose">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium mb-4">
                                <Shield className="w-4 h-4" /> Your Privacy Matters
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h2>
                            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                                This policy is designed to be transparent and readable. We believe you should always
                                know exactly how your data is handled.
                            </p>
                        </div>

                        <h3>1. Introduction</h3>
                        <p>
                            Evero Budget (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting
                            your personal information and your right to privacy. This Privacy Policy explains what information
                            we collect, how we use it, and what rights you have in relation to it.
                        </p>
                        <p>
                            This policy complies with the <strong>General Data Protection Regulation (GDPR)</strong>,
                            the <strong>California Consumer Privacy Act (CCPA)</strong>, and their respective 2026 updates.
                            If you are a resident of the European Economic Area (EEA) or California, you have specific
                            rights outlined in this document.
                        </p>

                        <h3>2. Information We Collect</h3>
                        <h4>2.1 Information You Provide</h4>
                        <ul>
                            <li>
                                <strong>Account Information:</strong> Your name, email address, and hashed password
                                (we never store plaintext passwords).
                            </li>
                            <li>
                                <strong>Transaction Data:</strong> Income and expense amounts, descriptions, categories,
                                and dates that you manually enter into the App.
                            </li>
                            <li>
                                <strong>Financial Goals:</strong> Monthly budget goals you set within the App.
                            </li>
                            <li>
                                <strong>Two-Factor Authentication:</strong> Encrypted 2FA secrets and hashed backup
                                recovery codes, used solely for account security.
                            </li>
                        </ul>

                        <h4>2.2 Information Collected Automatically</h4>
                        <ul>
                            <li>
                                <strong>Device Information:</strong> Basic device metadata such as browser type,
                                operating system, and screen resolution (used for optimizing App performance).
                            </li>
                            <li>
                                <strong>Login History:</strong> IP addresses and timestamps of login events
                                (used for security monitoring and fraud prevention).
                            </li>
                            <li>
                                <strong>Usage Analytics:</strong> Aggregated, anonymized usage patterns to improve
                                the App experience. We do not track individual user behavior for advertising.
                            </li>
                        </ul>

                        <h4>2.3 Information We Never Collect</h4>
                        <div className="not-prose my-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <p className="text-sm font-semibold text-emerald-600 mb-2">🔒 We do NOT collect:</p>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Bank account login credentials</li>
                                <li>Social Security numbers or government-issued IDs</li>
                                <li>Credit card numbers (payment is processed by Stripe)</li>
                                <li>Location data (GPS/geolocation)</li>
                                <li>Contacts, photos, or other personal device data</li>
                            </ul>
                        </div>

                        <h3>3. How We Use Your Information</h3>
                        <p>We use the information we collect exclusively to:</p>
                        <ul>
                            <li>Provide, operate, and maintain the Evero Budget service.</li>
                            <li>Process subscription payments through our payment processor (Stripe).</li>
                            <li>Authenticate your identity and secure your account (including 2FA verification).</li>
                            <li>Generate your personal financial analytics, charts, and insights.</li>
                            <li>Communicate important service updates, security alerts, and billing notifications.</li>
                            <li>Investigate and prevent fraudulent or unauthorized activity.</li>
                        </ul>
                        <p>
                            <strong>We do not use your data for targeted advertising, behavioral profiling,
                                or any form of data monetization.</strong>
                        </p>

                        <h3>4. Data Security Standards</h3>
                        <p>
                            Protecting your data is not just a feature — it&apos;s the foundation of our architecture.
                        </p>
                        <ul>
                            <li>
                                <strong>Encryption at Rest:</strong> All stored data is encrypted using <strong>AES-256
                                    encryption</strong>, the same standard used by major financial institutions and
                                government agencies.
                            </li>
                            <li>
                                <strong>Encryption in Transit:</strong> All data transmitted between your device and
                                our servers is secured with <strong>TLS 1.3</strong> protocol.
                            </li>
                            <li>
                                <strong>Multi-Factor Authentication (MFA):</strong> We offer — and strongly recommend —
                                Two-Factor Authentication via Google Authenticator (TOTP) with backup recovery codes.
                            </li>
                            <li>
                                <strong>Password Security:</strong> Passwords are hashed using <strong>bcrypt</strong> with
                                a minimum cost factor of 10. We never store or have access to your plaintext password.
                            </li>
                            <li>
                                <strong>Payment Security:</strong> All payment processing is handled by <strong>Stripe, Inc.</strong>,
                                a PCI DSS Level 1 certified processor. We do not store, process, or transmit your credit
                                card information on our servers.
                            </li>
                        </ul>

                        <h3>5. Data Sharing &amp; Third Parties</h3>
                        <div className="not-prose my-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                            <p className="text-sm font-bold text-rose-600 mb-2">
                                ⛔ We do NOT sell, rent, lease, or trade your personal data to any third-party advertisers,
                                data brokers, or marketing companies — under any circumstances.
                            </p>
                        </div>
                        <p>We share data only with the following service providers, strictly for operational purposes:</p>
                        <ul>
                            <li>
                                <strong>Stripe, Inc.</strong> — Payment processing for subscription billing.
                                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"> Stripe Privacy Policy →</a>
                            </li>
                        </ul>
                        <p>
                            We may also disclose information when required by law, regulation, or valid legal process
                            (e.g., a court order or subpoena).
                        </p>

                        <h3>6. Data Retention &amp; Deletion</h3>
                        <ul>
                            <li>
                                <strong>Active Accounts:</strong> We retain your data for as long as your account is active
                                and your subscription is current.
                            </li>
                            <li>
                                <strong>Account Cancellation:</strong> When you cancel your subscription, your data remains
                                accessible until the end of the current billing period. After that, data enters a
                                <strong> 30-day grace period</strong> during which you can reactivate your account and
                                recover your data.
                            </li>
                            <li>
                                <strong>Permanent Deletion:</strong> After the 30-day grace period, all personal data —
                                including transaction history, goals, and account information — is permanently and
                                irreversibly deleted from our systems.
                            </li>
                            <li>
                                <strong>Immediate Deletion:</strong> You may request immediate deletion of all your data
                                at any time by contacting <strong>privacy@everobudget.com</strong>. We will process
                                the request within 72 hours.
                            </li>
                        </ul>

                        <h3>7. Your Rights</h3>
                        <h4>7.1 For All Users</h4>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of all personal data we hold about you.</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate personal information.</li>
                            <li><strong>Deletion:</strong> Request permanent deletion of your account and all associated data.</li>
                            <li><strong>Portability:</strong> Export your transaction data in a standard format (CSV/JSON).</li>
                        </ul>

                        <h4>7.2 For EEA Residents (GDPR)</h4>
                        <ul>
                            <li>Right to restrict or object to processing of your personal data.</li>
                            <li>Right to withdraw consent at any time.</li>
                            <li>Right to lodge a complaint with your local Data Protection Authority.</li>
                        </ul>

                        <h4>7.3 For California Residents (CCPA)</h4>
                        <ul>
                            <li>Right to know what personal information is collected, used, shared, or sold.</li>
                            <li>Right to request deletion of personal information.</li>
                            <li>Right to opt-out of the sale of personal information (we do not sell data).</li>
                            <li>Right to non-discrimination for exercising CCPA rights.</li>
                        </ul>

                        <h3>8. Cookies &amp; Tracking</h3>
                        <p>
                            Evero Budget uses only <strong>essential session cookies</strong> necessary for
                            authentication and maintaining your login state. We do not use tracking cookies,
                            advertising pixels, or third-party analytics platforms that profile individual users.
                        </p>

                        <h3>9. Children&apos;s Privacy</h3>
                        <p>
                            Evero Budget is not intended for use by individuals under the age of 18. We do not
                            knowingly collect personal information from children. If we become aware that we have
                            collected data from a minor, we will delete it immediately.
                        </p>

                        <h3>10. Changes to This Policy</h3>
                        <p>
                            We may update this Privacy Policy to reflect changes in our practices, technology, or
                            regulatory requirements. Material changes will be communicated via email and an in-app
                            notification at least 14 days before they take effect. The &ldquo;Last Updated&rdquo;
                            date at the top of this page reflects the most recent revision.
                        </p>

                        <h3>11. Contact Us</h3>
                        <p>For any privacy-related inquiries, data requests, or concerns:</p>
                        <ul>
                            <li><strong>Privacy Team:</strong> privacy@everobudget.com</li>
                            <li><strong>General Support:</strong> support@everobudget.com</li>
                            <li><strong>Data Protection Officer:</strong> dpo@everobudget.com</li>
                        </ul>

                        <div className="not-prose mt-10 pt-8 border-t border-border text-center">
                            <p className="text-sm text-muted-foreground">
                                Your trust is our most important asset. Thank you for choosing Evero Budget.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center border-t border-border/50">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <button onClick={() => router.push('/terms')} className="hover:text-foreground transition-colors">Terms of Service</button>
                    <span>•</span>
                    <button onClick={() => router.push('/about')} className="hover:text-foreground transition-colors">About Us</button>
                    <span>•</span>
                    <span>© 2026 Evero Budget</span>
                </div>
            </footer>
        </div>
    )
}
