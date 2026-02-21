'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Star, 
  Shield, 
  Clock, 
  Phone,
  CheckCircle,
  XCircle,
  Edit2,
  MapPin,
  Settings,
  FileText,
  AlertTriangle,
  EyeOff,
  Bell,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Lock,
  Camera,
  Loader2,
  KeyRound
} from 'lucide-react'
import { useAppStore } from '@/store'
import { getTrustBadge, formatDate } from '@/types'

export function ProfileScreen() {
  const { user, setScreen, getTrustInfo, isSubscriptionActive, logout, darkMode, toggleDarkMode, setUser } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const trustInfo = getTrustInfo()
  const isActive = isSubscriptionActive()

  const handleSaveName = async () => {
    if (!user || !name.trim()) return
    
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setIsEditing(false)
      }
    } catch {
      console.error('Failed to update name')
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setIsUploadingPhoto(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      const res = await fetch('/api/user/profile/photo', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (data.success && data.avatar) {
        setUser({ ...user, avatar: data.avatar })
      } else {
        alert(data.error || 'Failed to upload photo')
      }
    } catch {
      alert('Failed to upload photo')
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click()
  }

  // Change Password Handler
  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All fields are required')
      return
    }
    
    if (newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters')
      return
    }
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    if (!user?.id) {
      setPasswordError('User not found')
      return
    }
    
    setIsChangingPassword(true)
    
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setPasswordSuccess('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
        setTimeout(() => {
          setShowChangePassword(false)
          setPasswordSuccess('')
        }, 2000)
      } else {
        setPasswordError(data.error || 'Failed to change password')
      }
    } catch {
      setPasswordError('Network error. Please try again.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getTrustLevel = () => {
    if (!trustInfo) return { level: 0, label: 'New User' }
    if (trustInfo.score >= 70) return { level: 100, label: 'Trusted User' }
    if (trustInfo.score >= 50) return { level: 70, label: 'Regular User' }
    if (trustInfo.score >= 40) return { level: 50, label: 'Neutral User' }
    return { level: 30, label: 'Restricted User' }
  }

  const trustLevel = getTrustLevel()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-card/80 backdrop-blur-lg border-b z-50">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setScreen('home')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold">My Profile</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center relative">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              
              {/* Profile Photo */}
              <div className="relative inline-block mb-3">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-white/20 border-4 border-white/30">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      👤
                    </div>
                  )}
                </div>
                
                {/* Camera Button */}
                <button
                  onClick={triggerPhotoUpload}
                  disabled={isUploadingPhoto}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50"
                >
                  {isUploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {isEditing ? (
                <div className="flex gap-2 justify-center">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/20 border-0 text-white placeholder-white/50 text-center max-w-48"
                    placeholder="Your name"
                  />
                  <Button size="sm" onClick={handleSaveName} variant="secondary">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xl font-bold">
                    {user?.name || 'User'}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <p className="text-white/80 text-sm mt-1">
                +91 {user?.phone}
              </p>
              
              {/* Referral Code */}
              {user?.referralCode && (
                <div className="mt-3 bg-white/20 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                  <span className="text-sm">Referral Code:</span>
                  <span className="font-mono font-bold">{user.referralCode}</span>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              {/* Trust Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Trust Score</span>
                  {trustInfo && (
                    <Badge className={trustInfo.color}>
                      {trustInfo.label} - {trustInfo.score}
                    </Badge>
                  )}
                </div>
                <Progress value={trustLevel.level} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{trustLevel.label}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-green-500/10">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold">{user?.helpfulCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Helped</p>
                </div>
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Star className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold">{user?.ratingCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
                <div className="p-2 rounded-xl bg-orange-500/10">
                  <EyeOff className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-lg font-bold">{user?.noShowStrikes || 0}/3</p>
                  <p className="text-xs text-muted-foreground">Strikes</p>
                </div>
                <div className="p-2 rounded-xl bg-red-500/10">
                  <AlertTriangle className="w-4 h-4 text-red-600 mx-auto mb-1" />
                  <p className="text-lg font-bold">{user?.reportCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${isActive ? 'bg-green-500/20' : 'bg-orange-500/20'} flex items-center justify-center`}>
                    {isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">
                      {isActive ? 'Subscription Active' : 'Subscription Inactive'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isActive && user?.activeTill
                        ? `Valid till ${formatDate(user.activeTill)}`
                        : 'Activate to access all features'
                      }
                    </p>
                  </div>
                </div>
                
                {!isActive && (
                  <Button
                    onClick={() => setScreen('subscription')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  >
                    Activate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Warning if flagged or strikes */}
        {(user?.isFlagged || (user?.noShowStrikes && user.noShowStrikes >= 2)) && (
          <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/30">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-600">
              <strong>Warning:</strong> {user.noShowStrikes && user.noShowStrikes >= 2 
                ? `${user.noShowStrikes} strikes recorded. One more no-show will restrict your account.`
                : 'Your account is flagged. Please maintain good behavior.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-4">
            <CardHeader className="pb-2 pt-4 px-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Quick Settings</h3>
            </CardHeader>
            <CardContent className="p-0">
              {/* Dark Mode Toggle */}
              <button 
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={toggleDarkMode}
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Dark Mode</span>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${darkMode ? 'bg-orange-500' : 'bg-muted'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </button>
              
              <Separator />
              
              <button 
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => setShowChangePassword(true)}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <Separator />
              
              <button 
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => setScreen('privacy-settings')}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Privacy & Settings</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <Separator />
              
              <button 
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => setScreen('referral')}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Referral Program</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500/20 text-orange-600">{user?.referralCount || 0}</Badge>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Trust Score Guide
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">New User</span>
                  <Badge className="bg-muted text-muted-foreground">50</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Successful Help</span>
                  <span className="text-green-600 font-medium">+3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Positive Rating (4-5⭐)</span>
                  <span className="text-green-600 font-medium">+2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">No-Show (each)</span>
                  <span className="text-red-600 font-medium">-10 & +1 strike</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Report (Valid)</span>
                  <span className="text-red-600 font-medium">-15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">3 Strikes</span>
                  <span className="text-red-600 font-medium">Account Restricted</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => setScreen('nearby')}
          >
            <MapPin className="w-5 h-5 mr-3" />
            My Posted Problems
            <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => setScreen('terms')}
          >
            <FileText className="w-5 h-5 mr-3" />
            Terms & Conditions
            <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12"
            onClick={() => setScreen('notification-settings')}
          >
            <Bell className="w-5 h-5 mr-3" />
            Notification Settings
            <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12"
          >
            <Phone className="w-5 h-5 mr-3" />
            Contact Support
            <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </motion.div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Help2Earn v1.0.0 • Production Build
        </p>
      </main>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowChangePassword(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Change Password</h3>
                  <button
                    onClick={() => {
                      setShowChangePassword(false)
                      setPasswordError('')
                      setPasswordSuccess('')
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmNewPassword('')
                    }}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Current Password</label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value)
                        setPasswordError('')
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">New Password</label>
                    <Input
                      type="password"
                      placeholder="Enter new password (min 4 chars)"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setPasswordError('')
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Confirm New Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => {
                        setConfirmNewPassword(e.target.value)
                        setPasswordError('')
                      }}
                    />
                  </div>

                  {passwordError && (
                    <p className="text-red-500 text-xs">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-green-500 text-xs">{passwordSuccess}</p>
                  )}

                  <Button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Copyright Footer */}
      <footer className="fixed bottom-3 right-3 z-40">
        <p className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          © Harish Rawat
        </p>
      </footer>
    </div>
  )
}
