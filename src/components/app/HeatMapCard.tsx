'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, TrendingUp, TrendingDown, AlertTriangle, Loader2, Users, ClipboardList } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HeatmapData {
  areaCode: string
  demandLevel: string
  totalRequests: number
  totalHelpers: number
  supplyGap: number
  categoryStats: Record<string, number>
  indicators: {
    isHighDemand: boolean
    isLowSupply: boolean
    needsHelpers: boolean
  }
}

interface NearbyArea {
  areaCode: string
  demandLevel: string
  supplyGap: number
}

export function HeatMapCard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<HeatmapData | null>(null)
  const [nearbyAreas, setNearbyAreas] = useState<NearbyArea[]>([])

  useEffect(() => {
    fetchHeatmap()
  }, [])

  const fetchHeatmap = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/heatmap?action=current')
      const result = await response.json()

      if (result.success) {
        setData(result.heatmap)
        setNearbyAreas(result.nearbyHighDemand)
      }
    } catch (err) {
      console.error('Failed to fetch heatmap:', err)
    } finally {
      setLoading(false)
    }
  }

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500'
      case 'HIGH':
        return 'bg-orange-500'
      case 'LOW':
        return 'bg-green-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const getDemandBg = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
      case 'HIGH':
        return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
      case 'LOW':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
      default:
        return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
    }
  }

  if (loading) {
    return (
      <Card className="p-4 border-0 shadow-md bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        </div>
      </Card>
    )
  }

  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden border-0 shadow-md ${getDemandBg(data.demandLevel)}`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-foreground">Area Heat Map</h3>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getDemandColor(data.demandLevel)}`}>
              {data.demandLevel}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">Open Tasks</span>
              </div>
              <p className="text-xl font-bold text-foreground">{data.totalRequests}</p>
            </div>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Active Helpers</span>
              </div>
              <p className="text-xl font-bold text-foreground">{data.totalHelpers}</p>
            </div>
          </div>

          {/* Supply Gap Indicator */}
          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg mb-3">
            <div className="flex items-center gap-2">
              {data.supplyGap > 0 ? (
                <TrendingUp className="w-5 h-5 text-orange-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-500" />
              )}
              <span className="text-sm font-medium">
                {data.supplyGap > 0 ? `${data.supplyGap} tasks need helpers` : 'Balanced supply'}
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          {Object.keys(data.categoryStats).length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">Task Types:</p>
              <div className="flex gap-2">
                {Object.entries(data.categoryStats).map(([type, count]) => (
                  <span 
                    key={type}
                    className="px-2 py-1 bg-white/50 dark:bg-black/20 rounded text-xs"
                  >
                    {type}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Indicators */}
          <div className="space-y-2">
            {data.indicators.isHighDemand && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>High demand area - Great earning opportunities!</span>
              </div>
            )}
            {data.indicators.needsHelpers && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <Users className="w-4 h-4" />
                <span>Urgent: Helpers needed now!</span>
              </div>
            )}
          </div>

          {/* Nearby High Demand Areas */}
          {nearbyAreas.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Nearby high demand areas:</p>
              <div className="flex gap-2 flex-wrap">
                {nearbyAreas.map((area) => (
                  <span 
                    key={area.areaCode}
                    className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded text-xs text-orange-600"
                  >
                    {area.areaCode} ({area.supplyGap} needed)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="mt-3 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
            <p className="text-sm text-center text-foreground">
              {data.supplyGap > 0 
                ? `💡 ${data.supplyGap} people need help nearby. Start earning now!`
                : '✅ Your area is well-served. Check back for new tasks.'}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
