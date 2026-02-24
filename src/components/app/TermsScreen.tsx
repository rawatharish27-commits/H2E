'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface TermsScreenProps {
  onBack: () => void
  onAccept?: () => void
  showAccept?: boolean
}

export function TermsScreen({ onBack, onAccept, showAccept = false }: TermsScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Terms & Conditions</h1>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 space-y-6 pb-32"
      >
        {/* Introduction */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Scale className="w-5 h-5 text-orange-500" />
            Help2Earn - Terms of Service
          </h2>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        {/* Section 1: Platform Nature */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            1. Platform Nature (Important)
          </h3>
          <div className="bg-card rounded-xl border border-border p-4 space-y-3 text-sm">
            <p>
              <strong>HelpPe DailyEarn ek DISCOVERY PLATFORM hai, service provider NAHI.</strong>
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>App sirf nearby helpers ko connect karti hai</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Direct phone call pe discussion hoti hai</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Payment app ke bahar (cash/UPI) hota hai</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>App kisi bhi service ki guarantee NAHI deti</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>App service quality ke responsible NAHI hai</span>
              </li>
            </ul>
          </div>
        </section>

        <Separator />

        {/* Section 2: User Responsibilities */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base">2. User Responsibilities</h3>
          <div className="bg-card rounded-xl border border-border p-4 space-y-3 text-sm">
            <p className="font-medium text-amber-600">As a User, you agree to:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Provide accurate information</li>
              <li>Not post illegal or dangerous requests</li>
              <li>Respect helpers and other users</li>
              <li>Pay agreed amount after service</li>
              <li>Report any issues honestly</li>
              <li>Not misuse the platform for fraudulent activities</li>
            </ul>
            
            <p className="font-medium text-amber-600 mt-4">As a Helper, you agree to:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Reach on time after accepting</li>
              <li>Provide honest service</li>
              <li>Not overcharge or exploit users</li>
              <li>Maintain professional behavior</li>
              <li>Three no-shows = account restriction</li>
            </ul>
          </div>
        </section>

        <Separator />

        {/* Section 3: Subscription */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base">3. Subscription (₹49/month)</h3>
          <div className="bg-card rounded-xl border border-border p-4 space-y-3 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>₹49 monthly subscription for platform access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Payment via UPI (outside app)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Manual approval within 2-4 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Refund policy: Case-by-case basis</span>
              </li>
            </ul>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-3">
              <p className="text-xs text-yellow-600">
                <strong>Note:</strong> Subscription fee is for platform access only. 
                It does not guarantee any specific earnings or service quality.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Section 4: Trust Score */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base">4. Trust Score System</h3>
          <div className="bg-card rounded-xl border border-border p-4 space-y-3 text-sm">
            <p>
              Trust score (0-100) determines your visibility and access:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                <span className="font-medium">Trusted (70+)</span>
                <span className="text-green-600">Full access</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded">
                <span className="font-medium">Neutral (40-69)</span>
                <span className="text-yellow-600">Normal access</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-500/10 rounded">
                <span className="font-medium">Restricted (&lt;40)</span>
                <span className="text-red-600">Limited access</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">
              Trust score changes based on: Successful helps (+3), No-show (-10), Reports (-15)
            </p>
          </div>
        </section>

        <Separator />

        {/* Section 5: Prohibited Activities */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            5. Prohibited Activities
          </h3>
          <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-4 space-y-3 text-sm">
            <p className="font-medium text-red-600">Strictly Prohibited:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>Fake accounts or multiple accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>GPS spoofing or fake location</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>Weapons, drugs, or illegal services</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>Fraud, theft, or harassment</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>Fake payment claims</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>Spam or timepass requests</span>
              </li>
            </ul>
            <p className="text-xs text-red-500 mt-3">
              Violations may result in: Warning, Trust reduction, Account restriction, or Permanent ban.
            </p>
          </div>
        </section>

        <Separator />

        {/* Section 6: Liability */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base">6. Liability Disclaimer</h3>
          <div className="bg-card rounded-xl border border-border p-4 space-y-3 text-sm">
            <p>
              <strong>HelpPe DailyEarn is NOT liable for:</strong>
            </p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Any disputes between users and helpers</li>
              <li>Service quality or completion</li>
              <li>Payment disputes (handled outside app)</li>
              <li>Any harm, loss, or damage during service</li>
              <li>Third-party actions or behavior</li>
            </ul>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
              <p className="text-xs text-blue-600">
                <strong>SOS Feature:</strong> Emergency alerts are forwarded to admins. 
                Response time depends on availability. In life-threatening situations, 
                please contact local emergency services (100/112/108) first.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Section 7: Account Termination */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base">7. Account Termination</h3>
          <div className="bg-card rounded-xl border border-border p-4 space-y-3 text-sm">
            <p>We may suspend or terminate accounts that:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Violate these terms repeatedly</li>
              <li>Engage in fraudulent activities</li>
              <li>Receive multiple valid reports</li>
              <li>Have trust score below 20</li>
              <li>Are involved in illegal activities</li>
            </ul>
          </div>
        </section>

        <Separator />

        {/* Section 8: Contact */}
        <section className="space-y-3">
          <h3 className="font-semibold text-base">8. Contact & Support</h3>
          <div className="bg-card rounded-xl border border-border p-4 text-sm">
            <p>For any concerns or disputes:</p>
            <ul className="space-y-2 mt-2">
              <li><strong>Email:</strong> support@helppe.app</li>
              <li><strong>Response Time:</strong> Within 24-48 hours</li>
            </ul>
          </div>
        </section>

        {/* Accept Button */}
        {showAccept && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border"
          >
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
              onClick={onAccept}
            >
              I Accept Terms & Conditions
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              By accepting, you agree to all terms mentioned above
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
