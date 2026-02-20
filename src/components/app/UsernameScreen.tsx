'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { User, ArrowRight, Loader2, CheckCircle, BadgeCheck, ArrowLeft } from 'lucide-react'
import { useAppStore } from '@/store'

interface UsernameScreenProps {
  onComplete: () => void
}

export function UsernameScreen({ onComplete }: UsernameScreenProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, setUser, darkMode, goBack } = useAppStore()

  const handleSubmit = async () => {
    setError('')
    
    if (!name || name.trim().length < 2) {
      setError('Please enter your name (minimum 2 characters) / कृपया अपना नाम दर्ज करें (न्यूनतम 2 अक्षर)')
      return
    }

    if (name.trim().length > 30) {
      setError('Name should be less than 30 characters / नाम 30 अक्षरों से कम होना चाहिए')
      return
    }

    if (!user?.id) {
      setError('User not found. Please try logging in again. / उपयोगकर्ता नहीं मिला। कृपया पुनः लॉगिन करें।')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: name.trim() })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setUser(data.user)
        onComplete()
      } else {
        setError(data.error || 'Failed to save name / नाम सहेजने में विफल')
      }
    } catch {
      setError('Something went wrong. Please try again. / कुछ गलत हो गया। कृपया पुनः प्रयास करें।')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-orange-50 via-white to-pink-50'}`}>
      {/* Header */}
      <header className="pt-6 px-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className={`rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <span className="text-xl">🤝</span>
          </div>
          <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Help2Earn</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white flex items-center justify-center shadow-2xl overflow-hidden"
          >
            <img 
              src="/logo-handshake.png" 
              alt="Help2Earn Logo" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            What's Your Name?
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            आपका नाम क्या है?
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-3 max-w-xs mx-auto`}>
            This will be shown to other users when you help them or get help
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
            यह दूसरे उपयोगकर्ताओं को दिखाया जाएगा जब आप उनकी मदद करेंगे या मदद लेंगे
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-2xl rounded-3xl overflow-hidden`}>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div>
                  <label className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-2`}>आपका नाम</p>
                  <Input
                    type="text"
                    placeholder="Enter your name / अपना नाम दर्ज करें"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`h-14 text-lg rounded-2xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-200 text-gray-900 placeholder:text-gray-400'} focus:border-orange-500 focus:ring-orange-500`}
                    maxLength={30}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{name.length}/30 characters / अक्षर</p>
                    {name.length >= 2 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Valid / वैध</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || name.trim().length < 2}
                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <BadgeCheck className="w-5 h-5 mr-2" />
                        Save & Continue / सहेजें और आगे बढ़ें
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
        >
          <p className="text-sm">Your name helps build trust in the community</p>
          <p className="text-xs mt-1">आपका नाम समुदाय में विश्वास बनाने में मदद करता है</p>
        </motion.div>
      </div>
    </div>
  )
}
