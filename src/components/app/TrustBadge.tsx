'use client'

import { getTrustInfo, getTrustBadge, TrustBadge as TrustBadgeType } from '@/lib/trust-score'
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface TrustBadgeProps {
  score: number
  showScore?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TrustBadge({ score, showScore = true, size = 'md', className = '' }: TrustBadgeProps) {
  const info = getTrustInfo(score)
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }
  
  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  const getIcon = () => {
    switch (info.badge) {
      case 'trusted':
        return <CheckCircle className={`${iconSize[size]} text-green-600`} />
      case 'neutral':
        return <Shield className={`${iconSize[size]} text-yellow-600`} />
      case 'restricted':
        return <AlertTriangle className={`${iconSize[size]} text-red-600`} />
    }
  }
  
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-medium ${info.bgColor} ${info.color} ${sizeClasses[size]} ${className}`}>
      {getIcon()}
      <span>{info.label}</span>
      {showScore && <span className="opacity-75">({score})</span>}
    </div>
  )
}

interface TrustScoreCardProps {
  score: number
  helpfulCount?: number
  ratingCount?: number
  noShowCount?: number
  darkMode?: boolean
}

export function TrustScoreCard({ 
  score, 
  helpfulCount = 0, 
  ratingCount = 0, 
  noShowCount = 0,
  darkMode = false 
}: TrustScoreCardProps) {
  const info = getTrustInfo(score)
  
  return (
    <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Trust Score
        </h3>
        <TrustBadge score={score} size="md" />
      </div>
      
      {/* Score bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Score</span>
          <span className={`font-bold ${info.color}`}>{score}/100</span>
        </div>
        <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              info.badge === 'trusted' ? 'bg-green-500' :
              info.badge === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {helpfulCount}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Helps
          </div>
        </div>
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {ratingCount}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Ratings
          </div>
        </div>
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-lg font-bold ${noShowCount > 0 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
            {noShowCount}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No-Shows
          </div>
        </div>
      </div>
      
      {/* Next level info */}
      {info.badge !== 'trusted' && (
        <div className={`mt-3 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} flex items-start gap-2`}>
          <Info className={`w-4 h-4 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
            {info.badge === 'neutral' 
              ? `${70 - score} more points to become Trusted and access high-risk resources`
              : `${40 - score} more points to remove restrictions`}
          </p>
        </div>
      )}
    </div>
  )
}

interface TrustRequirementBadgeProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  userTrustScore?: number
  darkMode?: boolean
}

export function TrustRequirementBadge({ riskLevel, userTrustScore, darkMode = false }: TrustRequirementBadgeProps) {
  const riskConfig = {
    LOW: { 
      color: 'text-green-600', 
      bg: 'bg-green-100 dark:bg-green-900/30',
      label: 'Low Risk',
      minTrust: 40
    },
    MEDIUM: { 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      label: 'Medium Risk',
      minTrust: 50
    },
    HIGH: { 
      color: 'text-red-600', 
      bg: 'bg-red-100 dark:bg-red-900/30',
      label: 'High Risk',
      minTrust: 70
    }
  }
  
  const config = riskConfig[riskLevel]
  const canAccess = userTrustScore !== undefined && userTrustScore >= config.minTrust
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${config.bg} ${config.color}`}>
      <Shield className="w-3 h-3" />
      <span>{config.label}</span>
      {userTrustScore !== undefined && (
        <span className={canAccess ? 'text-green-600' : 'text-red-600'}>
          {canAccess ? '✓' : `(${config.minTrust}+ req)`}
        </span>
      )}
    </div>
  )
}
