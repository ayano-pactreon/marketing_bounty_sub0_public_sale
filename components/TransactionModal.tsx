'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { X, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChainId } from 'wagmi'
import { purchaseService } from '@/services/purchase-service'
import { useTranslations } from 'next-intl'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  status: 'pending' | 'success' | 'error' | null
  hash?: string
  tokenAmount?: string
  paymentAmount?: string
  paymentCurrency?: string
  errorMessage?: string
  walletAddress?: string
  referralCode?: string
  networkName?: string
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  status,
  hash,
  tokenAmount,
  paymentAmount,
  paymentCurrency,
  errorMessage,
  walletAddress,
  referralCode,
  networkName
}) => {
  const { isDark } = useTheme()
  const chainId = useChainId()
  const tTransaction = useTranslations('transaction.modal')
  const [isSubmittingPurchase, setIsSubmittingPurchase] = useState(false)
  const [, setPurchaseSubmitted] = useState(false)
  const [attemptedSubmission, setAttemptedSubmission] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  
  // Helper function to get network name from chainId
  const getNetworkName = useCallback(() => {
    if (networkName) return networkName
    
    switch (chainId) {
      case 1284: return 'moonbeam'
      case 1287: return 'moonbase-alpha'
      case 80002: return 'polygon-amoy'
      case 1: return 'ethereum'
      case 137: return 'polygon'
      case 8453: return 'base'
      default: return 'ethereum'
    }
  }, [networkName, chainId])

  // Submit purchase to API when transaction is successful - only once per transaction
  useEffect(() => {
    const submitPurchaseToAPI = async () => {
      // Create a unique key for this transaction
      
      if (
        status === 'success' &&
        hash &&
        walletAddress &&
        tokenAmount &&
        !attemptedSubmission &&
        !isSubmittingPurchase
      ) {
        try {
          setIsSubmittingPurchase(true)
          setAttemptedSubmission(true)
          
          // Parse token amount (remove commas and convert to number)
          const tokens = parseFloat(tokenAmount.replace(/,/g, ''))
          
          await purchaseService.submitPurchase({
            walletAddress,
            tokens,
            referralCode: referralCode || undefined,
            network: getNetworkName(),
            transactionHash: hash
          })
          
          setPurchaseSubmitted(true)
        } catch (error) {
          console.error('❌ Failed to submit purchase to API:', error)
          // Capture the error for display to user
          const errorMessage = error instanceof Error ? error.message : 'Failed to submit purchase to API'
          setApiError(errorMessage)
          // Don't reset attemptedSubmission on error to prevent retries
        } finally {
          setIsSubmittingPurchase(false)
        }
      }
    }

    submitPurchaseToAPI()
  }, [status, hash, walletAddress, tokenAmount, attemptedSubmission, isSubmittingPurchase, referralCode, getNetworkName])

  // Reset submission state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setPurchaseSubmitted(false)
      setIsSubmittingPurchase(false)
      setAttemptedSubmission(false)
      setApiError(null)
    }
  }, [isOpen])
  
  
  if (!isOpen) return null

  // Get block explorer URL based on network
  const getExplorerUrl = () => {
    if (!hash) return ''
    
    // If this is a Solana transaction (detected by SOL currency), use Solscan
    if (paymentCurrency === 'SOL') {
      return `https://solscan.io/tx/${hash}?cluster=devnet`
    }
    
    // If this is a TRON transaction (detected by TRX/USDT/USDC currency), use TronScan
    if (paymentCurrency === 'TRX' || (paymentCurrency === 'USDT' && networkName === 'tron') || (paymentCurrency === 'USDC' && networkName === 'tron')) {
      // For TRON testnet (Nile), use nile.tronscan.org; for mainnet, use tronscan.org
      // You can enhance this logic based on your TRON network detection
      return `https://nile.tronscan.org/#/transaction/${hash}` // Default to Nile testnet for now
    }
    
    // Otherwise use EVM block explorers
    switch (chainId) {
      case 1284: // Moonbeam Mainnet
        return `https://moonscan.io/tx/${hash}`
      case 1287: // Moonbase Alpha
        return `https://moonbase.moonscan.io/tx/${hash}`
      case 80002: // Polygon Amoy
        return `https://amoy.polygonscan.com/tx/${hash}`
      case 1: // Mainnet
        return `https://etherscan.io/tx/${hash}`
      case 137: // Polygon
        return `https://polygonscan.com/tx/${hash}`
      case 8453: // Base
        return `https://basescan.org/tx/${hash}`
      default:
        return `https://etherscan.io/tx/${hash}`
    }
  }

  const getStatusContent = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />,
          title: tTransaction('pending.title'),
          message: tTransaction('pending.message'),
          subMessage: tTransaction('pending.subMessage')
        }
      
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: tTransaction('success.title'),
          message: tokenAmount ? tTransaction('success.message', { tokenAmount }) : tTransaction('success.messageGeneric'),
          subMessage: paymentAmount && paymentCurrency ? tTransaction('success.subMessage', { paymentAmount, paymentCurrency }) : ''
        }
      
      case 'error':
        // Check if this is a referral code error
        const isReferralError = errorMessage && (
          errorMessage.toLowerCase().includes('invalid referral code') || 
          errorMessage.toLowerCase().includes('referral') ||
          errorMessage.toLowerCase().includes('inactive')
        )
        
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: isReferralError ? tTransaction('error.titleReferral') : tTransaction('error.title'),
          message: isReferralError ? tTransaction('error.messageReferral') : (errorMessage || tTransaction('error.message')),
          subMessage: getErrorSubMessage(errorMessage)
        }
      
      default:
        return null
    }
  }

  const getErrorSubMessage = (errorMessage?: string) => {
    if (!errorMessage) return tTransaction('error.subMessageDefault')
    
    // Check for referral code errors
    if (errorMessage.toLowerCase().includes('invalid referral code') || 
        errorMessage.toLowerCase().includes('referral') ||
        errorMessage.toLowerCase().includes('inactive')) {
      return tTransaction('error.subMessageReferral')
    }
    
    if (errorMessage.toLowerCase().includes('network connection issue')) {
      return tTransaction('error.subMessageNetwork')
    }
    
    if (errorMessage.toLowerCase().includes('insufficient funds')) {
      return tTransaction('error.subMessageFunds')
    }
    
    if (errorMessage.toLowerCase().includes('cancelled by user')) {
      return tTransaction('error.subMessageCancelled')
    }
    
    if (errorMessage.toLowerCase().includes('gas fees')) {
      return tTransaction('error.subMessageGas')
    }
    
    return tTransaction('error.subMessageGeneric')
  }

  const content = getStatusContent()
  const explorerUrl = getExplorerUrl()

  if (!content) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
        <div 
          className={`relative max-w-md w-full rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - always show */}
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
              {content.icon}
            </div>

            {/* Title */}
            <h3 className={`text-2xl font-bold text-center mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {content.title}
            </h3>

            {/* Message */}
            <p className={`text-center mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {content.message}
            </p>

            {/* Sub Message */}
            {content.subMessage && (
              <p className={`text-center text-sm mb-6 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {content.subMessage}
              </p>
            )}

            {/* API Error Display */}
            {apiError && status === 'success' && (
              <div className={`mt-6 p-3 rounded-lg border ${
                isDark ? 'bg-red-900/20 border-red-600 text-red-400' : 'bg-red-50 border-red-300 text-red-600'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{tTransaction('api.error.title')}</span>
                </div>
                <div className="text-xs">
                  {apiError}
                </div>
              </div>
            )}

            {/* Transaction Hash / Explorer Link */}
            {hash && status !== 'pending' && (
              <div className={`mt-6 p-3 rounded-lg ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tTransaction('hash.title')}
                  </span>
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-600 transition-colors"
                  >
                    {tTransaction('hash.viewOnExplorer')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className={`mt-1 text-xs font-mono break-all ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {hash.slice(0, 10)}...{hash.slice(-8)}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              {status === 'success' && (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    {tTransaction('success.continue')}
                  </button>
                  {explorerUrl && (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
                        isDark
                          ? 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/10'
                          : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </>
              )}
              
              {status === 'error' && (
                <button
                  onClick={onClose}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  {tTransaction('error.tryAgain')}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default TransactionModal
