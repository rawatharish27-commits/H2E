'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Scale, AlertTriangle, Shield, FileText, Gavel, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/store'

export function LegalScreen() {
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
            <h1 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal & Disclaimer</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>कानूनी और अस्वीकरण</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 space-y-6 pb-32"
      >
        {/* Header Card */}
        <div className={`rounded-2xl p-5 ${darkMode ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal Information</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Governing Law: India</p>
            </div>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            This legal page is drafted in accordance with Indian laws including the Information Technology Act, 2000, Consumer Protection Act, 2019, and Indian Contract Act, 1872.
          </p>
        </div>

        {/* Section 1: Company Information */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Building className="w-5 h-5 text-blue-500" />
            1. Company Information
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="space-y-2 text-sm">
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}><strong>Platform Name:</strong> Community Help Network</p>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}><strong>Type:</strong> Hyper-local Discovery Platform</p>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}><strong>Jurisdiction:</strong> India</p>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}><strong>Support Email:</strong> support@communityhelpnetwork.app</p>
            </div>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 2: Disclaimer */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <AlertTriangle className="w-5 h-5 text-red-500" />
            2. Important Disclaimer
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border`}>
            <div className="space-y-3 text-sm">
              <p className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                PLEASE READ THIS CAREFULLY:
              </p>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• <strong>Community Help Network is a DISCOVERY PLATFORM only</strong></li>
                <li>• We connect users who need help with nearby helpers</li>
                <li>• We do NOT provide any services ourselves</li>
                <li>• We do NOT guarantee service quality or completion</li>
                <li>• We do NOT handle service payments</li>
                <li>• All transactions happen outside the app (cash/UPI)</li>
              </ul>
            </div>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 3: No Liability */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Shield className="w-5 h-5 text-orange-500" />
            3. Limitation of Liability
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Under Section 79 of the Information Technology Act, 2000, as an intermediary, Community Help Network:
            </p>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Is NOT liable for third-party content or actions</li>
              <li>• Does NOT initiate service transactions</li>
              <li>• Does NOT modify user communications</li>
              <li>• Does NOT select or influence helpers/users</li>
            </ul>
            <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
              <p className={`text-xs ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                <strong>We are NOT responsible for:</strong> Service quality, delays, disputes, payments, damages, or any harm caused during service provision.
              </p>
            </div>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 4: User Agreement */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FileText className="w-5 h-5 text-green-500" />
            4. User Agreement
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              By using this platform, you agree that:
            </p>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• You are 18 years or older</li>
              <li>• You will provide accurate information</li>
              <li>• You will not use the platform for illegal activities</li>
              <li>• You understand we are not a service provider</li>
              <li>• You will resolve disputes directly with other users</li>
              <li>• You will indemnify us against claims arising from your actions</li>
            </ul>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 5: Consumer Protection */}
        <section className="space-y-3">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Gavel className="w-5 h-5 text-purple-500" />
            5. Consumer Protection Act, 2019
          </h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Under the Consumer Protection Act, 2019:
            </p>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Community Help Network is a technology platform, not a service provider</li>
              <li>• Users transact at their own risk</li>
              <li>• Consumer disputes should be resolved between parties</li>
              <li>• For grievances, contact: grievance@communityhelpnetwork.app</li>
            </ul>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 6: Prohibited Activities */}
        <section className="space-y-3">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>6. Prohibited Activities</h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              The following are strictly prohibited and may result in account suspension and legal action:
            </p>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="text-red-500">• Fraud or fake payment claims</li>
              <li className="text-red-500">• GPS spoofing or fake location</li>
              <li className="text-red-500">• Multiple accounts</li>
              <li className="text-red-500">• Harassment or threatening behavior</li>
              <li className="text-red-500">• Illegal services or items (weapons, drugs)</li>
              <li className="text-red-500">• Sexual services or exploitation</li>
              <li className="text-red-500">• Money laundering activities</li>
            </ul>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 7: Indemnity */}
        <section className="space-y-3">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>7. Indemnity</h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              You agree to indemnify and hold harmless Community Help Network, its officers, employees, and agents from any claims, damages, losses, or expenses arising from:
            </p>
            <ul className={`mt-3 space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Your use of the platform</li>
              <li>• Your violation of these terms</li>
              <li>• Your violation of any third-party rights</li>
              <li>• Any service-related disputes</li>
            </ul>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 8: Dispute Resolution */}
        <section className="space-y-3">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>8. Dispute Resolution</h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              In case of disputes:
            </p>
            <ol className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} list-decimal list-inside`}>
              <li>First, try to resolve directly with the other party</li>
              <li>If unresolved, contact our grievance officer within 30 days</li>
              <li>We will attempt mediation within 15 working days</li>
              <li>If still unresolved, disputes will be subject to arbitration under the Arbitration and Conciliation Act, 1996</li>
              <li>Jurisdiction: Courts in [Your City], India</li>
            </ol>
          </div>
        </section>

        <Separator className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />

        {/* Section 9: Intellectual Property */}
        <section className="space-y-3">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>9. Intellectual Property</h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Community Help Network logo and brand are protected under Indian Copyright Act, 1957</li>
              <li>• User content posted remains user's property</li>
              <li>• By posting, users grant us license to display content on platform</li>
            </ul>
          </div>
        </section>

        {/* Contact Section */}
        <section className="space-y-3">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact for Legal Matters</h3>
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} border`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>For legal queries:</strong> legal@communityhelpnetwork.app<br/>
              <strong>For grievances:</strong> grievance@communityhelpnetwork.app<br/>
              <strong>Response time:</strong> 48 working hours
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  )
}
