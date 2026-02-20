'use client'

import Image from 'next/image'

// Large centered logo for splash screens - Round 3D look (No hydration issues)
function LogoLarge({ tagline = 'Connecting People', taglineHi = 'लोगों को जोड़ना' }: { tagline?: string; taglineHi?: string }) {
  return (
    <div className="flex flex-col items-center">
      {/* Round 3D Logo Container */}
      <div 
        className="
          w-32 h-32 relative mb-6
          rounded-full overflow-hidden
          logo-3d
          animate-bounce-in
        "
      >
        {/* Glossy 3D Highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-transparent z-20 pointer-events-none" />
        
        {/* Logo Image */}
        <Image
          src="/images/logo.png"
          alt="Help2Earn Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Brand Name */}
      <h1 className="text-4xl font-bold mb-2 animate-fade-in-up drop-shadow-lg">
        <span className="text-blue-600">Help</span>
        <span className="text-green-600">2</span>
        <span className="text-orange-600">Earn</span>
      </h1>
      
      {/* Taglines */}
      <p className="text-lg opacity-90 text-white drop-shadow-md animate-fade-in-delay-1">
        {tagline}
      </p>
      
      <p className="text-sm opacity-70 mt-1 text-white/80 animate-fade-in-delay-2">
        {taglineHi}
      </p>
    </div>
  )
}

// Simple splash screen - just branding
function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <LogoLarge />
      
      <div className="mt-10 animate-fade-in-delay-3">
        <div className="w-10 h-10 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  )
}

export default SplashScreen
