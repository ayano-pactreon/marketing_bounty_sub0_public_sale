'use client'

import React from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSwitchChain, useChainId } from 'wagmi'
import { getDeployedNetworks, DEPLOYED_NETWORK_INFO } from '@/config/contracts'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface UnsupportedNetworkModalProps {
  isOpen: boolean
  onClose: () => void
}

const UnsupportedNetworkModal: React.FC<UnsupportedNetworkModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme()
  const tUnsupportedNetwork = useTranslations('unsupportedNetwork')
  const currentChainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const deployedNetworks = getDeployedNetworks()
  const currentNetwork = DEPLOYED_NETWORK_INFO[currentChainId as keyof typeof DEPLOYED_NETWORK_INFO]

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      await switchChain({ chainId })
      onClose() // Close modal after successful switch
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl ${
        isDark
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {tUnsupportedNetwork('title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentNetwork ? (
              <>
                {tUnsupportedNetwork('currentNetwork')} <span className="font-medium text-orange-600 dark:text-orange-400">{currentNetwork.name}</span>.
              </>
            ) : (
              <>
                {tUnsupportedNetwork('description')}
              </>
            )}
          </p>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {tUnsupportedNetwork('instruction')}
          </p>

          {/* Network Options */}
          <div className="space-y-2">
            {deployedNetworks.map(({ chainId }) => {
              const networkInfo = DEPLOYED_NETWORK_INFO[chainId as keyof typeof DEPLOYED_NETWORK_INFO]
              
              return (
                <button
                  key={chainId}
                  onClick={() => handleNetworkSwitch(chainId)}
                  disabled={isPending}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                    isDark
                      ? 'border-gray-600 hover:border-purple-500 bg-gray-700/50 hover:bg-gray-700'
                      : 'border-gray-200 hover:border-purple-500 bg-gray-50 hover:bg-purple-50'
                  } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={networkInfo.icon}
                      alt={`${networkInfo.name} icon`}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {networkInfo.name}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {tUnsupportedNetwork('nativeToken')} {networkInfo.nativeCurrency.symbol}
                    </div>
                  </div>
                  {isPending && (
                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={`text-xs p-3 rounded-lg ${
          isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-600'
        }`}>
          {tUnsupportedNetwork('tip')}
        </div>
      </div>
    </div>
  )
}

export default UnsupportedNetworkModal