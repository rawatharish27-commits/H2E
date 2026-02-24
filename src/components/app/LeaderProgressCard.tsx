'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Star, Users, CheckCircle2, AlertCircle, Loader2, ChevronRight, Shield, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface LeaderProgressProps {
  onUnlock?: () => void
}

interface LeaderData {
  isLeader: boolean
  leaderLevel: string
  requirements: {
    MIN_TASKS: number
    MIN_RATING: number
    MIN_REFERRALS: number
  }
  current: {
    tasksCompleted: number
    avgRating: number
    activeReferrals: number
    kycVerified: boolean
  }
  progress: {
    tasks: number
    rating: number
    referrals: number
  }
  canUnlock: boolean
  areaSlotsAvailable: number
  slotsBlocked: boolean
  leaderProfile: {
    id: string
    level: string
    areaCode: string
    connectedUsers: number
    totalCommission: number
    monthlyCommission: number
    pendingCommission: number
    isActive: boolean
    isVerified: boolean
    unlockedAt: string
    nextLevel: string
  } | null
}

const LEVEL_COLORS: Record<string, string> = {
  BRONZE: 'from-amber-600 to-orange-600',
  SILVER: 'from-gray-400 to-slate-500',
  GOLD: 'from-yellow-400 to-amber-500',
  AMBASSADOR: 'from-purple-500 to-pink-500'
}

const LEVEL_BG_COLORS: Record<string, string> = {
  BRONZE: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
  SILVER: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30',
  GOLD: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30',
  AMBASSADOR: 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30'
}

export function LeaderProgressCard({ onUnlock }: LeaderProgressProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<LeaderData | null>(null)
  const [unlocking, setUnlocking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/leader/unlock?action=status')
      const result = await response.json()
      if (result.success) {
        setData(result)
      }
    } catch (err) {
      console.error('Failed to fetch leader progress:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = async () => {
    setError(null)
    try {
      setUnlocking(true)
      const response = await fetch('/api/leader/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unlock' })
      })
      const result = await response.json()

      if (result.success) {
        fetchProgress()
        if (onUnlock) onUnlock()
      } else {
        setError(result.error || 'Unlock failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setUnlocking(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-4 border-0 shadow-md bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="ml-2 text-sm text-muted-foreground">Loading leader status...</span>
        </div>
      </Card>
    )
  }

  if (!data) return null

  const { isLeader, leaderLevel, requirements, current, progress, canUnlock, areaSlotsAvailable, slotsBlocked, leaderProfile } = data

  // If already a leader, show leader card
  if (isLeader && leaderProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`overflow-hidden border-0 shadow-md ${LEVEL_BG_COLORS[leaderLevel] || LEVEL_BG_COLORS.BRONZE}`}>
          <div className="p-4">
            {/* Leader Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full bg-gradient-to-r ${LEVEL_COLORS[leaderLevel] || LEVEL_COLORS.BRONZE}`}>
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-1">
                    {leaderLevel} Leader
                    {leaderProfile.isVerified && (
                      <Shield className="w-4 h-4 text-blue-500" />
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">{leaderProfile.areaCode}</p>
                </div>
              </div>
              <Award className="w-8 h-8 text-amber-500" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-foreground">{leaderProfile.connectedUsers}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-green-600">₹{leaderProfile.totalCommission}</p>
                <p className="text-xs text-muted-foreground">Total Earned</p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-amber-600">₹{leaderProfile.pendingCommission}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>

            {/* Next Level Progress */}
            {leaderProfile.nextLevel && leaderProfile.nextLevel !== leaderLevel && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Next: {leaderProfile.nextLevel}</span>
                </div>
                <Progress 
                  value={(leaderProfile.connectedUsers / getConnectedThreshold(leaderProfile.nextLevel)) * 100} 
                  className="h-2" 
                />
              </div>
            )}

            {/* Commission Info */}
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 text-sm">
              <p className="text-muted-foreground">
                💰 Aapko <strong>0.5% commission</strong> milta hai aapke area me hone wali har help pe
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  // Show unlock progress card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Become a Leader</h3>
              <p className="text-xs text-muted-foreground">Earn 0.5% commission on helps in your area</p>
            </div>
          </div>

          {/* Requirements Grid */}
          <div className="space-y-3 mb-4">
            {/* Tasks */}
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {current.tasksCompleted >= requirements.MIN_TASKS ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">Tasks Completed</span>
                </div>
                <span className="text-sm font-bold">
                  {current.tasksCompleted}/{requirements.MIN_TASKS}
                </span>
              </div>
              <Progress value={progress.tasks} className="h-1.5" />
            </div>

            {/* Rating */}
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {current.avgRating >= requirements.MIN_RATING ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">Average Rating</span>
                </div>
                <span className="text-sm font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {current.avgRating.toFixed(1)}/{requirements.MIN_RATING}
                </span>
              </div>
              <Progress value={progress.rating} className="h-1.5" />
            </div>

            {/* Referrals */}
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {current.activeReferrals >= requirements.MIN_REFERRALS ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">Active Referrals</span>
                </div>
                <span className="text-sm font-bold">
                  {current.activeReferrals}/{requirements.MIN_REFERRALS}
                </span>
              </div>
              <Progress value={progress.referrals} className="h-1.5" />
            </div>

            {/* KYC */}
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {current.kycVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">KYC Verified</span>
                </div>
                <span className="text-sm font-medium">
                  {current.kycVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Error or Slots Warning */}
          {error && (
            <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {slotsBlocked && (
            <div className="mb-3 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 text-sm">
              ⚠️ All leader slots in your area are filled (Max 3). Wait for a slot to open.
            </div>
          )}

          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Overall Progress</span>
              <span>{Math.round((progress.tasks + progress.rating + progress.referrals) / 3)}%</span>
            </div>
            <Progress 
              value={(progress.tasks + progress.rating + progress.referrals) / 3} 
              className="h-2" 
            />
          </div>

          {/* Unlock Button */}
          <Button
            className="w-full"
            disabled={!canUnlock || slotsBlocked || unlocking}
            onClick={handleUnlock}
          >
            {unlocking ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Crown className="w-4 h-4 mr-2" />
            )}
            {canUnlock && !slotsBlocked ? 'Unlock Leader Status' : 'Complete Requirements'}
          </Button>

          {/* Benefits Info */}
          <div className="mt-3 text-xs text-muted-foreground">
            <p>💡 Leaders earn 0.5% commission on all helps in their area</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Helper: Get connected threshold for next level
function getConnectedThreshold(level: string): number {
  const thresholds: Record<string, number> = {
    BRONZE: 20,
    SILVER: 50,
    GOLD: 100,
    AMBASSADOR: 200
  }
  return thresholds[level] || 20
}
