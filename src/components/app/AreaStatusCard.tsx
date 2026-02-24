'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users, ClipboardList, Store, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface AreaStatusProps {
  areaCode?: string
  onAreaActive?: () => void
}

interface AreaData {
  area: {
    code: string
    name: string
    isActive: boolean
    activatedAt: string | null
  }
  requirements: {
    MIN_USERS: number
    MIN_WEEKLY_TASKS: number
    MIN_PROVIDERS: number
  }
  current: {
    registeredUsers: number
    weeklyTasks: number
    taskProviders: number
  }
  progress: {
    users: number
    tasks: number
    providers: number
    overall: number
  }
  canActivate: boolean
  message: string
}

export function AreaStatusCard({ areaCode, onAreaActive }: AreaStatusProps) {
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [data, setData] = useState<AreaData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAreaStatus()
  }, [areaCode])

  const fetchAreaStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/area/activation${areaCode ? `?areaCode=${areaCode}` : ''}`)
      const result = await response.json()

      if (result.success) {
        setData(result)
        if (result.area.isActive && onAreaActive) {
          onAreaActive()
        }
      } else {
        setError(result.error || 'Failed to fetch area status')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 border-0 shadow-md">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-muted-foreground">Area status check ho raha hai...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-950/30 border-0 shadow-md">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      </Card>
    )
  }

  if (!data) return null

  const { area, requirements, current, progress, message } = data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden border-0 shadow-md ${
        area.isActive 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30' 
          : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30'
      }`}>
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                area.isActive ? 'bg-green-100 dark:bg-green-900/50' : 'bg-amber-100 dark:bg-amber-900/50'
              }`}>
                {area.isActive ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <MapPin className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {area.isActive ? '🎉 Area Active Hai!' : '📍 Area Activation Pending'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {area.code} • {area.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="p-1"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Quick Status */}
          <div className="mt-3 flex items-center gap-2">
            <Progress value={progress.overall} className="h-2 flex-1" />
            <span className="text-xs font-medium text-muted-foreground">{progress.overall}%</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{message}</p>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/50"
            >
              <div className="p-4 space-y-4">
                {/* Requirements Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Users */}
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium">Users</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {current.registeredUsers}/{requirements.MIN_USERS}
                    </div>
                    <Progress value={progress.users} className="h-1.5 mt-1" />
                  </div>

                  {/* Tasks */}
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium">Tasks</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {current.weeklyTasks}/{requirements.MIN_WEEKLY_TASKS}
                    </div>
                    <Progress value={progress.tasks} className="h-1.5 mt-1" />
                  </div>

                  {/* Providers */}
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="w-4 h-4 text-purple-500" />
                      <span className="text-xs font-medium">Providers</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {current.taskProviders}/{requirements.MIN_PROVIDERS}
                    </div>
                    <Progress value={progress.providers} className="h-1.5 mt-1" />
                  </div>
                </div>

                {/* Info Box */}
                <div className={`rounded-lg p-3 text-xs ${
                  area.isActive 
                    ? 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                }`}>
                  {area.isActive ? (
                    <div>
                      <strong>✅ Area Active:</strong> Aap ab tasks post kar sakte ho aur madad de sakte ho!
                      {area.activatedAt && (
                        <div className="mt-1 text-[10px] opacity-75">
                          Activated: {new Date(area.activatedAt).toLocaleDateString('hi-IN')}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <strong>⏳ Area Activation Rules:</strong>
                      <ul className="mt-1 ml-4 list-disc space-y-0.5">
                        <li>Minimum {requirements.MIN_USERS} users register hone chahiye</li>
                        <li>Weekly {requirements.MIN_WEEKLY_TASKS} tasks hone chahiye</li>
                        <li>Minimum {requirements.MIN_PROVIDERS} task providers hone chahiye</li>
                      </ul>
                      <div className="mt-2 text-[10px]">
                        💡 Invite friends to speed up activation!
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!area.isActive && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        // Share functionality
                        const shareText = `Community Help Network app join karo! Hamare area me ${requirements.MIN_USERS - current.registeredUsers} aur users chahiye activation ke liye.`
                        if (navigator.share) {
                          navigator.share({ text: shareText })
                        } else {
                          navigator.clipboard.writeText(shareText)
                        }
                      }}
                    >
                      📤 Invite Friends
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={fetchAreaStatus}
                    >
                      🔄 Refresh
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

// Compact inline status badge
export function AreaStatusBadge({ areaCode }: { areaCode?: string }) {
  const [status, setStatus] = useState<'loading' | 'active' | 'pending' | 'error'>('loading')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/area/activation${areaCode ? `?areaCode=${areaCode}` : ''}`)
        const result = await response.json()
        setStatus(result.area?.isActive ? 'active' : 'pending')
      } catch {
        setStatus('error')
      }
    }
    checkStatus()
  }, [areaCode])

  if (status === 'loading') {
    return <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
  }

  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs">
        <CheckCircle2 className="w-3 h-3" />
        Active
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs">
      <MapPin className="w-3 h-3" />
      Pending
    </span>
  )
}
