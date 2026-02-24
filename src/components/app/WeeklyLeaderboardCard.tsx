'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, Loader2, Gift, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface LeaderboardEntry {
  rank: number
  user: {
    id: string
    name: string | null
    avatar: string | null
    avgRating: number
    areaCode: string | null
  }
  totalHelps: number
  avgRating: number
  badge: string
  bonusAmount: number
  bonusClaimed: boolean
}

export function WeeklyLeaderboardCard() {
  const [loading, setLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [myRank, setMyRank] = useState<{ rank: number; bonusAvailable: boolean } | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const [lbRes, rankRes] = await Promise.all([
        fetch('/api/leaderboard?action=current'),
        fetch('/api/leaderboard?action=my-rank')
      ])
      
      const lbData = await lbRes.json()
      const rankData = await rankRes.json()

      if (lbData.success) {
        setLeaderboard(lbData.leaderboard)
      }
      if (rankData.success && rankData.myRank) {
        setMyRank({
          rank: rankData.myRank,
          bonusAvailable: rankData.bonusAvailable
        })
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const claimBonus = async () => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const result = await response.json()
      if (result.success) {
        fetchLeaderboard()
      }
    } catch (err) {
      console.error('Failed to claim bonus:', err)
    }
  }

  if (loading) {
    return (
      <Card className="p-4 border-0 shadow-md bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-foreground">Weekly Top Earners</h3>
            </div>
            <span className="text-xs text-muted-foreground">This Week</span>
          </div>

          {/* Leaderboard */}
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <motion.div
                key={entry.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  index === 1 ? 'bg-gray-100 dark:bg-gray-800/30' :
                  index === 2 ? 'bg-orange-100 dark:bg-orange-900/30' :
                  'bg-white/50 dark:bg-black/20'
                }`}
              >
                <span className="text-xl w-8 text-center">
                  {entry.badge}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground truncate">
                    {entry.user.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.totalHelps} helps • ⭐ {entry.avgRating.toFixed(1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-600">
                    ₹{entry.bonusAmount}
                  </p>
                  <p className="text-xs text-muted-foreground">bonus</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* My Rank */}
          {myRank && (
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4 text-primary" />
                  <span className="text-sm">Your Rank: #{myRank.rank}</span>
                </div>
                {myRank.bonusAvailable && (
                  <Button size="sm" onClick={claimBonus}>
                    <Gift className="w-4 h-4 mr-1" />
                    Claim Bonus
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-3 text-xs text-muted-foreground text-center">
            🏆 Top 5 earners get bonus rewards every week!
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
