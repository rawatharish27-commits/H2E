'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ArrowRight, AlertCircle, CheckCircle2, Clock, Loader2, History, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

interface WithdrawalBalance {
  totalEarnings: number
  pendingEarnings: number
  withdrawableAmount: number
  pendingWithdrawals: number
  withdrawnAmount: number
  canWithdraw: boolean
  minAmount: number
  maxAmount: number
}

interface WithdrawalHistory {
  id: string
  amount: number
  status: string
  upiId: string
  transactionRef: string | null
  rejectionReason: string | null
  createdAt: string
  approvedAt: string | null
}

export function WithdrawalCard() {
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<WithdrawalBalance | null>(null)
  const [history, setHistory] = useState<WithdrawalHistory[]>([])
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [amount, setAmount] = useState('')
  const [upiId, setUpiId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchBalance()
    fetchHistory()
  }, [])

  const fetchBalance = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/withdrawal?action=balance')
      const result = await response.json()
      if (result.success) {
        setBalance(result.balance)
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/withdrawal?action=history')
      const result = await response.json()
      if (result.success) {
        setHistory(result.withdrawals)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const handleWithdraw = async () => {
    setError(null)
    setSuccess(null)

    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum < (balance?.minAmount || 200)) {
      setError(`Minimum withdrawal ₹${balance?.minAmount || 200} hai`)
      return
    }

    if (!upiId || !upiId.includes('@')) {
      setError('Valid UPI ID daalo')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum, upiId })
      })
      const result = await response.json()

      if (result.success) {
        setSuccess(result.message)
        setAmount('')
        setUpiId('')
        setShowWithdraw(false)
        fetchBalance()
        fetchHistory()
      } else {
        setError(result.error || 'Withdrawal failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs">
            <Clock className="w-3 h-3" /> Pending
          </span>
        )
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        )
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs">
            <AlertCircle className="w-3 h-3" /> Rejected
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-0 shadow-md">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
          <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
        </div>
      </Card>
    )
  }

  if (!balance) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Referral Earnings</h3>
                <p className="text-xs text-muted-foreground">Withdraw your earnings</p>
              </div>
            </div>
          </div>

          {/* Balance Display */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Withdrawable</p>
              <p className="text-xl font-bold text-green-600">₹{balance.withdrawableAmount}</p>
            </div>
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Pending (48hr lock)</p>
              <p className="text-xl font-bold text-amber-600">₹{balance.pendingEarnings}</p>
            </div>
          </div>

          {/* Progress to minimum */}
          {balance.withdrawableAmount < balance.minAmount && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Withdrawal progress</span>
                <span>₹{balance.withdrawableAmount} / ₹{balance.minAmount}</span>
              </div>
              <Progress 
                value={(balance.withdrawableAmount / balance.minAmount) * 100} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum ₹{balance.minAmount} chahiye withdrawal ke liye
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={!balance.canWithdraw}
              onClick={() => setShowWithdraw(true)}
            >
              {balance.canWithdraw ? 'Withdraw' : `Need ₹${balance.minAmount - balance.withdrawableAmount} more`}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
            >
              <History className="w-4 h-4" />
            </Button>
          </div>

          {/* Total Stats */}
          <div className="mt-4 pt-3 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
            <span>Total Earned: ₹{balance.totalEarnings}</span>
            <span>Withdrawn: ₹{balance.withdrawnAmount}</span>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-xl shadow-xl w-full max-w-sm"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Withdraw Earnings</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowWithdraw(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder={`Min ₹${balance.minAmount}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: ₹{balance.withdrawableAmount}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">UPI ID</label>
                  <Input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Submit Request
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-xl shadow-xl w-full max-w-sm max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Withdrawal History</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No withdrawals yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {history.map((w) => (
                      <div key={w.id} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">₹{w.amount}</span>
                          {getStatusBadge(w.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{w.upiId}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(w.createdAt).toLocaleDateString('hi-IN')}
                        </p>
                        {w.rejectionReason && (
                          <p className="text-xs text-red-600 mt-1">{w.rejectionReason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
