'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Eye, Bell, Moon, Globe, Shield, ChevronRight, ToggleLeft, ToggleRight, AlertCircle, Info } from 'lucide-react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PrivacySettingsScreenProps {
  onBack: () => void
}

export function PrivacySettingsScreen({ onBack }: PrivacySettingsScreenProps) {
  const { user, darkMode, toggleDarkMode } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    locationEnabled: true,
    showProfile: true,
    notifications: true,
    darkMode: false,
    language: 'hi'
  })

  useEffect(() => {
    if (user) {
      setSettings({
        locationEnabled: user.locationEnabled ?? true,
        showProfile: user.showProfile ?? true,
        notifications: user.notifications ?? true,
        darkMode: darkMode,
        language: user.language ?? 'hi'
      })
    }
  }, [user, darkMode])

  const updateSetting = async (key: string, value: boolean | string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/users/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      })
      
      if (response.ok) {
        setSettings(prev => ({ ...prev, [key]: value }))
        
        if (key === 'darkMode') {
          toggleDarkMode()
        }
      }
    } catch (error) {
      console.error('Failed to update setting:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Privacy & Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Location Privacy Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location Privacy
          </h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Location Access</p>
                <p className="text-sm text-muted-foreground">
                  Location sirf nearby dikhane ke liye
                </p>
              </div>
              <Switch
                checked={settings.locationEnabled}
                onCheckedChange={(checked) => updateSetting('locationEnabled', checked)}
                disabled={loading}
              />
            </div>
            
            <Separator />
            
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Show Profile Nearby</p>
                <p className="text-sm text-muted-foreground">
                  Nearby users ko profile dikhaye
                </p>
              </div>
              <Switch
                checked={settings.showProfile}
                onCheckedChange={(checked) => updateSetting('showProfile', checked)}
                disabled={loading}
              />
            </div>
          </div>

          <Alert className="bg-blue-500/10 border-blue-500/20">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              <strong>Location Safety:</strong> App location sirf foreground me use karti hai. 
              Background tracking nahi hoti. Aap kabhi bhi location band kar sakte ho.
            </AlertDescription>
          </Alert>
        </div>

        {/* Profile Visibility */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Profile Visibility
          </h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Public Profile</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  settings.showProfile 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {settings.showProfile ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Jab profile visible hai, tab dusre users aapko nearby helpers me dekh sakte hain.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Phone number hidden by default</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Exact location never shared</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Only approximate distance shown</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Bell className="w-4 h-4" />
            App Preferences
          </h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Help requests aur updates
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
                disabled={loading}
              />
            </div>
            
            <Separator />
            
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </p>
                <p className="text-sm text-muted-foreground">
                  Eye comfort ke liye
                </p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                disabled={loading}
              />
            </div>
            
            <Separator />
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="space-y-0.5">
                  <p className="font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </p>
                  <p className="text-sm text-muted-foreground">
                    App language preference
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={settings.language === 'hi' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('language', 'hi')}
                  className="flex-1"
                >
                  हिंदी
                </Button>
                <Button 
                  variant={settings.language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('language', 'en')}
                  className="flex-1"
                >
                  English
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Data & Security */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Data & Security
          </h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button 
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => window.open('/terms', '_blank')}
            >
              <span className="font-medium">Terms & Conditions</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <Separator />
            
            <button 
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => window.open('/privacy', '_blank')}
            >
              <span className="font-medium">Privacy Policy</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <Separator />
            
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Data Storage:</strong> Minimal data storage. No documents, no Aadhaar. 
                Only phone number for verification.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Score Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Your Trust Score
          </h2>
          
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl border border-green-500/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl font-bold">{user?.trustScore || 50}</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-medium">
                {user?.trustScore && user.trustScore >= 70 ? 'Trusted' : 
                 user?.trustScore && user.trustScore >= 40 ? 'Neutral' : 'Restricted'}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${user?.trustScore || 50}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ Successful helps: +3 points</p>
              <p>✗ No-show: -10 points</p>
              <p>⚠ Reports: -15 points</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-red-500 uppercase tracking-wide flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Danger Zone
          </h2>
          
          <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Account delete karne se saare data permanently remove ho jayega. 
              Ye action undo nahi ho sakta.
            </p>
            <Button variant="destructive" size="sm" className="w-full">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
