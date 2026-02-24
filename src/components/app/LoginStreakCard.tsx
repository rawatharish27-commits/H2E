'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame, Gift, Check, Loader2, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface StreakData {
  current: number
  longest: number
  todayCompleted: boolean
  totalRewards: number
  nextMilestone: {
    days: number
    reward: {
      type: string
      duration?: number
      label: string
    }
  } | null
  currentReward: {
    type: string
    duration?: number
    label: string
  } | null
}

interface Milestone {
  days: number
  reward: {
    type: string
    duration?: number
    label: string
  }
  achieved: boolean
}

export function LoginStreakCard() {
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    fetchStreak()
  }, [])

  const fetchStreak = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/streak')
      const result = await response.json()

      if (result.success) {
        setStreak(result.streak)
        setMilestones(result.milestones)
      }
    } catch (err) {
      console.error('Failed to fetch streak:', err)
    } finally {
      setLoading(false)
    }
  }

  const claimDaily = async () => {
    try {
      setClaiming(true)
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const result = await response.json()

      if (result.success) {
        setStreak(result.streak)
        if (result.reward) {
          // Show reward notification
          alert(`🎉 ${result.reward.label} earned!`)
        }
      }
    } catch (err) {
      console.error('Failed to claim daily:', err)
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-4 border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
        </div>
      </Card>
    )
  }

  if (!streak) return null

  const progressToNext = streak.nextMilestone 
    ? (streak.current / streak.nextMilestone.days) * 100 
    : 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-foreground">Daily Streak</h3>
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <span className="text-2xl font-bold">{streak.current}</span>
              <span className="text-xs">days</span>
            </div>
          </div>

          {/* Streak Counter Visual */}
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i < streak.current % 7 || (streak.current >= 7 && i < 7)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {i < streak.current % 7 || (streak.current >= 7 && i < 7) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
            ))}
          </div>

          {/* Next Milestone */}
          {streak.nextMilestone && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Next: {streak.nextMilestone.reward.label}</span>
                <span>{streak.current}/{streak.nextMilestone.days} days</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          )}

          {/* Daily Button */}
          {streak.todayCompleted ? (
            <Button variant="outline" className="w-full" disabled>
              <Check className="w-4 h-4 mr-2" />
              Today's Login Complete
            </Button>
          ) : (
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={claimDaily}
              disabled={claiming}
            >
              {claiming ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Flame className="w-4 h-4 mr-2" />
              )}
              Continue Streak
            </Button>
          )}

          {/* Rewards Info */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Milestones:</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {milestones.map((m) => (
                <div
                  key={m.days}
                  className={`flex-shrink-0 px-2 py-1 rounded-full text-xs ${
                    m.achieved 
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' 
                      : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                  }`}
                >
                  {m.days}d: {m.reward.label}
                </div>
              ))}
            </div>
          </div>

          {/* Current Reward */}
          {streak.currentReward && (
            <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
              <p className="text-sm text-green-700 dark:text-green-300">
                🎁 Active: {streak.currentReward.label}
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
