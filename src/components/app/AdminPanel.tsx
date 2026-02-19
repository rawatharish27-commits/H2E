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
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Info,
  Map,
  Globe,
  MessageSquare,
  FileText,
  Cpu,
  Database,
  Server,
  Wifi,
  WifiOff,
  Pause,
  Play,
  Send,
  Filter,
  Download,
  Upload,
  Lock,
  Unlock,
  EyeOff,
  Star,
  Target,
  Award,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Repeat,
  UserPlus,
  UserMinus,
  Coins,
  Gift,
  Sparkles,
  Layers,
  LineChart,
  BarChart,
  PieChartIcon,
  AreaChart
} from 'lucide-react'
import { useAppStore } from '@/store'
import { formatDate, getTrustBadge } from '@/types'

// ==========================================
// TYPES
// ==========================================

interface Stats {
  totalUsers: number
  activeUsers: number
  paidUsers: number
  pendingPayments: number
  approvedPayments: number
  totalRevenue: number
  openProblems: number
  inProgressProblems: number
  closedProblemsToday: number
  flaggedUsers: number
  todayProblems: number
  fraudAttempts: number
  activeSOS: number
  avgResponseTime: number
  trustScoreAvg: number
  noShowRate: number
  newUsersToday: number
  cancelledHelps: number
  activeHelpers: number
  avgCompletionTime: number
}

interface AdminUser {
  id: string
  phone: string
  name: string | null
  avatar: string | null
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
  lastActiveAt: string | null
  lat: number | null
  lng: number | null
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

interface AdminLog {
  id: string
  adminId: string
  action: string
  targetType: string
  targetId: string | null
  details: string | null
  reason: string | null
  createdAt: string
}

interface CategoryStat {
  category: string
  count: number
  avgResponseTime: number
  completionRate: number
}

interface DailySnapshot {
  date: string
  totalHelps: number
  activeUsers: number
  newUsers: number
  revenue: number
  disputes: number
  avgTrustScore: number
}

// ==========================================
// ANIMATED COUNTER
// ==========================================

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

// ==========================================
// STAT CARD COMPONENT
// ==========================================

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendUp,
  subtitle,
  onClick 
}: { 
  title: string
  value: number | string
  icon: React.ElementType
  color: string
  trend?: number
  trendUp?: boolean
  subtitle?: string
  onClick?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
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

// ==========================================
// LIVE INDICATOR
// ==========================================

function LiveIndicator({ isLive }: { isLive: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      <span className={`text-xs font-medium ${isLive ? 'text-green-600' : 'text-gray-500'}`}>
        {isLive ? 'LIVE' : 'PAUSED'}
      </span>
    </div>
  )
}

// ==========================================
// MAIN ADMIN PANEL
// ==========================================

export function AdminPanel() {
  const { setScreen, user } = useAppStore()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [error, setError] = useState('')
  
  // Data states
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [dailySnapshots, setDailySnapshots] = useState<DailySnapshot[]>([])
  
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(15) // seconds
  
  // Configuration states
  const [config, setConfig] = useState({
    minTrustScore: 40,
    noShowThreshold: 3,
    paymentSlaMinutes: 240,
    maxProblemsPerDay: 3,
    emergencyThreshold: 50,
    autoBanEnabled: true,
    fraudDetectionEnabled: true,
    gpsSpoofDetection: true,
  })

  // ==========================================
  // DATA FETCHING
  // ==========================================

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return
    
    setIsLoading(true)
    try {
      const [
        statsRes, 
        usersRes, 
        paymentsRes, 
        sosRes, 
        securityRes,
        logsRes,
        categoryRes,
        snapshotRes
      ] = await Promise.all([
        fetch(`/api/admin/stats?adminKey=${adminKey}`),
        fetch(`/api/admin/users?adminKey=${adminKey}`),
        fetch(`/api/admin/payments?adminKey=${adminKey}`),
        fetch('/api/sos', { headers: { 'X-Admin-Key': adminKey } }),
        fetch(`/api/admin/security?adminKey=${adminKey}`),
        fetch(`/api/admin/logs?adminKey=${adminKey}`),
        fetch(`/api/admin/analytics/categories?adminKey=${adminKey}`),
        fetch(`/api/admin/analytics/snapshots?adminKey=${adminKey}`),
      ])

      const statsData = await statsRes.json()
      const usersData = await usersRes.json()
      const paymentsData = await paymentsRes.json()
      const sosData = await sosRes.json()
      const securityData = await securityRes.json()
      const logsData = await logsRes.json()
      const categoryData = await categoryRes.json()
      const snapshotData = await snapshotRes.json()

      if (statsData.success) setStats(statsData.stats)
      if (usersData.success) setUsers(usersData.users)
      if (paymentsData.success) setPayments(paymentsData.payments)
      if (sosData.success) setSosAlerts(sosData.alerts || [])
      if (securityData.success) setSecurityEvents(securityData.events || [])
      if (logsData.success) setAdminLogs(logsData.logs || [])
      if (categoryData.success) setCategoryStats(categoryData.categories || [])
      if (snapshotData.success) setDailySnapshots(snapshotData.snapshots || [])
      
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
      const interval = setInterval(fetchData, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, autoRefresh, refreshInterval, fetchData])

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

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

  // ==========================================
  // ACTION HANDLERS
  // ==========================================

  const handlePaymentAction = async (paymentId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action, adminKey })
      })
      const data = await res.json()
      if (data.success) await fetchData()
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
      if (data.success) await fetchData()
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
      if (res.ok) await fetchData()
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

  const handleBroadcast = async (message: string, target: string) => {
    try {
      await fetch('/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, target, adminKey })
      })
    } catch {
      console.error('Failed to broadcast')
    }
  }

  // Filter users by search
  const filteredUsers = users.filter(u => 
    u.phone.includes(searchQuery) || 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // ==========================================
  // LOGIN SCREEN
  // ==========================================

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

  // ==========================================
  // MAIN ADMIN PANEL
  // ==========================================

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
                <LiveIndicator isLive={autoRefresh} />
              </div>
              <p className="text-xs text-gray-500">
                Last update: {lastUpdate.toLocaleTimeString()} • Refresh: {refreshInterval}s
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Critical Alerts */}
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
            
            {/* Refresh Controls */}
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
            
            {/* Auto-refresh toggle */}
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabs - 15 Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-white border-b px-2 overflow-x-auto shadow-sm">
          <TabsList className="w-full min-w-max bg-transparent h-12">
            {/* 1. Dashboard */}
            <TabsTrigger value="dashboard" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            
            {/* 2. Map View */}
            <TabsTrigger value="map" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
            
            {/* 3. Users */}
            <TabsTrigger value="users" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            
            {/* 4. Trust */}
            <TabsTrigger value="trust" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Trust</span>
            </TabsTrigger>
            
            {/* 5. Alerts */}
            <TabsTrigger value="alerts" className="relative gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
              {securityEvents.filter(e => !e.resolved).length > 0 && (
                <Badge className="bg-red-500 text-white text-xs ml-1">
                  {securityEvents.filter(e => !e.resolved).length}
                </Badge>
              )}
            </TabsTrigger>
            
            {/* 6. Disputes */}
            <TabsTrigger value="disputes" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Disputes</span>
            </TabsTrigger>
            
            {/* 7. Payments */}
            <TabsTrigger value="payments" className="relative gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
              {payments.filter(p => p.status === 'PENDING').length > 0 && (
                <Badge className="bg-orange-500 text-white text-xs ml-1">
                  {payments.filter(p => p.status === 'PENDING').length}
                </Badge>
              )}
            </TabsTrigger>
            
            {/* 8. Analytics */}
            <TabsTrigger value="analytics" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            
            {/* 9. SLA */}
            <TabsTrigger value="sla" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Timer className="w-4 h-4" />
              <span className="hidden sm:inline">SLA</span>
            </TabsTrigger>
            
            {/* 10. Logs */}
            <TabsTrigger value="logs" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
            
            {/* 11. System */}
            <TabsTrigger value="system" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Server className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            
            {/* 12. Notifications */}
            <TabsTrigger value="notifications" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Notify</span>
            </TabsTrigger>
            
            {/* 13. Insights */}
            <TabsTrigger value="insights" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <PieChart className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            
            {/* 14. Snapshots */}
            <TabsTrigger value="snapshots" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            
            {/* 15. Config */}
            <TabsTrigger value="config" className="gap-1 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ==========================================
            TAB CONTENTS
            ========================================== */}

        {/* 1. DASHBOARD TAB */}
        <TabsContent value="dashboard" className="flex-1 overflow-y-auto p-4 mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : stats ? (
            <div className="space-y-4">
              {/* Critical Alerts Banner */}
              <AnimatePresence>
                {(stats.activeSOS > 0 || stats.fraudAttempts > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="font-bold text-lg">⚠️ Critical Alerts - Action Required</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                        {stats.flaggedUsers > 0 && (
                          <div className="bg-white/20 rounded-xl p-3">
                            <p className="text-2xl font-bold">{stats.flaggedUsers}</p>
                            <p className="text-sm text-white/80">Flagged Users</p>
                          </div>
                        )}
                        {stats.pendingPayments > 0 && (
                          <div className="bg-white/20 rounded-xl p-3">
                            <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                            <p className="text-sm text-white/80">Pending Payments</p>
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
                  subtitle="This month"
                />
              </div>

              {/* Help Activity Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  title="Open Problems"
                  value={stats.openProblems}
                  icon={AlertCircle}
                  color="from-red-500 to-pink-500"
                  onClick={() => setActiveTab('analytics')}
                />
                
                <StatCard
                  title="In Progress"
                  value={stats.inProgressProblems}
                  icon={Zap}
                  color="from-yellow-500 to-orange-500"
                />
                
                <StatCard
                  title="Completed Today"
                  value={stats.closedProblemsToday}
                  icon={CheckCircle}
                  color="from-green-500 to-emerald-500"
                />
                
                <StatCard
                  title="Active Helpers"
                  value={stats.activeHelpers}
                  icon={UserCheck}
                  color="from-blue-500 to-cyan-500"
                />
              </div>

              {/* Platform Metrics */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-orange-500" />
                    Platform Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">No-Show Rate</span>
                        <span className={`font-medium ${(stats.noShowRate || 0) > 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {(stats.noShowRate || 0).toFixed(1)}%
                        </span>
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
                        <span className={`font-medium ${(stats.avgResponseTime || 0) > 30 ? 'text-red-600' : 'text-green-600'}`}>
                          {stats.avgResponseTime || 0} min
                        </span>
                      </div>
                      <Progress value={Math.min(100, (60 - (stats.avgResponseTime || 0)) / 60 * 100)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Average Trust Score</span>
                        <span className="font-medium">{stats.trustScoreAvg || 50}</span>
                      </div>
                      <Progress value={stats.trustScoreAvg || 50} className="h-2" />
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
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('alerts')} className="justify-start">
                    <Siren className="w-4 h-4 mr-2 text-red-500" />
                    SOS Alerts
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('trust')} className="justify-start">
                    <Shield className="w-4 h-4 mr-2 text-amber-500" />
                    Trust Scores
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

        {/* 2. MAP VIEW TAB */}
        <TabsContent value="map" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Map className="w-4 h-4 text-orange-500" />
                  Live Map View - Help Requests & Helpers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
                  {/* Map Placeholder - In production, integrate Google Maps */}
                  <div className="text-center">
                    <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Live Map Integration</p>
                    <p className="text-gray-400 text-sm">Shows active help requests & helpers in real-time</p>
                  </div>
                  
                  {/* Map Legend Overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <p className="text-xs font-semibold mb-2">Legend</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span>SOS Alert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span>Open Request</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Helper Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>In Progress</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Overlay */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-orange-600">{stats?.openProblems || 0}</p>
                        <p className="text-xs text-gray-500">Open</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{stats?.activeHelpers || 0}</p>
                        <p className="text-xs text-gray-500">Helpers</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Map Filters */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Badge className="bg-red-100 text-red-700 cursor-pointer hover:bg-red-200">
                    <Siren className="w-3 h-3 mr-1" /> SOS: {sosAlerts.filter(s => s.status === 'ACTIVE').length}
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-700 cursor-pointer hover:bg-orange-200">
                    <AlertCircle className="w-3 h-3 mr-1" /> Open: {stats?.openProblems || 0}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 cursor-pointer hover:bg-green-200">
                    <UserCheck className="w-3 h-3 mr-1" /> Helpers: {stats?.activeHelpers || 0}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200">
                    <Zap className="w-3 h-3 mr-1" /> In Progress: {stats?.inProgressProblems || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. USERS TAB */}
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
              {filteredUsers.slice(0, 20).map((user) => {
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
                            <h3 className="font-bold">{user.name || 'Unknown'}</h3>
                            <p className="text-sm text-gray-500">+91 {user.phone}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={`${trustInfo.color}`}>
                            <Star className="w-3 h-3 mr-1" />
                            {trustInfo.score} {trustInfo.label}
                          </Badge>
                          {user.paymentActive && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* User Stats */}
                      <div className="grid grid-cols-4 gap-2 text-center text-sm mb-3">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="font-bold">{user._count.problems}</p>
                          <p className="text-xs text-gray-500">Problems</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="font-bold">{user.helpfulCount}</p>
                          <p className="text-xs text-gray-500">Helped</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="font-bold text-red-600">{user.noShowCount}</p>
                          <p className="text-xs text-gray-500">No-Shows</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="font-bold text-orange-600">{user.reportCount}</p>
                          <p className="text-xs text-gray-500">Reports</p>
                        </div>
                      </div>
                      
                      {/* Warning Indicators */}
                      {(user.isFlagged || user.noShowStrikes >= 2 || user.reportCount >= 3) && (
                        <div className="flex gap-2 mb-3">
                          {user.isFlagged && (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <Flag className="w-3 h-3 mr-1" /> Flagged
                            </Badge>
                          )}
                          {user.noShowStrikes >= 2 && (
                            <Badge className="bg-orange-100 text-orange-700">
                              <AlertTriangle className="w-3 h-3 mr-1" /> {user.noShowStrikes}/3 Strikes
                            </Badge>
                          )}
                          {user.reportCount >= 3 && (
                            <Badge className="bg-red-100 text-red-700">
                              <AlertCircle className="w-3 h-3 mr-1" /> High Reports
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, 'view')}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, user.isBlocked ? 'unblock' : 'block')}
                          className={user.isBlocked ? 'text-green-600' : 'text-orange-600'}
                        >
                          {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, 'reset_trust')}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUserAction(user.id, user.isBanned ? 'unban' : 'ban')}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 4. TRUST SCORE TAB */}
        <TabsContent value="trust" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            {/* Trust Distribution */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  Trust Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-600">
                        {users.filter(u => u.trustScore >= 70).length}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-green-600">Trusted (70+)</p>
                    <p className="text-xs text-gray-500">Full access</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-yellow-600">
                        {users.filter(u => u.trustScore >= 40 && u.trustScore < 70).length}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-yellow-600">Neutral (40-69)</p>
                    <p className="text-xs text-gray-500">Limited access</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-red-600">
                        {users.filter(u => u.trustScore < 40).length}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-red-600">Restricted (&lt;40)</p>
                    <p className="text-xs text-gray-500">No high-risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fast Trust Drop Users */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  Users with Fast Trust Drop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.filter(u => u.noShowStrikes >= 2 || u.reportCount >= 2).slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <UserX className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium">{u.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">+91 {u.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-700">
                          {u.trustScore} pts
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleUserAction(u.id, 'freeze')}>
                          <Pause className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.filter(u => u.noShowStrikes >= 2 || u.reportCount >= 2).length === 0 && (
                    <p className="text-center text-gray-500 py-4">No users with fast trust drops</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trust Gain Leaders */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Trust Gain Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.filter(u => u.helpfulCount >= 5).sort((a, b) => b.helpfulCount - a.helpfulCount).slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">{u.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{u.helpfulCount} helps completed</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <Star className="w-3 h-3 mr-1" />
                        {u.trustScore}
                      </Badge>
                    </div>
                  ))}
                  {users.filter(u => u.helpfulCount >= 5).length === 0 && (
                    <p className="text-center text-gray-500 py-4">No top helpers yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 5. ALERTS TAB */}
        <TabsContent value="alerts" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            {/* SOS Alerts */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                  <Siren className="w-4 h-4" />
                  Active SOS Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sosAlerts.filter(s => s.status === 'ACTIVE').map(alert => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-red-50 border-2 border-red-300 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <Siren className="w-6 h-6 text-red-500 animate-pulse" />
                          </div>
                          <div>
                            <p className="font-bold">{alert.user.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">+91 {alert.user.phone}</p>
                          </div>
                        </div>
                        <Badge className="bg-red-500 text-white animate-pulse">ACTIVE</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-gray-500">Location</p>
                          <p className="font-mono text-xs">{alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-gray-500">Time</p>
                          <p className="font-medium">{Math.floor(alert.timeSinceCreated / 60)} min ago</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-green-500 text-white" onClick={() => handleSOSAction(alert.id, 'RESOLVED')}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Resolved
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSOSAction(alert.id, 'FALSE_ALARM')}>
                          False Alarm
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => window.open(`tel:+91${alert.user.phone}`)}>
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => window.open(`https://maps.google.com/?q=${alert.lat},${alert.lng}`, '_blank')}>
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {sosAlerts.filter(s => s.status === 'ACTIVE').length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No Active SOS Alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Events */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  Security Events ({securityEvents.filter(e => !e.resolved).length} unresolved)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityEvents.slice(0, 10).map(event => (
                    <div key={event.id} className={`p-3 rounded-xl ${event.resolved ? 'opacity-50' : ''} ${
                      event.severity === 'CRITICAL' ? 'bg-red-50 border border-red-200' :
                      event.severity === 'HIGH' ? 'bg-orange-50 border border-orange-200' :
                      'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {event.severity === 'CRITICAL' ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : event.severity === 'HIGH' ? (
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                          ) : (
                            <Info className="w-5 h-5 text-yellow-500" />
                          )}
                          <span className="font-medium">{event.eventType}</span>
                        </div>
                        <Badge className={
                          event.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                          event.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                          'bg-yellow-500 text-white'
                        }>
                          {event.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{formatDate(event.createdAt)}</span>
                        {!event.resolved && (
                          <Button size="sm" variant="outline" onClick={() => resolveSecurityEvent(event.id, 'Resolved')}>
                            <CheckCircle className="w-4 h-4 mr-1" /> Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 6. DISPUTES TAB */}
        <TabsContent value="disputes" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Disputes & Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.filter(u => u.reportCount > 0).slice(0, 10).map(u => (
                    <div key={u.id} className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Flag className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-medium">{u.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">+91 {u.phone}</p>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700">
                          {u.reportCount} reports
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleUserAction(u.id, 'warn')}>
                          <AlertCircle className="w-4 h-4 mr-1" /> Warn
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleUserAction(u.id, 'restrict')}>
                          <Lock className="w-4 h-4 mr-1" /> Restrict
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleUserAction(u.id, 'shadowban')}>
                          <EyeOff className="w-4 h-4 mr-1" /> Shadow Ban
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.filter(u => u.reportCount > 0).length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No Disputes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 7. PAYMENTS TAB */}
        <TabsContent value="payments" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-3">
            {payments.filter(p => p.status === 'PENDING').length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-500 font-medium">All payments processed!</p>
                <p className="text-gray-400 text-sm mt-1">No pending payments</p>
              </div>
            ) : (
              payments.filter(p => p.status === 'PENDING').map((payment) => (
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
              ))
            )}
          </div>
        </TabsContent>

        {/* 8. ANALYTICS TAB */}
        <TabsContent value="analytics" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            {/* Category Demand */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-500" />
                  Category Demand Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryStats.length > 0 ? categoryStats.map((cat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{cat.category}</span>
                          <span className="text-gray-500">{cat.count} requests</span>
                        </div>
                        <Progress value={cat.completionRate} className="h-2" />
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No category data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Peak Demand Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {['6-9', '9-12', '12-3', '3-6', '6-9', '9-12'].map((hour, i) => (
                    <div key={i} className="text-center">
                      <div 
                        className="h-16 bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg"
                        style={{ height: `${20 + Math.random() * 60}px` }}
                      />
                      <p className="text-xs text-gray-500 mt-1">{hour}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 9. SLA TAB */}
        <TabsContent value="sla" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Timer className="w-4 h-4 text-orange-500" />
                  SLA & Response Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-xl text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {stats?.avgResponseTime || 0}
                      </p>
                      <p className="text-sm text-gray-500">Avg Response (min)</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {stats?.avgCompletionTime || 0}
                      </p>
                      <p className="text-sm text-gray-500">Avg Completion (min)</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Response Time Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-16">0-5 min</span>
                        <Progress value={65} className="flex-1 h-2" />
                        <span className="text-xs w-10">65%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-16">5-15 min</span>
                        <Progress value={25} className="flex-1 h-2" />
                        <span className="text-xs w-10">25%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-16">15-30 min</span>
                        <Progress value={8} className="flex-1 h-2" />
                        <span className="text-xs w-10">8%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-16">30+ min</span>
                        <Progress value={2} className="flex-1 h-2" />
                        <span className="text-xs w-10">2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 10. LOGS TAB */}
        <TabsContent value="logs" className="flex-1 overflow-y-auto p-4 mt-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                Admin Action Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {adminLogs.length > 0 ? adminLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
                    </div>
                    <p className="text-gray-500">
                      {log.targetType}: {log.targetId || 'N/A'}
                    </p>
                    {log.reason && (
                      <p className="text-gray-400 text-xs mt-1">Reason: {log.reason}</p>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No logs available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 11. SYSTEM TAB */}
        <TabsContent value="system" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-green-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Database</span>
                    </div>
                    <p className="text-sm text-green-600">● Operational</p>
                    <p className="text-xs text-gray-500">Latency: 12ms</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-5 h-5 text-green-600" />
                      <span className="font-medium">API</span>
                    </div>
                    <p className="text-sm text-green-600">● Operational</p>
                    <p className="text-xs text-gray-500">Response: 45ms</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="w-5 h-5 text-green-600" />
                      <span className="font-medium">WebSocket</span>
                    </div>
                    <p className="text-sm text-green-600">● Connected</p>
                    <p className="text-xs text-gray-500">Clients: {Math.floor(Math.random() * 50) + 10}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-green-600" />
                      <span className="font-medium">CDN</span>
                    </div>
                    <p className="text-sm text-green-600">● Operational</p>
                    <p className="text-xs text-gray-500">Cache Hit: 98%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 12. NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-orange-500" />
                  Broadcast Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Audience</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active Users</SelectItem>
                        <SelectItem value="paid">Paid Users</SelectItem>
                        <SelectItem value="helpers">Helpers Only</SelectItem>
                        <SelectItem value="location">By Location</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Input placeholder="Enter broadcast message..." />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Send Broadcast
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Alerts */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" />
                  Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="destructive" className="flex-1">
                    <Siren className="w-4 h-4 mr-2" />
                    Send Emergency Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 13. INSIGHTS TAB */}
        <TabsContent value="insights" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-orange-500" />
                  User Behavior Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Repeat className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Repeat Helpers</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {users.filter(u => u.helpfulCount >= 3).length}
                    </p>
                    <p className="text-xs text-gray-500">3+ helps completed</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <UserMinus className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">One-time Users</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {users.filter(u => u.helpfulCount === 0 && u._count.problems <= 1).length}
                    </p>
                    <p className="text-xs text-gray-500">Only requested once</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Givers</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {users.filter(u => u.helpfulCount > u._count.problems).length}
                    </p>
                    <p className="text-xs text-gray-500">Help more than ask</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsDown className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Takers</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {users.filter(u => u._count.problems > u.helpfulCount * 2).length}
                    </p>
                    <p className="text-xs text-gray-500">Ask more than help</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 14. SNAPSHOTS TAB */}
        <TabsContent value="snapshots" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  Daily / Weekly Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {dailySnapshots.length > 0 ? dailySnapshots.slice(0, 7).map((snapshot, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{snapshot.date}</span>
                        <Badge className="bg-green-100 text-green-700">
                          {snapshot.totalHelps} helps
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div>
                          <p className="font-bold">{snapshot.activeUsers}</p>
                          <p className="text-gray-500">Active</p>
                        </div>
                        <div>
                          <p className="font-bold">{snapshot.newUsers}</p>
                          <p className="text-gray-500">New</p>
                        </div>
                        <div>
                          <p className="font-bold">₹{snapshot.revenue}</p>
                          <p className="text-gray-500">Revenue</p>
                        </div>
                        <div>
                          <p className="font-bold">{snapshot.avgTrustScore}</p>
                          <p className="text-gray-500">Trust Avg</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No snapshots available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 15. CONFIG TAB */}
        <TabsContent value="config" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-500" />
                  Configuration & Rule Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Trust Score Thresholds */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Trust Score Thresholds</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Minimum Trust for High-Risk: {config.minTrustScore}</span>
                        </div>
                        <Slider 
                          value={[config.minTrustScore]} 
                          onValueChange={(v) => setConfig({...config, minTrustScore: v[0]})}
                          max={100} 
                          step={5} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* No-Show Threshold */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">No-Show Threshold</h4>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        value={config.noShowThreshold}
                        onChange={(e) => setConfig({...config, noShowThreshold: parseInt(e.target.value)})}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">strikes before auto-ban</span>
                    </div>
                  </div>
                  
                  {/* Payment SLA */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Payment Approval SLA</h4>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        value={config.paymentSlaMinutes}
                        onChange={(e) => setConfig({...config, paymentSlaMinutes: parseInt(e.target.value)})}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">minutes (default: 240 = 4 hours)</span>
                    </div>
                  </div>
                  
                  {/* Max Problems Per Day */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Max Problems Per Day</h4>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        value={config.maxProblemsPerDay}
                        onChange={(e) => setConfig({...config, maxProblemsPerDay: parseInt(e.target.value)})}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">per user</span>
                    </div>
                  </div>
                  
                  {/* Feature Toggles */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Feature Toggles</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-Ban Enabled</p>
                          <p className="text-xs text-gray-500">Automatically ban users after threshold</p>
                        </div>
                        <Switch 
                          checked={config.autoBanEnabled}
                          onCheckedChange={(v) => setConfig({...config, autoBanEnabled: v})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Fraud Detection</p>
                          <p className="text-xs text-gray-500">Enable fraud detection system</p>
                        </div>
                        <Switch 
                          checked={config.fraudDetectionEnabled}
                          onCheckedChange={(v) => setConfig({...config, fraudDetectionEnabled: v})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">GPS Spoof Detection</p>
                          <p className="text-xs text-gray-500">Detect fake location usage</p>
                        </div>
                        <Switch 
                          checked={config.gpsSpoofDetection}
                          onCheckedChange={(v) => setConfig({...config, gpsSpoofDetection: v})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Save Button */}
                  <Button className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
