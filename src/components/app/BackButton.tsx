'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useAppStore } from '@/store'

interface BackButtonProps {
  className?: string
  darkMode?: boolean
}

export function BackButton({ className = '', darkMode }: BackButtonProps) {
  const { goBack, darkMode: storeDarkMode } = useAppStore()
  const isDark = darkMode ?? storeDarkMode
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={goBack} 
      className={`rounded-xl ${className}`}
    >
      <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
    </Button>
  )
}
