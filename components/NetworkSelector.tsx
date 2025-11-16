'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChainId, useSwitchChain } from 'wagmi'
import { getDeployedNetworks, DEPLOYED_NETWORK_INFO } from '@/config/contracts'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface NetworkSelectorProps {
  className?: string
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ className = '' }) => {
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const currentChainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const tNetwork = useTranslations('network')

  const deployedNetworks = getDeployedNetworks()

  const currentNetwork = DEPLOYED_NETWORK_INFO[currentChainId as keyof typeof DEPLOYED_NETWORK_INFO]
  const isCurrentNetworkSupported = deployedNetworks.some(network => network.chainId === currentChainId)

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8, // 8px gap (mt-2)
        left: rect.left,
        width: rect.width
      })
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      updateDropdownPosition()
    }
    setIsOpen(!isOpen)
  }

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      await switchChain({ chainId })
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  useEffect(() => {
    if (isOpen) {
      const handleResize = () => updateDropdownPosition()
      const handleScroll = () => updateDropdownPosition()
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
          isDark
            ? 'bg-gray-800 border-gray-600 hover:border-purple-500 text-white'
            : 'bg-white border-gray-300 hover:border-purple-500 text-gray-900'
        } ${
          !isCurrentNetworkSupported
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
            : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {currentNetwork ? (
            <>
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={currentNetwork.icon}
                  alt={`${currentNetwork.name} icon`}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">{currentNetwork.name}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentNetwork.nativeCurrency.symbol}
                </div>
              </div>
            </>
          ) : (
            <div className="text-left">
              <div className="text-sm font-semibold text-orange-600">{tNetwork('unsupportedNetwork')}</div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {tNetwork('pleaseSwitch')}
              </div>
            </div>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isPending ? 'animate-spin' : ''}`} 
        />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            className={`fixed rounded-lg shadow-2xl border z-50 ${
              isDark
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-200'
            }`}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxHeight: 'calc(100vh - 100px)', // Prevent going off screen
              overflowY: 'auto'
            }}
          >
            <div className="p-2">
              <div className={`text-xs font-medium px-3 py-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {tNetwork('availableNetworks')}
              </div>
              
              {deployedNetworks.map(({ chainId }) => {
                const networkInfo = DEPLOYED_NETWORK_INFO[chainId as keyof typeof DEPLOYED_NETWORK_INFO]
                const isSelected = chainId === currentChainId
                
                return (
                  <button
                    key={chainId}
                    onClick={() => handleNetworkSwitch(chainId)}
                    disabled={isPending || isSelected}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                      isDark
                        ? 'hover:bg-gray-700 text-white'
                        : 'hover:bg-gray-50 text-gray-900'
                    } ${
                      isSelected
                        ? isDark
                          ? 'bg-purple-900/30 border border-purple-500/50'
                          : 'bg-purple-50 border border-purple-200'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={networkInfo.icon}
                          alt={`${networkInfo.name} icon`}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{networkInfo.name}</div>
                        <div className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {networkInfo.nativeCurrency.symbol}
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <Check className="w-4 h-4 text-purple-500" />
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Info footer */}
            <div className={`border-t px-3 py-2 ${
              isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {tNetwork('onlyDeployedNetworks')}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

export default NetworkSelector
