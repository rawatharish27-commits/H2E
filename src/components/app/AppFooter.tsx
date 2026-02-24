'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store'
import { HandHeart, Shield, FileText, Lock, Scale, Info } from 'lucide-react'

export function AppFooter() {
  const { setScreen, darkMode } = useAppStore()

  const footerLinks = [
    { id: 'about', label: 'About Us', labelHi: 'हमारे बारे में', icon: Info },
    { id: 'terms', label: 'Terms', labelHi: 'नियम', icon: FileText },
    { id: 'privacy', label: 'Privacy', labelHi: 'गोपनीयता', icon: Lock },
    { id: 'legal', label: 'Legal', labelHi: 'कानूनी', icon: Scale },
  ]

  return (
    <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border-t py-6 px-4 mt-auto`}>
      <div className="max-w-lg mx-auto">
        {/* Logo Row */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <HandHeart className="w-4 h-4 text-white" />
          </div>
          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Community Help Network</span>
        </div>

        {/* Links Row */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
          {footerLinks.map((link) => (
            <motion.button
              key={link.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen(link.id as any)}
              className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`}
            >
              <link.icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className={`h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} my-4`} />

        {/* Copyright */}
        <div className="text-center">
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} Harish Rawat. All rights reserved.
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-300'} mt-1`}>
            Made with ❤️ in India
          </p>
        </div>

        {/* Disclaimer */}
        <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
          <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <Shield className="w-3 h-3 inline mr-1" />
            This platform connects users for local help. We are not liable for any transactions, services, or disputes between users.
          </p>
        </div>
      </div>
    </footer>
  )
}
