'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Shield,
  Copy,
  Loader2,
  Users,
  MapPin,
  HandHeart,
  Sparkles
} from 'lucide-react'
import { useAppStore } from '@/store'

export function SubscriptionScreen() {
  const [upiId, setUpiId] = useState('')
  const [transactionRef, setTransactionRef] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { user, setScreen, darkMode } = useAppStore()

  const adminUpi = 'rentforhelp@upi'
  const amount = 49

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminUpi)
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
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700' : 'border-orange-100'} shadow-lg`}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setScreen('home')}
            className={`rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-orange-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div>
            <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Community Network</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Is area ka hissa bano</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {/* Philosophy Card - Not a Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border-0 shadow-xl rounded-3xl overflow-hidden`}>
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center"
              >
                <Users className="w-8 h-8" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">
                Is area ke madad network ka hissa bano
              </h2>
              <p className="text-white/80 text-sm">
                Become part of this area's help network
              </p>
            </div>
            
            <CardContent className="p-5">
              <div className="text-center mb-4">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Yeh koi feature nahi hai. Yeh ek <strong>entry gate</strong> hai.
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                  This is not a feature. This is an entry gate.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-orange-100 text-orange-700 text-base px-4 py-2">
                  ₹{amount}/month
                </Badge>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  (sirf verification & filtering ke liye)
                </span>
              </div>
              
              {/* What this means */}
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Nearby log dikhenge</p>
                    <p className="text-xs opacity-70">You'll see nearby people</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Verified padosi</p>
                    <p className="text-xs opacity-70">Verified neighbors only</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HandHeart className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Aapas me madad</p>
                    <p className="text-xs opacity-70">Community helps each other</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Silent Rule Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Card className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-800' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100'} border rounded-2xl shadow-lg`}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ek Important Baat</h3>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-2`}>
                <strong>Yahan professional nahi, insaan madad karta hai.</strong>
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Here, not professionals, but humans help. No fancy profiles, no flashy prices - just simple people helping each other.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-xl rounded-2xl`}>
            <CardContent className="p-5">
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <CreditCard className="w-5 h-5 text-orange-600" />
                Kaise Join Karein
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>How to Join</p>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Is UPI pe ₹{amount} bhejein</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Send ₹{amount} to this UPI</p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-2 rounded-xl text-sm font-mono`}>
                        {adminUpi}
                      </code>
                      <Button variant="ghost" size="sm" onClick={handleCopyUpi} className="rounded-xl">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Neeche apna UPI ID batao</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Share your UPI ID below</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>2-4 ghante me verify ho jaoge</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You'll be verified in 2-4 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-xl rounded-2xl`}>
            <CardContent className="p-5">
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Payment Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>
                    Aapka UPI ID
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Your UPI ID</p>
                  <Input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className={`h-14 rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>
                    Transaction ID (Optional)
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Payment app se ID</p>
                  <Input
                    placeholder="Transaction ID from payment app"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className={`h-14 rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</p>
                )}

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !upiId}
                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Maine Pay Kar Diya - Submit
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-6 flex items-center justify-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}
        >
          <Shield className="w-5 h-5 text-green-500" />
          <span>Secure UPI payment • Yeh community ke liye hai</span>
        </motion.div>
        
        <p className={`text-center text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'} mt-2`}>
          "Hum kaam nahi dete, hum logon ko ek dusre ke kaam ka banate hain."
        </p>
        <p className={`text-center text-xs ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>
          We don't give work, we connect people to each other's work.
        </p>
      </main>
    </div>
  )
}
