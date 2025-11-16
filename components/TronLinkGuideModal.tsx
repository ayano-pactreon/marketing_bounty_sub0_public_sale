'use client'

import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslations } from 'next-intl'

interface TronLinkGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TronLinkGuideModal({ isOpen, onClose }: TronLinkGuideModalProps) {
  const { isDark } = useTheme()
  const tTronlink = useTranslations('tronlink.guide')

  if (!isOpen) {
    return null
  }
  
  console.log('🚨 TronLinkGuideModal is rendering - isOpen:', isOpen)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[51] p-4">
        <div 
          className={`relative w-full max-w-md backdrop-blur-md border rounded-2xl shadow-2xl transform transition-all duration-300 ${
            isDark
              ? 'bg-gray-800/95 border-gray-600'
              : 'bg-white/95 border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? 'bg-orange-500/20' : 'bg-orange-50'
              }`}>
                <Image
                  src="/wallet-icons/tronlink.png"
                  alt="TronLink"
                  width={24}
                  height={24}
                  className="rounded"
                />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {tTronlink('title')}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {tTronlink('subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className={`rounded-lg p-4 mb-4 ${
              isDark 
                ? 'bg-orange-500/10 border border-orange-500/20' 
                : 'bg-orange-50 border border-orange-200'
            }`}>
              <p className={`text-sm ${
                isDark ? 'text-orange-200' : 'text-orange-800'
              }`}>
                {tTronlink('description')}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#6d28d9] to-[#c084fc] flex-shrink-0 mt-0.5`}>
                  1
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {tTronlink('step1.title')}
                  </p>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tTronlink('step1.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#6d28d9] to-[#c084fc] flex-shrink-0 mt-0.5`}>
                  2
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {tTronlink('step2.title')}
                  </p>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tTronlink('step2.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#6d28d9] to-[#c084fc] flex-shrink-0 mt-0.5`}>
                  3
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {tTronlink('step3.title')}
                  </p>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tTronlink('step3.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className={`mt-6 p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className={`text-xs font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {tTronlink('help.title')}
              </p>
              <ul className={`text-xs space-y-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>• {tTronlink('help.items.0')}</li>
                <li>• {tTronlink('help.items.1')}</li>
                <li>• {tTronlink('help.items.2')}</li>
                <li>• {tTronlink('help.items.3')}</li>
              </ul>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full mt-6 bg-gradient-to-r from-[#6d28d9] to-[#c084fc] text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {tTronlink('button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}