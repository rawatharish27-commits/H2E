'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Store, Star, Loader2, Upload, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface VerificationData {
  idVerified: boolean
  businessVerified: boolean
  topPerformer: boolean
  idType: string | null
  idVerifiedAt: string | null
  businessName: string | null
  businessType: string | null
  autoQualified: boolean
}

interface Badge {
  icon: string
  label: string
  color: string
  active: boolean
}

export function VerifiedBadgesCard() {
  const [loading, setLoading] = useState(true)
  const [verification, setVerification] = useState<VerificationData | null>(null)
  const [badges, setBadges] = useState<Record<string, Badge>>({})
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'ID' | 'BUSINESS'>('ID')

  useEffect(() => {
    fetchVerification()
  }, [])

  const fetchVerification = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/verification')
      const result = await response.json()

      if (result.success) {
        setVerification(result.verification)
        setBadges(result.badges)
      }
    } catch (err) {
      console.error('Failed to fetch verification:', err)
    } finally {
      setLoading(false)
    }
  }

  const submitVerification = async (type: 'ID' | 'BUSINESS', data: any) => {
    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      })
      const result = await response.json()

      if (result.success) {
        setShowModal(false)
        fetchVerification()
      }
    } catch (err) {
      console.error('Failed to submit verification:', err)
    }
  }

  if (loading) {
    return (
      <Card className="p-4 border-0 shadow-md bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        </div>
      </Card>
    )
  }

  if (!verification) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-foreground">Verified Badges</h3>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* ID Verified */}
            <div 
              className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                verification.idVerified 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200'
              }`}
              onClick={() => !verification.idVerified && (setModalType('ID'), setShowModal(true))}
            >
              <div className={`text-2xl mb-1 ${verification.idVerified ? '' : 'opacity-40'}`}>
                {verification.idVerified ? '✔' : '👤'}
              </div>
              <p className={`text-xs font-medium ${verification.idVerified ? 'text-green-600' : 'text-muted-foreground'}`}>
                ID Verified
              </p>
              {!verification.idVerified && (
                <p className="text-[10px] text-muted-foreground mt-1">Tap to verify</p>
              )}
            </div>

            {/* Business Verified */}
            <div 
              className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                verification.businessVerified 
                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                  : 'bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200'
              }`}
              onClick={() => !verification.businessVerified && (setModalType('BUSINESS'), setShowModal(true))}
            >
              <div className={`text-2xl mb-1 ${verification.businessVerified ? '' : 'opacity-40'}`}>
                {verification.businessVerified ? '🏪' : '🏢'}
              </div>
              <p className={`text-xs font-medium ${verification.businessVerified ? 'text-blue-600' : 'text-muted-foreground'}`}>
                Business
              </p>
              {!verification.businessVerified && (
                <p className="text-[10px] text-muted-foreground mt-1">Tap to verify</p>
              )}
            </div>

            {/* Top Performer */}
            <div className={`p-3 rounded-lg text-center ${
              verification.topPerformer 
                ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                : 'bg-gray-100 dark:bg-gray-800/50'
            }`}>
              <div className={`text-2xl mb-1 ${verification.topPerformer ? '' : 'opacity-40'}`}>
                {verification.topPerformer ? '⭐' : '🌟'}
              </div>
              <p className={`text-xs font-medium ${verification.topPerformer ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                Top Performer
              </p>
              {verification.autoQualified && (
                <p className="text-[10px] text-green-600 mt-1">Auto-qualified!</p>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground">
            <p>💡 Verified badges increase your visibility and trust score!</p>
            {!verification.topPerformer && (
              <p className="mt-1">⭐ Top Performer badge is earned automatically after 20+ helps with 4.5+ rating.</p>
            )}
          </div>

          {/* Verification Benefits */}
          <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <p className="text-sm font-medium mb-2">Benefits of Verification:</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Higher visibility in search
              </li>
              <li className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Priority in task matching
              </li>
              <li className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Access to premium tasks
              </li>
            </ul>
          </div>
        </div>

        {/* Verification Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-xl shadow-xl w-full max-w-sm"
            >
              <div className="p-4 border-b">
                <h3 className="font-semibold">
                  {modalType === 'ID' ? 'ID Verification' : 'Business Verification'}
                </h3>
              </div>
              <div className="p-4">
                {modalType === 'ID' ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Upload a government ID (Aadhaar/PAN) for verification.
                    </p>
                    <Button className="w-full" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload ID Document
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Your data is secure and will only be used for verification.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Verify your business to show a verified badge.
                    </p>
                    <Button className="w-full" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Business Document
                    </Button>
                  </div>
                )}
              </div>
              <div className="p-4 border-t">
                <Button variant="outline" className="w-full" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
