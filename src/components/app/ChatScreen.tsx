'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Send, 
  Loader2,
  Wifi,
  WifiOff,
  User
} from 'lucide-react'
import { useAppStore } from '@/store'
import { 
  getSocket, 
  joinProblemRoom, 
  leaveProblemRoom, 
  sendChatMessage,
  subscribe 
} from '@/lib/socket'

interface ChatMessage {
  id: string
  problemId: string
  senderId: string
  message: string
  createdAt: Date
  sender: {
    id: string
    name: string | null
    avatar: string | null
  }
}

interface ChatScreenProps {
  problemId: string
}

export function ChatScreen({ problemId }: ChatScreenProps) {
  const { user, setScreen } = useAppStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${problemId}`)
        const data = await res.json()
        
        if (data.success) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMessages()
  }, [problemId])
  
  // Setup socket connection
  useEffect(() => {
    if (!user) return
    
    // Initialize socket with token
    const token = localStorage.getItem('help2earn-storage')
    const parsedToken = token ? JSON.parse(token)?.state?.token : null
    
    const socket = getSocket(parsedToken)
    
    // Join problem room
    joinProblemRoom(problemId)
    
    // Connection status
    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))
    
    // Listen for new messages
    const unsubscribe = subscribe('chat:message', (data) => {
      if (data.problemId === problemId) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          problemId: data.problemId,
          senderId: data.senderId,
          message: data.message,
          createdAt: new Date(data.timestamp),
          sender: {
            id: data.senderId,
            name: data.senderName,
            avatar: null
          }
        }])
      }
    })
    
    // Check initial connection status
    setIsConnected(socket.connected)
    
    return () => {
      unsubscribe()
      leaveProblemRoom(problemId)
    }
  }, [problemId, user])
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])
  
  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || isSending) return
    
    setIsSending(true)
    
    try {
      // Send via API
      const res = await fetch(`/api/chat/${problemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() })
      })
      
      if (res.ok) {
        // Also send via socket for real-time
        sendChatMessage(
          problemId,
          newMessage.trim(),
          user.id,
          user.name || 'User'
        )
        
        setNewMessage('')
        inputRef.current?.focus()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }
  
  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 border-b z-50">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setScreen('problem-detail')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="font-bold text-gray-900 dark:text-white">Chat</h1>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-red-500" />
                  <span className="text-red-500">Disconnected</span>
                </>
              )}
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {messages.length} messages
          </Badge>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <ScrollArea ref={scrollRef} className="h-full p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isOwnMessage = msg.senderId === user?.id
                  
                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={isOwnMessage ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}>
                          {msg.sender?.name?.[0] || <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[70%] ${isOwnMessage ? 'text-right' : ''}`}>
                        <div className={`rounded-2xl px-4 py-2 ${
                          isOwnMessage 
                            ? 'bg-orange-500 text-white rounded-tr-none' 
                            : 'bg-white dark:bg-gray-800 rounded-tl-none shadow'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 px-1">
                          {!isOwnMessage && (msg.sender?.name || 'User')} • {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      
      {/* Input */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-12 rounded-xl"
            disabled={!isConnected || isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected || isSending}
            className="h-12 w-12 rounded-xl bg-orange-500 hover:bg-orange-600"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
