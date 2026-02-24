'use client'

import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const SIZES = {
  sm: { logo: 32, text: 'text-lg' },
  md: { logo: 48, text: 'text-xl' },
  lg: { logo: 64, text: 'text-2xl' },
  xl: { logo: 96, text: 'text-4xl' },
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { logo, text } = SIZES[size]
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex-shrink-0 rounded-full overflow-hidden shadow-lg"
        style={{ width: logo, height: logo }}
      >
        <Image
          src="/images/logo.png"
          alt="Community Help Network Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${text}`}>
            <span className="text-blue-600">Community</span>
            <span className="text-green-600"> Help </span>
            <span className="text-orange-600">Network</span>
          </span>
        </div>
      )}
    </div>
  )
}

// Large centered logo for splash screens - Round 3D look
export function LogoLarge({ tagline = 'Connecting People', taglineHi = 'लोगों को जोड़ना' }: { tagline?: string; taglineHi?: string }) {
  return (
    <div className="flex flex-col items-center">
      {/* Round 3D Logo Container */}
      <div 
        className="
          w-32 h-32 relative mb-6
          rounded-full overflow-hidden
          bg-gradient-to-br from-white via-gray-50 to-gray-100
          shadow-[0_10px_40px_rgba(0,0,0,0.3),_0_0_0_4px_rgba(255,255,255,0.8),_inset_0_-5px_20px_rgba(0,0,0,0.1)]
          animate-bounce-in
        "
      >
        {/* 3D Inner Shadow Effect */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.9)] z-10 pointer-events-none" />
        
        {/* Logo Image */}
        <Image
          src="/images/logo.png"
          alt="Community Help Network Logo"
          fill
          className="object-cover"
          priority
        />
        
        {/* Glossy 3D Highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent z-20 pointer-events-none" />
      </div>
      
      {/* Brand Name */}
      <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
        <span className="text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.3)]">Community</span>
        <span className="text-green-600 drop-shadow-[0_2px_4px_rgba(22,163,74,0.3)]"> Help </span>
        <span className="text-orange-600 drop-shadow-[0_2px_4px_rgba(234,88,12,0.3)]">Network</span>
      </h1>
      
      {/* Taglines */}
      <p className="text-lg opacity-90 text-white drop-shadow-md">
        {tagline}
      </p>
      
      <p className="text-sm opacity-70 mt-1 text-white/80">
        {taglineHi}
      </p>
    </div>
  )
}

// Icon-only logo for compact spaces - Round 3D look
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div 
      className={`
        relative flex-shrink-0 rounded-full overflow-hidden
        bg-gradient-to-br from-white via-gray-50 to-gray-100
        shadow-[0_4px_15px_rgba(0,0,0,0.2),_inset_0_1px_4px_rgba(255,255,255,0.8)]
        ${className}
      `}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/logo.png"
        alt="Community Help Network"
        fill
        className="object-cover"
        priority
      />
      {/* Glossy highlight */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
