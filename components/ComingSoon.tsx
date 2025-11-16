'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Rocket, Twitter, Send, Globe, FileText } from 'lucide-react'

const ComingSoon: React.FC = () => {
  const t = useTranslations('comingSoon')

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-purple-50 via-white to-violet-50" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'all'
    }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 bg-gradient-to-r from-[#6d28d9] to-[#c084fc] animate-pulse">
            <Rocket className="w-12 h-12 text-white" />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-900">
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-gray-600">
            {t('subtitle')}
          </p>

          {/* Description */}
          <p className="text-lg mb-12 max-w-2xl mx-auto text-gray-500">
            {t('description')}
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto mb-12 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6d28d9] to-[#c084fc] rounded-full animate-pulse"
              style={{ width: '65%' }}
            ></div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <a 
              href={t('links.twitter')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href={t('links.telegram')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Send className="w-5 h-5" />
            </a>
            <a 
              href={t('links.website')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a 
              href={t('links.docs')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <FileText className="w-5 h-5" />
            </a>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-400">
            {t('stayTuned')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon