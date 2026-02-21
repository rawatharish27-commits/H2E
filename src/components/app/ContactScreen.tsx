'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin,
  Send,
  Loader2,
  CheckCircle,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react'
import { useAppStore } from '@/store'

interface ContactScreenProps {
  onBack: () => void
}

export function ContactScreen({ onBack }: ContactScreenProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { darkMode } = useAppStore()

  const handleSubmit = async () => {
    if (!name || !email || !message) return
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-green-50 to-white'}`}>
        <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700' : 'border-green-100'} shadow-lg`}>
          <div className="px-4 py-3 flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className={`rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-100'}`}
            >
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
            </Button>
            <div>
              <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact Us</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>संपर्क करें</p>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring' }}
              className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Message Sent!</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>संदेश भेज दिया गया!</p>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              We'll get back to you within 24-48 hours.
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
              हम 24-48 घंटे में आपसे संपर्क करेंगे।
            </p>
            <Button 
              onClick={onBack} 
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white h-12 px-6 rounded-2xl font-semibold"
            >
              Go Back
            </Button>
          </motion.div>
        </main>
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
            onClick={onBack}
            className={`rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-orange-100'}`}
          >
            <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          </Button>
          <div>
            <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact Us</h1>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>संपर्क करें</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-8">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'} border shadow-lg h-full rounded-2xl overflow-hidden`}>
              <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600" />
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-sm`}>Call Us</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>हमें कॉल करें</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-1`}>+91 98765 43210</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-100'} border shadow-lg h-full rounded-2xl overflow-hidden`}>
              <div className="h-1.5 bg-gradient-to-r from-green-400 to-green-600" />
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-sm`}>Email</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ईमेल</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'} mt-1`}>support@help2earn.com</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'} border shadow-lg h-full rounded-2xl overflow-hidden`}>
              <div className="h-1.5 bg-gradient-to-r from-purple-400 to-purple-600" />
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-sm`}>Support Hours</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>सहायता समय</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'} mt-1`}>24/7 Available</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-lg h-full rounded-2xl overflow-hidden`}>
              <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-600" />
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-sm`}>Location</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>स्थान</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'} mt-1`}>India</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} border shadow-xl rounded-3xl overflow-hidden`}>
            <div className="h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Send us a message</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>हमें संदेश भेजें</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>Name / नाम</label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`h-12 rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-200'}`}
                  />
                </div>
                
                <div>
                  <label className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>Email / ईमेल</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-12 rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-200'}`}
                  />
                </div>
                
                <div>
                  <label className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 block`}>Message / संदेश</label>
                  <textarea
                    placeholder="How can we help you? / हम आपकी कैसे मदद कर सकते हैं?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className={`w-full border rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-200'}`}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !name || !email || !message}
                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4`}>Follow us on / हमें फॉलो करें</p>
          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-2xl w-14 h-14 ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-pink-200 hover:bg-pink-50'}`}
              >
                <Instagram className="w-6 h-6 text-pink-600" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-2xl w-14 h-14 ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-blue-200 hover:bg-blue-50'}`}
              >
                <Twitter className="w-6 h-6 text-blue-400" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-2xl w-14 h-14 ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-blue-200 hover:bg-blue-50'}`}
              >
                <Facebook className="w-6 h-6 text-blue-600" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      {/* Copyright Footer */}
      <footer className="pb-4 text-center">
        <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          © Harish Rawat
        </p>
      </footer>
    </div>
  )
}
