'use client'

import React, { useEffect } from 'react'
import { X, LogOut, AlertCircle } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslations } from 'next-intl'

interface DisconnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  walletAddress?: string
}

const DisconnectModal: React.FC<DisconnectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  walletAddress
}) => {
  const { isDark } = useTheme()
  const tWallet = useTranslations('wallet.disconnect')

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    // width of the scrollbar we're about to hide
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    const original = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
      overflowY: document.body.style.overflowY,
    };

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll'; // keep scroll area stable
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`; // prevent layout shift
    }

    return () => {
      document.body.style.position = original.position;
      document.body.style.top = original.top;
      document.body.style.width = original.width;
      document.body.style.overflowY = original.overflowY;
      document.body.style.paddingRight = original.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[61] p-4 pointer-events-none">
        <div 
          className={`relative max-w-md w-full rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 pointer-events-auto ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`p-3 rounded-full ${
                isDark ? 'bg-orange-900/20' : 'bg-orange-100'
              }`}>
                <AlertCircle className="w-16 h-16 text-orange-500" />
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-2xl font-bold text-center mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {tWallet('title')}
            </h3>

            {/* Message */}
            <p className={`text-center mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {tWallet('message')}
            </p>

            {/* Wallet Address */}
            {walletAddress && (
              <div className={`mt-4 p-3 rounded-lg ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`text-xs mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {tWallet('connectedWallet')}
                </div>
                <div className={`text-sm font-mono ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              </div>
            )}

            {/* Sub Message */}
            <p className={`text-center text-sm mt-4 mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {tWallet('subMessage')}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
                  isDark
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-white'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900'
                }`}
              >
                {tWallet('cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {tWallet('disconnect')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DisconnectModal