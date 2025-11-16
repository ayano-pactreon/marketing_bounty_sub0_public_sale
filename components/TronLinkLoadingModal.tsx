'use client'

import React from 'react'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslations } from 'next-intl'

interface TronLinkLoadingModalProps {
  isOpen: boolean
}

export default function TronLinkLoadingModal({ isOpen }: TronLinkLoadingModalProps) {
  const { isDark } = useTheme()
  const tTronlink = useTranslations('tronlink.loading')

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[61] p-4">
        <div 
          className={`relative w-full max-w-sm backdrop-blur-md border rounded-2xl shadow-2xl transform transition-all duration-300 ${
            isDark
              ? 'bg-gray-800/95 border-gray-600'
              : 'bg-white/95 border-gray-200'
          }`}
        >
          {/* Content */}
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDark ? 'bg-orange-500/20' : 'bg-orange-50'
              }`}>
                <Image
                  src="/wallet-icons/tronlink.png"
                  alt="TronLink"
                  width={32}
                  height={32}
                  className="rounded animate-pulse"
                />
              </div>
            </div>

            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {tTronlink('title')}
            </h3>
            
            <p className={`text-sm mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {tTronlink('message')}
            </p>

            {/* Loading Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`w-8 h-8 border-2 border-transparent rounded-full animate-spin ${
                  isDark ? 'border-t-orange-400' : 'border-t-orange-500'
                }`} />
                <div className={`absolute top-0 left-0 w-8 h-8 border-2 border-transparent rounded-full animate-spin ${
                  isDark ? 'border-r-orange-400' : 'border-r-orange-500'
                }`} style={{ animationDelay: '0.15s', animationDirection: 'reverse' }} />
              </div>
            </div>

            <div className={`mt-6 text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {tTronlink('subMessage')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}