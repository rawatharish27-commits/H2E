'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Zap, Clock, Loader2, CheckCircle, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface BoostData {
  id: string
  type: string
  targetId: string | null
  startsAt: string | null
  endsAt: string | null
  priority: number
  impressions: number
  clicks: number
  timeRemaining: number
}

export function BoostPurchaseCard() {
  const [loading, setLoading] = useState(true)
  const [activeBoosts, setActiveBoosts] = useState<BoostData[]>([])
  const [pricing, setPricing] = useState<any>(null)
  const [showPurchase, setShowPurchase] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [boostsRes, pricingRes] = await Promise.all([
        fetch('/api/boost?action=active'),
        fetch('/api/boost?action=pricing')
      ])
      
      const boostsData = await boostsRes.json()
      const pricingData = await pricingRes.json()

      if (boostsData.success) {
        setActiveBoosts(boostsData.boosts)
      }
      if (pricingData.success) {
        setPricing(pricingData.pricing)
      }
    } catch (err) {
      console.error('Failed to fetch boost data:', err)
    } finally {
      setLoading(false)
    }
  }

  const purchaseBoost = async (boostType: 'TASK_BOOST' | 'PROFILE_BOOST', targetId?: string) => {
    try {
      setPurchasing(true)
      const response = await fetch('/api/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostType, targetId })
      })
      const result = await response.json()

      if (result.success) {
        setShowPurchase(false)
        fetchData()
      }
    } catch (err) {
      console.error('Failed to purchase boost:', err)
    } finally {
      setPurchasing(false)
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  if (loading) {
    return (
      <Card className="p-4 border-0 shadow-md bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
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
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-violet-500" />
              <h3 className="font-semibold text-foreground">Boost Visibility</h3>
            </div>
            <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded-full text-xs font-medium text-violet-600">
              ₹20/24hr
            </span>
          </div>

          {/* Active Boosts */}
          {activeBoosts.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-xs text-muted-foreground">Active Boosts:</p>
              {activeBoosts.map((boost) => (
                <div key={boost.id} className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        {boost.type === 'TASK_BOOST' ? 'Task Boost' : 'Profile Boost'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTime(boost.timeRemaining)} left
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span>👁 {boost.impressions} views</span>
                    <span>👆 {boost.clicks} clicks</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pricing Cards */}
          {pricing && !showPurchase && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div 
                className="bg-white/50 dark:bg-black/20 rounded-lg p-3 cursor-pointer hover:bg-white/80 transition-colors"
                onClick={() => setShowPurchase(true)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">📝</div>
                  <p className="font-medium text-sm">Task Boost</p>
                  <p className="text-lg font-bold text-violet-600">₹{pricing.taskBoost.price}</p>
                  <p className="text-xs text-muted-foreground">{pricing.taskBoost.duration}</p>
                </div>
              </div>
              <div 
                className="bg-white/50 dark:bg-black/20 rounded-lg p-3 cursor-pointer hover:bg-white/80 transition-colors"
                onClick={() => setShowPurchase(true)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">👤</div>
                  <p className="font-medium text-sm">Profile Boost</p>
                  <p className="text-lg font-bold text-violet-600">₹{pricing.profileBoost.price}</p>
                  <p className="text-xs text-muted-foreground">{pricing.profileBoost.duration}</p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <p className="text-xs font-medium mb-2">Boost Benefits:</p>
            <ul className="space-y-1">
              {pricing?.taskBoost.benefits.map((benefit: string, i: number) => (
                <li key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Boost Button */}
          {!showPurchase && (
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
              onClick={() => setShowPurchase(true)}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Get Boost Now
            </Button>
          )}

          {/* Purchase Modal */}
          {showPurchase && (
            <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <p className="text-sm font-medium mb-3">Choose boost type:</p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => purchaseBoost('PROFILE_BOOST')}
                  disabled={purchasing}
                >
                  <span>👤 Profile Boost - ₹20</span>
                  <TrendingUp className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => purchaseBoost('TASK_BOOST')}
                  disabled={purchasing}
                >
                  <span>📝 Task Boost - ₹20</span>
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-2" 
                onClick={() => setShowPurchase(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
