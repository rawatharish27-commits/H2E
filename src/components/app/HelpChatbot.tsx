'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Sparkles,
  Trash2,
  HelpCircle
} from 'lucide-react'
import { useAppStore } from '@/store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Generate unique session ID
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function HelpChatbot() {
  const { darkMode } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(generateSessionId())
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: ` Namaste! Main HelpBot hoon, aapka Help2Earn assistant. 🙏

Main aapki madad kar sakta hoon:
• App kaise kaam karti hai samjhne mein
• Paise kaise kamaye ja sakte hain
• Konse resources use kar sakte ho
• Trust score kaise badhayen

Aapka sawaal pucho! 😊`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Send message to API
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage.content
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Maaf kijiye, kuch gadbad ho gayi. Please dobara try karein. 🙏',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Clear conversation
  const clearConversation = async () => {
    try {
      await fetch(`/api/chatbot?sessionId=${sessionId}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to clear conversation:', error)
    }
    
    const welcomeMessage: Message = {
      id: 'welcome_new',
      role: 'assistant',
      content: `Chat clear ho gaya! Naya sawaal pucho? 🔄`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  // Quick suggestions
  const quickSuggestions = [
    { text: "Paise kaise kamau?", hi: "पैसे कैसे कमाऊं?" },
    { text: "App kaise kaam karti hai?", hi: "ऐप कैसे काम करती है?" },
    { text: "Kya resources chahiye?", hi: "क्या रिसोर्सेस चाहिए?" },
    { text: "Trust score kaise badhau?", hi: "ट्रस्ट स्कोर कैसे बढ़ाऊं?" },
  ]

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center ${
          isOpen ? 'hidden' : ''
        } bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 text-white`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed inset-4 md:inset-auto md:bottom-20 md:right-4 md:w-96 md:h-[600px] z-50 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
              darkMode ? 'border-gray-700' : 'border-purple-100'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">HelpBot</h3>
                    <p className="text-xs text-white/80">Aapka Help2Earn Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearConversation}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-orange-500 text-white rounded-2xl rounded-tr-md'
                        : darkMode
                          ? 'bg-gray-700 text-gray-100 rounded-2xl rounded-tl-md'
                          : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-md'
                    } p-3 text-sm whitespace-pre-wrap`}>
                      {message.content}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className={`p-3 rounded-2xl rounded-tl-md ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
              <div className={`px-4 pb-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(suggestion.text)
                        inputRef.current?.focus()
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border ${
                        darkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                      } transition-colors`}
                    >
                      {suggestion.hi}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Sawaal pucho..."
                  className={`flex-1 h-11 rounded-xl ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-11 h-11 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
