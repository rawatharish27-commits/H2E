'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Eye, Database, Shield, Bell, UserX, Mail, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/store'

export function PrivacyScreen() {
  const { setScreen, darkMode } = useAppStore()

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => setScreen('home')}>
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div>
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>गोपनीयता नीति</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 space-y-6 pb-32"
      >
        {/* Header Card */}
        <div className={`rounded-2xl p-5 ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-800' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help2Earn Privacy Policy</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Updated: January 2025</p>
            </div>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            This policy is drafted in compliance with the Information Technology Act, 2000 and Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
          </p>
        </div>

        {/* Section 1: Information Collected */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Database className="w-5 h-5 text-blue-500" />
            1. Information We Collect
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="space-y-4">
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information:</p>
                <ul className={`mt-2 space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• Mobile number (verified via OTP)</li>
                  <li>• Name (self-declared)</li>
                  <li>• Profile photo (optional)</li>
                </ul>
              </div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Location Data:</p>
                <ul className={`mt-2 space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• GPS coordinates (only when app is open)</li>
                  <li>• Used for nearby problem matching</li>
                  <li>• NOT stored or shared with third parties</li>
                </ul>
              </div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Usage Data:</p>
                <ul className={`mt-2 space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• Problem posts and responses</li>
                  <li>• Trust score history</li>
                  <li>• App usage patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 2: How We Use Information */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Eye className="w-5 h-5 text-green-500" />
            2. How We Use Your Information
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Connect you with nearby helpers/users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Verify your identity via OTP</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Calculate and display trust score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Process subscription payments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Send important notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Prevent fraud and abuse</span>
              </li>
            </ul>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 3: Information Sharing */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Shield className="w-5 h-5 text-orange-500" />
            3. Information Sharing
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>We share limited information with:</p>
            <div className="space-y-3 text-sm">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <p className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Helpers (when you post a problem):</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your phone number (only after "Ready to Help" is clicked)</p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <p className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Law Enforcement:</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Only if required by Indian law</p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                <p className={`font-medium ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>We NEVER:</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Sell your data to third parties</p>
              </div>
            </div>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 4: Data Security */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Lock className="w-5 h-5 text-purple-500" />
            4. Data Security
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• All data transmitted over HTTPS encryption</li>
              <li>• OTP verification for secure login</li>
              <li>• JWT tokens with secure HTTP-only cookies</li>
              <li>• Regular security audits</li>
              <li>• GPS spoof detection for fraud prevention</li>
            </ul>
            <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
              <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                As per IT Act 2000, we follow reasonable security practices to protect your sensitive personal data.
              </p>
            </div>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 5: Your Rights */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <UserX className="w-5 h-5 text-red-500" />
            5. Your Rights
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>You have the right to:</p>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Access your personal data</li>
              <li>• Correct inaccurate information</li>
              <li>• Request account deletion</li>
              <li>• Withdraw consent anytime</li>
              <li>• Lodge complaint with Grievance Officer</li>
            </ul>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 6: Grievance Officer */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Mail className="w-5 h-5 text-blue-500" />
            6. Grievance Officer (India)
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              As per IT Rules 2011, you may contact our Grievance Officer:
            </p>
            <div className={`mt-3 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Grievance Officer</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email: grievance@help2earn.app</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Response Time: Within 48 hours</p>
            </div>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 7: Children's Privacy */}
        <section className="space-y-3">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>7. Children's Privacy</h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Our services are not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 8: Changes */}
        <section className="space-y-3">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>8. Changes to Policy</h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We may update this policy periodically. Continued use of the app constitutes acceptance of any changes. Major changes will be notified via app notification.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  )
}
