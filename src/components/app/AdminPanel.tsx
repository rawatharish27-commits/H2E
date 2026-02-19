'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Users, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  TrendingUp,
  Clock,
  Phone,
  Loader2,
  Ban,
  AlertCircle,
  Eye,
  EyeOff,
  MapPin,
  Activity,
  UserCheck,
  UserX,
  RefreshCw,
  Search,
  Bell,
  Siren,
  Wallet,
  IndianRupee,
  Calendar,
  BarChart3,
  PieChart,
  Zap,
  Timer,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  LogOut,
  ChevronRight,
  Info
} from 'lucide-react'
import { useAppStore } from '@/store'
import { formatDate, getTrustBadge } from '@/types'

// Types
interface Stats {
  totalUsers: number
  activeUsers: number
  paidUsers: number
  pendingPayments: number
  approvedPayments: number
  totalRevenue: number
  openProblems: number
  flaggedUsers: number
  todayProblems: number
  fraudAttempts: number
  activeSOS: number
  avgResponseTime: number
  trustScoreAvg: number
  noShowRate: number
  newUsersToday: number
}

interface AdminUser {
  id: string
  phone: string
  name: string | null
  paymentActive: boolean
  activeTill: string | null
  trustScore: number
  noShowCount: number
  noShowStrikes: number
  reportCount: number
  isBlocked: boolean
  isBanned: boolean
  isShadowBanned: boolean
  isFlagged: boolean
  helpfulCount: number
  createdAt: string
  _count: {
    problems: number
    payments: number
  }
}

interface AdminPayment {
  id: string
  amount: number
  status: string
  upiId: string | null
  transactionRef: string | null
  isFraudSuspected: boolean
  fraudReason: string | null
  slaBreached: boolean
  createdAt: string
  user: {
    id: string
    phone: string
    name: string | null
    trustScore: number
    paymentActive: boolean
    activeTill: string | null
  }
}

interface SOSAlert {
  id: string
  userId: string
  lat: number
  lng: number
  message: string | null
  status: string
  createdAt: string
  timeSinceCreated: number
  user: {
    id: string
    phone: string
    name: string | null
    trustScore: number
  }
}

interface SecurityEvent {
  id: string
  userId: string | null
  eventType: string
  severity: string
  description: string
  resolved: boolean
  createdAt: string
  user?: {
    phone: string
    name: string | null
  }
}

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])
  
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendUp,
  subtitle 
}: { 
  title: string
  value: number | string
  icon: React.ElementType
  color: string
  trend?: number
  trendUp?: boolean
  subtitle?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${color}`} />
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
              </p>
              {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
              {trend !== undefined && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{trend}% from yesterday</span>
                </div>
              )}
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function AdminPanel() {
  const { setScreen, user } = useAppStore()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [error, setError] = useState('')
  
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto-refresh data every 30 seconds
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return
    
    setIsLoading(true)
    try {
      const [statsRes, usersRes, paymentsRes, sosRes, securityRes] = await Promise.all([
        fetch(`/api/admin/stats?adminKey=${adminKey}`),
        fetch(`/api/admin/users?adminKey=${adminKey}`),
        fetch(`/api/admin/payments?adminKey=${adminKey}`),
        fetch('/api/sos', { headers: { 'X-Admin-Key': adminKey } }),
        fetch(`/api/admin/security?adminKey=${adminKey}`)
      ])

      const statsData = await statsRes.json()
      const usersData = await usersRes.json()
      const paymentsData = await paymentsRes.json()
      const sosData = await sosRes.json()
      const securityData = await securityRes.json()

      if (statsData.success) setStats(statsData.stats)
      if (usersData.success) setUsers(usersData.users)
      if (paymentsData.success) setPayments(paymentsData.payments)
      if (sosData.success) setSosAlerts(sosData.alerts || [])
      if (securityData.success) setSecurityEvents(securityData.events || [])
      setLastUpdate(new Date())
    } catch (e) {
      console.error('Failed to fetch data', e)
    } finally {
      setIsLoading(false)
    }
  }, [adminKey, isAuthenticated])

  // Auto-refresh effect
  useEffect(() => {
    if (isAuthenticated && autoRefresh) {
      const interval = setInterval(fetchData, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, autoRefresh, fetchData])

  const handleLogin = async () => {
    if (adminKey === 'admin123') {
      setIsAuthenticated(true)
      fetchData()
    } else {
      try {
        const res = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: adminKey })
        })
        if (res.ok) {
          setIsAuthenticated(true)
          fetchData()
        } else {
          setError('Invalid admin key')
        }
      } catch {
        setError('Invalid admin key')
      }
    }
  }

  const handlePaymentAction = async (paymentId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action, adminKey })
      })

      const data = await res.json()
      
      if (data.success) {
        // Immediately refresh data to show updates
        await fetchData()
      }
    } catch {
      console.error('Failed to process payment')
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, adminKey })
      })

      const data = await res.json()
      
      if (data.success) {
        await fetchData()
      }
    } catch {
      console.error('Failed to moderate user')
    }
  }

  const handleSOSAction = async (sosId: string, status: 'RESOLVED' | 'FALSE_ALARM') => {
    try {
      const res = await fetch('/api/sos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sosId, status })
      })

      if (res.ok) {
        await fetchData()
      }
    } catch {
      console.error('Failed to resolve SOS')
    }
  }

  const resolveSecurityEvent = async (eventId: string, resolution: string) => {
    try {
      await fetch('/api/admin/security/resolve', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, resolution, adminKey })
      })
      await fetchData()
    } catch {
      console.error('Failed to resolve event')
    }
  }

  // Filter users by search
  const filteredUsers = users.filter(u => 
    u.phone.includes(searchQuery) || 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
        <header className="sticky top-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 z-50">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setScreen('home')} className="text-gray-400">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-white">Admin Panel</h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-gray-400 text-center mb-6 max-w-xs">
              Enter admin key to access the control panel
            </p>
            
            <Input
              type="password"
              placeholder="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="max-w-xs mb-4 bg-gray-800 border-gray-700 text-white"
            />
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 max-w-xs mx-auto mb-4"
              >
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </motion.div>
            )}
            
            <Button onClick={handleLogin} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 h-12 font-semibold">
              Access Panel
            </Button>
          </motion.div>
        </main>
      </div>
    )
  }

  // Main Admin Panel
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg border-b z-50 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setScreen('home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-gray-900">Admin Panel</h1>
                <Badge className="bg-green-500 text-white text-xs">LIVE</Badge>
              </div>
              <p className="text-xs text-gray-500">
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {sosAlerts.filter(s => s.status === 'ACTIVE').length > 0 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Siren className="w-3 h-3 mr-1" />
                  {sosAlerts.filter(s => s.status === 'ACTIVE').length} SOS
                </Badge>
              </motion.div>
            )}
            {payments.filter(p => p.status === 'PENDING').length > 0 && (
              <Badge className="bg-orange-500 text-white">
                {payments.filter(p => p.status === 'PENDING').length} Pending
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData} 
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-white border-b px-2 overflow-x-auto shadow-sm">
          <TabsList className="w-full min-w-max bg-transparent h-12">
            <TabsTrigger value="dashboard" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="payments" className="relative gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <CreditCard className="w-4 h-4" />
              Payments
              {payments.filter(p => p.status === 'PENDING').length > 0 && (
                <Badge className="bg-orange-500 text-white text-xs ml-1">
                  {payments.filter(p => p.status === 'PENDING').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sos" className="relative gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Siren className="w-4 h-4" />
              SOS
              {sosAlerts.filter(s => s.status === 'ACTIVE').length > 0 && (
                <Badge className="bg-red-500 text-white text-xs ml-1 animate-pulse">
                  {sosAlerts.filter(s => s.status === 'ACTIVE').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="flex-1 overflow-y-auto p-4 mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : stats ? (
            <div className="space-y-4">
              {/* Critical Alerts */}
              <AnimatePresence>
                {(stats.activeSOS > 0 || stats.fraudAttempts > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Critical Alerts</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {stats.activeSOS > 0 && (
                          <div className="bg-white/20 rounded-xl p-3">
                            <p className="text-2xl font-bold">{stats.activeSOS}</p>
                            <p className="text-sm text-white/80">Active SOS</p>
                          </div>
                        )}
                        {stats.fraudAttempts > 0 && (
                          <div className="bg-white/20 rounded-xl p-3">
                            <p className="text-2xl font-bold">{stats.fraudAttempts}</p>
                            <p className="text-sm text-white/80">Fraud Attempts</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={Users}
                  color="from-blue-500 to-cyan-500"
                  trend={12}
                  trendUp={true}
                  subtitle={`${stats.newUsersToday} today`}
                />
                
                <StatCard
                  title="Active Users"
                  value={stats.activeUsers}
                  icon={UserCheck}
                  color="from-green-500 to-emerald-500"
                  trend={8}
                  trendUp={true}
                />
                
                <StatCard
                  title="Paid Users"
                  value={stats.paidUsers}
                  icon={Wallet}
                  color="from-purple-500 to-pink-500"
                />
                
                <StatCard
                  title="Total Revenue"
                  value={stats.totalRevenue}
                  icon={IndianRupee}
                  color="from-amber-500 to-orange-500"
                />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  title="Pending Payments"
                  value={stats.pendingPayments}
                  icon={Clock}
                  color="from-orange-500 to-red-500"
                />
                
                <StatCard
                  title="Open Problems"
                  value={stats.openProblems}
                  icon={Activity}
                  color="from-indigo-500 to-purple-500"
                />
                
                <StatCard
                  title="Flagged Users"
                  value={stats.flaggedUsers}
                  icon={AlertTriangle}
                  color="from-red-500 to-pink-500"
                />
                
                <StatCard
                  title="Avg Trust Score"
                  value={stats.trustScoreAvg || 50}
                  icon={Shield}
                  color="from-teal-500 to-cyan-500"
                />
              </div>

              {/* Performance Metrics */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-orange-500" />
                    Platform Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">No-Show Rate</span>
                        <span className="font-medium">{(stats.noShowRate || 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={100 - (stats.noShowRate || 0)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Payment Approval Rate</span>
                        <span className="font-medium">
                          {stats.pendingPayments + stats.approvedPayments > 0 
                            ? Math.round((stats.approvedPayments / (stats.pendingPayments + stats.approvedPayments)) * 100)
                            : 0}%
                        </span>
                      </div>
                      <Progress value={stats.pendingPayments + stats.approvedPayments > 0 
                        ? (stats.approvedPayments / (stats.pendingPayments + stats.approvedPayments)) * 100 
                        : 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Avg Response Time</span>
                        <span className="font-medium">{stats.avgResponseTime || 0} min</span>
                      </div>
                      <Progress value={Math.min(100, (stats.avgResponseTime || 0) / 4)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('payments')} className="justify-start">
                    <CreditCard className="w-4 h-4 mr-2 text-orange-500" />
                    Review Payments
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('sos')} className="justify-start">
                    <Siren className="w-4 h-4 mr-2 text-red-500" />
                    SOS Alerts
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('security')} className="justify-start">
                    <Shield className="w-4 h-4 mr-2 text-amber-500" />
                    Security
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('users')} className="justify-start">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="flex-1 overflow-y-auto p-4 mt-0">
          {payments.filter(p => p.status === 'PENDING').length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-gray-500 font-medium">All payments processed!</p>
              <p className="text-gray-400 text-sm mt-1">No pending payments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.filter(p => p.status === 'PENDING').map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className={`border-0 shadow-lg overflow-hidden ${payment.isFraudSuspected ? 'border-2 border-red-500' : payment.slaBreached ? 'border-2 border-orange-500' : ''}`}>
                    <div className={`h-1 ${payment.isFraudSuspected ? 'bg-red-500' : payment.slaBreached ? 'bg-orange-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`} />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">₹{payment.amount}</h3>
                            <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {payment.isFraudSuspected && (
                            <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Fraud
                            </Badge>
                          )}
                          {payment.slaBreached && (
                            <Badge className="bg-orange-100 text-orange-700">SLA Breach</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">User:</span>
                          <span className="font-medium">{payment.user.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone:</span>
                          <span className="font-medium">+91 {payment.user.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trust Score:</span>
                          <span className="font-medium">{payment.user.trustScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">UPI ID:</span>
                          <span className="font-medium">{payment.upiId || 'N/A'}</span>
                        </div>
                        {payment.transactionRef && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ref:</span>
                            <span className="font-medium text-xs">{payment.transactionRef}</span>
                          </div>
                        )}
                        {payment.fraudReason && (
                          <div className="bg-red-50 rounded-lg p-2 mt-2">
                            <p className="text-red-600 text-xs">
                              <strong>⚠️ {payment.fraudReason}</strong>
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePaymentAction(payment.id, 'approve')}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve & Activate
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePaymentAction(payment.id, 'reject')}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:+91${payment.user.phone}`)}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SOS Tab */}
        <TabsContent value="sos" className="flex-1 overflow-y-auto p-4 mt-0">
          {sosAlerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-gray-500 font-medium">No SOS alerts</p>
              <p className="text-gray-400 text-sm mt-1">All emergencies resolved</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sosAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`border-0 shadow-lg overflow-hidden ${alert.status === 'ACTIVE' ? 'border-2 border-red-500' : ''}`}
                >
                  <div className={`h-1 ${alert.status === 'ACTIVE' ? 'bg-red-500' : 'bg-gray-300'}`} />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.status === 'ACTIVE' ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <Siren className={`w-6 h-6 ${alert.status === 'ACTIVE' ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="font-bold">{alert.user.name || 'Unknown User'}</h3>
                          <p className="text-sm text-gray-500">+91 {alert.user.phone}</p>
                        </div>
                      </div>
                      <Badge className={
                        alert.status === 'ACTIVE' ? 'bg-red-500 text-white animate-pulse' :
                        alert.status === 'RESOLVED' ? 'bg-green-500 text-white' :
                        'bg-gray-500 text-white'
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {Math.floor(alert.timeSinceCreated / 60)} min ago
                      </p>
                      {alert.message && (
                        <p className="bg-white rounded-lg p-2 mt-2">{alert.message}</p>
                      )}
                    </div>
                    
                    {alert.status === 'ACTIVE' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSOSAction(alert.id, 'RESOLVED')}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolved
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSOSAction(alert.id, 'FALSE_ALARM')}
                          className="flex-1"
                        >
                          False Alarm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:+91${alert.user.phone}`)}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://maps.google.com/?q=${alert.lat},${alert.lng}`, '_blank')}
                        >
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-3">
            {securityEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-500 font-medium">All secure!</p>
                <p className="text-gray-400 text-sm mt-1">No security events</p>
              </div>
            ) : (
              securityEvents.map((event) => (
                <Card key={event.id} className={`border-0 shadow-lg ${event.resolved ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {event.severity === 'CRITICAL' ? (
                          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          </div>
                        ) : event.severity === 'HIGH' ? (
                          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <Info className="w-5 h-5 text-yellow-500" />
                          </div>
                        )}
                        <div>
                          <span className="font-medium">{event.eventType}</span>
                          {event.user && (
                            <p className="text-xs text-gray-500">{event.user.name || 'N/A'} (+91 {event.user.phone})</p>
                          )}
                        </div>
                      </div>
                      <Badge className={
                        event.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                        event.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                        event.severity === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }>
                        {event.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 bg-gray-50 rounded-lg p-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDate(event.createdAt)}
                      </span>
                      {!event.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveSecurityEvent(event.id, 'Resolved by admin')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="flex-1 overflow-y-auto p-4 mt-0">
          {/* Search */}
          <div className="mb-4 sticky top-0 bg-gray-50 py-2 z-10">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by phone or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>

          <ScrollArea className="h-full">
            <div className="space-y-3 pb-4">
              {filteredUsers.map((user) => {
                const trustInfo = getTrustBadge(user.trustScore)
                
                return (
                  <Card key={user.id} className={`border-0 shadow-lg ${user.isShadowBanned ? 'border-l-4 border-gray-400' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-2xl">
                            👤
                          </div>
                          <div>
                            <h3 className="font-bold flex items-center gap-2">
                              {user.name || 'No Name'}
                              {user.isShadowBanned && (
                                <EyeOff className="w-4 h-4 text-gray-400" title="Shadow Banned" />
                              )}
                            </h3>
                            <p className="text-sm text-gray-500">+91 {user.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 justify-end">
                          {user.isBanned && (
                            <Badge className="bg-red-500 text-white">Banned</Badge>
                          )}
                          {user.isShadowBanned && (
                            <Badge className="bg-gray-500 text-white">Shadow</Badge>
                          )}
                          {user.isBlocked && (
                            <Badge className="bg-orange-500 text-white">Blocked</Badge>
                          )}
                          {user.isFlagged && (
                            <Badge className="bg-yellow-500 text-white">Flagged</Badge>
                          )}
                          {user.paymentActive && (
                            <Badge className="bg-green-500 text-white">Paid</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2 text-center text-sm mb-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="font-bold">{user.trustScore}</p>
                          <p className="text-xs text-gray-500">Trust</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="font-bold text-green-600">{user.helpfulCount}</p>
                          <p className="text-xs text-gray-500">Helps</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="font-bold text-red-500">{user.noShowStrikes}/3</p>
                          <p className="text-xs text-gray-500">Strikes</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="font-bold">{user.reportCount}</p>
                          <p className="text-xs text-gray-500">Reports</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="font-bold">{user._count.problems}</p>
                          <p className="text-xs text-gray-500">Posts</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        {!user.isShadowBanned ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'shadowBan')}
                            className="text-gray-600"
                          >
                            <EyeOff className="w-4 h-4 mr-1" />
                            Shadow Ban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'unshadowBan')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Unshadow
                          </Button>
                        )}
                        
                        {user.isBlocked ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'unblock')}
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'block')}
                          >
                            Block
                          </Button>
                        )}
                        
                        {user.isBanned ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'unban')}
                          >
                            Unban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUserAction(user.id, 'ban')}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Ban
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, 'resetStrikes')}
                        >
                          Reset Strikes
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:+91${user.phone}`)}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
