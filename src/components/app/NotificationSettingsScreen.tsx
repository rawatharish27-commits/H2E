'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  Moon,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Settings,
  History,
  ChevronRight,
  Zap,
  Package,
  Info
} from 'lucide-react'
import { useAppStore } from '@/store'
import { formatDate, ProblemType } from '@/types'

interface NotificationPreferences {
  whatsappEnabled: boolean
  whatsappNumber: string | null
  quietHoursStart: string | null
  quietHoursEnd: string | null
  notificationTypes: string[]
}

interface NotificationHistoryItem {
  id: string
  problemId: string
  status: string
  sentAt: Date | null
  createdAt: Date
  problem: {
    id: string
    title: string
    type: string
    category: string | null
  }
}

export function NotificationSettingsScreen() {
  const { user, setScreen } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    whatsappEnabled: false,
    whatsappNumber: null,
    quietHoursStart: null,
    quietHoursEnd: null,
    notificationTypes: []
  })
  const [history, setHistory] = useState<NotificationHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false)
  const [quietHoursStart, setQuietHoursStart] = useState('22:00')
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00')

  const problemTypes = [
    { id: 'EMERGENCY', label: 'Emergency', labelHi: 'आपातकाल', icon: '🚨' },
    { id: 'TIME_ACCESS', label: 'Time/Access', labelHi: 'समय/पहुंच', icon: '⏰' },
    { id: 'RESOURCE_RENT', label: 'Resource/Rent', labelHi: 'संसाधन/किराया', icon: '📦' }
  ]

  // Fetch preferences on mount
  useEffect(() => {
    fetchPreferences()
    fetchHistory()
  }, [user?.id])

  const fetchPreferences = async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/notifications/whatsapp?userId=${user.id}&action=preferences`)
      const data = await res.json()
      if (data.success) {
        setPreferences(data.data)
        setWhatsappNumber(data.data.whatsappNumber || '')
        setQuietHoursEnabled(!!data.data.quietHoursStart || !!data.data.quietHoursEnd)
        setQuietHoursStart(data.data.quietHoursStart || '22:00')
        setQuietHoursEnd(data.data.quietHoursEnd || '07:00')
      }
    } catch (err) {
      console.error('Failed to fetch preferences:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchHistory = async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`/api/notifications/whatsapp?userId=${user.id}&action=history&limit=20`)
      const data = await res.json()
      if (data.success) {
        setHistory(data.data.history)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const handleToggleWhatsApp = async (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, whatsappEnabled: enabled }))
    await savePreferences({ whatsappEnabled: enabled })
  }

  const handleToggleProblemType = async (typeId: string) => {
    const currentTypes = preferences.notificationTypes
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(t => t !== typeId)
      : [...currentTypes, typeId]
    
    setPreferences(prev => ({ ...prev, notificationTypes: newTypes }))
    await savePreferences({ notificationTypes: newTypes })
  }

  const handleSaveWhatsAppNumber = async () => {
    if (!whatsappNumber.trim()) return
    await savePreferences({ whatsappNumber: whatsappNumber.trim() })
  }

  const handleSaveQuietHours = async () => {
    await savePreferences({
      quietHoursStart: quietHoursEnabled ? quietHoursStart : null,
      quietHoursEnd: quietHoursEnabled ? quietHoursEnd : null
    })
  }

  const savePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user?.id) return
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/notifications/whatsapp', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...updates
        })
      })

      const data = await res.json()

      if (data.success) {
        setPreferences(data.data)
        setSuccess('Settings saved! / सेटिंग्स सेव हो गईं!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.error || 'Failed to save settings')
      }
    } catch (err) {
      setError('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <Badge className="bg-green-500/20 text-green-600">Sent</Badge>
      case 'DELIVERED':
        return <Badge className="bg-blue-500/20 text-blue-600">Delivered</Badge>
      case 'FAILED':
        return <Badge className="bg-red-500/20 text-red-600">Failed</Badge>
      case 'READ':
        return <Badge className="bg-purple-500/20 text-purple-600">Read</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground">Pending</Badge>
    }
  }

  const getProblemTypeIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'TIME_ACCESS':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'RESOURCE_RENT':
        return <Package className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-card/80 backdrop-blur-lg border-b z-50">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setScreen('profile')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold">Notification Settings</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            className={`flex-1 ${activeTab === 'settings' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            className={`flex-1 ${activeTab === 'history' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert className="mb-4 bg-red-500/10 border-red-500/30">
                <XCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert className="mb-4 bg-green-500/10 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'settings' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* WhatsApp Enable Toggle */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">WhatsApp Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified jab koi help chahiye
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.whatsappEnabled}
                    onCheckedChange={handleToggleWhatsApp}
                    disabled={isSaving}
                  />
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Number */}
            <AnimatePresence>
              {preferences.whatsappEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">WhatsApp Number</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="+91 9876543210"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          disabled={isSaving}
                        />
                        <Button
                          onClick={handleSaveWhatsAppNumber}
                          disabled={isSaving || !whatsappNumber.trim()}
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Include country code (e.g., +91 for India)
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quiet Hours */}
            <AnimatePresence>
              {preferences.whatsappEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Quiet Hours
                        </CardTitle>
                        <Switch
                          checked={quietHoursEnabled}
                          onCheckedChange={(enabled) => {
                            setQuietHoursEnabled(enabled)
                            handleSaveQuietHours()
                          }}
                          disabled={isSaving}
                        />
                      </div>
                    </CardHeader>
                    <AnimatePresence>
                      {quietHoursEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              No notifications during these hours / Is time mein notifications nahi
                            </p>
                            <div className="flex gap-4 items-center">
                              <div className="flex-1">
                                <Label className="text-xs text-muted-foreground">From</Label>
                                <Input
                                  type="time"
                                  value={quietHoursStart}
                                  onChange={(e) => setQuietHoursStart(e.target.value)}
                                  disabled={isSaving}
                                />
                              </div>
                              <span className="mt-5">to</span>
                              <div className="flex-1">
                                <Label className="text-xs text-muted-foreground">To</Label>
                                <Input
                                  type="time"
                                  value={quietHoursEnd}
                                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                                  disabled={isSaving}
                                />
                              </div>
                            </div>
                            <Button
                              onClick={handleSaveQuietHours}
                              disabled={isSaving}
                              variant="outline"
                              className="w-full"
                            >
                              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                              Save Quiet Hours
                            </Button>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Problem Types */}
            <AnimatePresence>
              {preferences.whatsappEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Problem Types
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        Select which types of problems you want to be notified about
                      </p>
                      {problemTypes.map((type) => (
                        <button
                          key={type.id}
                          className={`w-full p-3 rounded-lg border flex items-center justify-between transition-colors ${
                            preferences.notificationTypes.includes(type.id)
                              ? 'bg-orange-500/10 border-orange-500/30'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleToggleProblemType(type.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{type.icon}</span>
                            <div className="text-left">
                              <p className="font-medium">{type.label}</p>
                              <p className="text-xs text-muted-foreground">{type.labelHi}</p>
                            </div>
                          </div>
                          {preferences.notificationTypes.includes(type.id) && (
                            <CheckCircle className="w-5 h-5 text-orange-500" />
                          )}
                        </button>
                      ))}
                      <p className="text-xs text-muted-foreground mt-2">
                        Tip: Select all to get notified for everything / Sab select karo
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card */}
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-blue-600 mb-1">How it works</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Notifications are sent for problems within 20 KM</li>
                      <li>• Maximum 5 notifications per day to avoid spam</li>
                      <li>• Your number is never shared with others</li>
                      <li>• You can disable anytime</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Notification History */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Notification History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {history.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                    <p className="text-xs mt-1">Abhi tak koi notification nahi aayi</p>
                  </div>
                ) : (
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            {getProblemTypeIcon(item.problem.type)}
                            <div>
                              <p className="font-medium text-sm line-clamp-1">
                                {item.problem.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
