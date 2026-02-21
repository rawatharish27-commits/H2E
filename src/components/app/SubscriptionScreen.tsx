'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  CheckCircle, 
  Shield,
  Copy,
  Loader2,
  QrCode,
  Smartphone
} from 'lucide-react'
import { useAppStore } from '@/store'

// Payment apps configuration with real brand colors and deep links
const PAYMENT_APPS = [
  { 
    name: 'PhonePe', 
    color: '#5F259F', 
    bgColor: 'bg-[#5F259F]',
    deepLink: 'phonepe://pay',
    upiLink: (upi: string, name: string, amount: number, note: string) => 
      `phonepe://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
  },
  { 
    name: 'Google Pay', 
    color: '#4285F4', 
    bgColor: 'bg-[#4285F4]',
    deepLink: 'gpay://upi/pay',
    upiLink: (upi: string, name: string, amount: number, note: string) => 
      `gpay://upi/pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
  },
  { 
    name: 'Paytm', 
    color: '#00BAF2', 
    bgColor: 'bg-[#00BAF2]',
    deepLink: 'paytmmp://pay',
    upiLink: (upi: string, name: string, amount: number, note: string) => 
      `paytmmp://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
  },
  { 
    name: 'BHIM UPI', 
    color: '#00875F', 
    bgColor: 'bg-[#00875F]',
    deepLink: 'upi://pay',
    upiLink: (upi: string, name: string, amount: number, note: string) => 
      `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
  },
  { 
    name: 'Amazon Pay', 
    color: '#FF9900', 
    bgColor: 'bg-[#FF9900]',
    deepLink: 'amazonpay://upi/pay',
    upiLink: (upi: string, name: string, amount: number, note: string) => 
      `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
  }
]

export function SubscriptionScreen() {
  const [upiId, setUpiId] = useState('')
  const [transactionRef, setTransactionRef] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const { user, setScreen, darkMode, goBack } = useAppStore()

  // Get UPI ID from environment variable (with fallback)
  const adminUpi = process.env.NEXT_PUBLIC_UPI_ID || 'rentforhelp@upi'
  const payeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'Community Help Network'
  const amount = 49
  const transactionNote = 'Community Help Network Subscription'

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminUpi)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Open specific payment app with UPI deep link
  const openPaymentApp = (app: typeof PAYMENT_APPS[0]) => {
    const upiLink = app.upiLink(adminUpi, payeeName, amount, transactionNote)
    
    // Try app-specific deep link first, then fallback to UPI protocol
    const startTime = Date.now()
    
    // Open the UPI link
    window.location.href = upiLink
    
    // Fallback: If app doesn't open in 2 seconds, show instructions
    setTimeout(() => {
      if (Date.now() - startTime < 2500) {
        // App didn't open, try generic UPI
        window.location.href = `upi://pay?pa=${adminUpi}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`
      }
    }, 2000)
  }

  // Open any UPI app (system chooser)
  const openAnyUpiApp = () => {
    const upiLink = `upi://pay?pa=${adminUpi}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`
    window.location.href = upiLink
  }

  const handleSubmit = async () => {
    setError('')
    if (!user) return

    setIsLoading(true)
    
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          upiId,
          transactionRef
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setIsSubmitted(true)
      } else {
        setError(data.error || 'Failed to submit payment')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-green-50 to-white'}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Request Sent!
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            Aapka request aa gaya hai
          </p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6 text-center`}>
            Admin will verify within 2-4 hours. You'll be notified once approved.
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
            Admin 2-4 ghante me verify karega.
          </p>
          
          <Button
            onClick={() => setScreen('home')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white h-14 rounded-2xl font-bold px-8"
          >
            Theek hai, samajh gaya
          </Button>
        </motion.div>
        
        {/* Copyright */}
        <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'} mt-8`}>
          © Harish Rawat
        </p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700' : 'border-purple-100'} shadow-lg`}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className={`rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div>
            <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Community Network</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Is area ka hissa bano</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {/* QR Code & Pay Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'} border shadow-xl rounded-2xl overflow-hidden`}>
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-6 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg"
                onClick={openAnyUpiApp}
              >
                <QrCode className="w-12 h-12 text-purple-500" />
              </motion.div>
              
              <h2 className="text-xl font-bold mb-1">Tap to Pay ₹{amount}</h2>
              <p className="text-white/80 text-sm">QR Code pe click karo</p>
            </div>
            
            <CardContent className="p-4">
              {/* Quick Pay Button */}
              <Button
                onClick={openAnyUpiApp}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl shadow-xl mb-4"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Pay with UPI App
              </Button>

              {/* Payment Apps */}
              <div className="mb-4">
                <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Or choose your app:</p>
                <div className="grid grid-cols-5 gap-3">
                  {PAYMENT_APPS.map((app) => (
                    <motion.button
                      key={app.name}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openPaymentApp(app)}
                      className={`flex flex-col items-center p-3 rounded-2xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-all shadow-sm hover:shadow-md`}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md"
                        style={{ backgroundColor: app.color }}
                      >
                        {/* App name first letter as icon */}
                        <span className="text-white font-bold text-lg">
                          {app.name.charAt(0)}
                        </span>
                      </div>
                      <span className={`text-[10px] font-medium leading-tight text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {app.name.split(' ')[0]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* UPI ID Display */}
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-purple-50'} border ${darkMode ? 'border-gray-600' : 'border-purple-200'}`}>
                <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>UPI ID:</p>
                <div className="flex items-center justify-between">
                  <code className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminUpi}</code>
                  <Button variant="ghost" size="sm" onClick={handleCopyUpi} className="rounded-lg">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'} border shadow-xl rounded-2xl`}>
            <CardContent className="p-4">
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                After Payment - Submit Details
              </h3>
              <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment ke baad details submit karo</p>
              
              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                    Aapka UPI ID
                  </label>
                  <Input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className={`h-11 rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : ''}`}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1 block`}>
                    Transaction ID (Optional)
                  </label>
                  <Input
                    placeholder="From payment app"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className={`h-11 rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : ''}`}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</p>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !upiId}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Maine Pay Kar Diya
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-4 flex items-center justify-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}
        >
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure UPI payment • 2-4 hours verification</span>
        </motion.div>
      </main>
      
      {/* Copyright Footer */}
      <footer className={`sticky bottom-0 py-3 px-4 text-right ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-t`}>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          © Harish Rawat
        </p>
      </footer>
    </div>
  )
}
