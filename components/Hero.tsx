'use client'

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import {ArrowRight} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';
import {useAccount, useConnect, useDisconnect, useChainId} from "wagmi";
import { useWallet } from '@solana/wallet-adapter-react';
import { useTron } from '@/contexts/TronContext';
import WalletModal from "@/components/WalletModal";
import TransactionModal from "@/components/TransactionModal";
import NetworkSelector from "@/components/NetworkSelector";
import UnsupportedNetworkModal from "@/components/UnsupportedNetworkModal";
import TronLinkGuideModal from "@/components/TronLinkGuideModal";
import DisconnectModal from "@/components/DisconnectModal";
import {useTranslations} from "next-intl";
import { usePresaleContract } from '@/hooks/usePresaleContract';
import { useTokenApproval } from '@/hooks/useTokenApproval';
import { useAggregatedUserTokens } from '@/hooks/useAggregatedUserTokens';
import { useAggregatedProgress } from '@/hooks/useAggregatedProgress';
import { useTronPresaleContract } from '@/hooks/useTronPresaleContract';
import { parseUnits, Address, formatUnits } from 'viem';
import { STABLECOIN_ADDRESSES, getDeployedNetworks, STAGE_CONFIG, getStablecoinDecimals} from '@/config/contracts';
import { TRON_STABLECOIN_ADDRESSES } from '@/config/tron';
import { useSearchParams, useRouter } from 'next/navigation';
import { useReferralValidation } from '@/hooks/useReferralValidation';
import { useSolanaPresale } from '@/hooks/useSolanaPresale';
import { useNativeBalance } from '@/hooks/useNativeBalance';
import { PublicKey } from '@solana/web3.js';
import { isWalletEnabled } from '@/utils/walletConfig';
import { useIsMobile } from '@/hooks/useIsMobile';
import { applyAnimation, applyAOS, filterHoverAnimations } from '@/utils/animations';

// Inner component that uses useSearchParams
const HeroContent = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  
  // Get translations first
  const tHero = useTranslations('hero');
  const tIco = useTranslations('ico');
  const tCountdown = useTranslations('countdown');
  const tCommon = useTranslations('common');
  const tWallet = useTranslations('wallet');
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Remove local timeLeft state - we'll use contractTimeLeft from the hook
  // const [timeLeft, setTimeLeft] = useState({
  //   days: 15,
  //   hours: 8,
  //   minutes: 32,
  //   seconds: 45
  // });
  const [investAmount, setInvestAmount] = useState('1000');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [mounted, setMounted] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isReferralFromQuery, setIsReferralFromQuery] = useState(false);
  const searchParams = useSearchParams();
  const {isPending} = useConnect();
    const {isConnected, address} = useAccount();
    
    // Solana wallet state
    const { connected: isSolanaConnected, publicKey: solanaPublicKey, disconnect: disconnectSolana } = useWallet();
    
    // TRON wallet state  
    const {
      isConnected: isTronConnected,
      address: tronAddress,
      disconnect: disconnectTron,
      showGuideModal: showTronGuideModal,
      setShowGuideModal: setShowTronGuideModal
    } = useTron();
    
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showUnsupportedNetworkModal, setShowUnsupportedNetworkModal] = useState(false);
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'error' | null>(null);
    const [purchasedTokenAmount, setPurchasedTokenAmount] = useState<string>('');
  const [transactionErrorMessage, setTransactionErrorMessage] = useState<string>('');
  const [solanaTransactionSignature, setSolanaTransactionSignature] = useState<string>('');
    const { disconnect } = useDisconnect()
    const chainId = useChainId()

  // Smart contract integration
  const {
    tokenPrice,
    ethPrice,
    ethPriceLoading,
    getStablecoinPrice,
    isPresaleActive,
    progressPercentage: contractProgress,
    // Stage/Round data from smart contract
    currentRound: contractCurrentRound,
    currentStageInfo,
    stageProgressPercentage,
    getStageProgressPercentage,
    remainingStageAllocation,
    isStageComplete,
    validatePurchaseAmount,
    timeLeft: contractTimeLeft,
    refereeRewardPercent,
    buyWithETH,
    buyWithStablecoin,
    isPending: isTransactionPending,
    isConfirming,
    isConfirmed,
    error: contractError,
    contractAddress,
    hash,
    resetTransaction,
  } = usePresaleContract()

  // Aggregated user tokens across all networks
  const { 
    totalTokensNumber, 
    tokensByNetwork, 
    isLoading: isLoadingAggregatedTokens,
    refetch: refetchTokenBalance
  } = useAggregatedUserTokens()

  // Aggregated progress across all networks
  const {
    progressPercentage: aggregatedProgress,
    aggregatedTotalRaised,
    isPurchaseDisabled: isAggregatedPurchaseDisabled,
    isLoading: isLoadingAggregatedProgress
  } = useAggregatedProgress()

  // Solana presale integration - only when Solana wallet is connected
  const {
    userStats: solanaUserStats,
    buyWithSol,
    solPrice,
    tokenPrice: solanaTokenPrice,
    isLoadingSolPrice,
    isLoadingTokenPrice,
    refreshSolPrice,
    refreshTokenPrice
  } = useSolanaPresale()

  // TRON presale integration - only when TRON wallet is connected
  const {
    tokenPrice: tronTokenPrice,
    ethPrice: tronETHPrice,
    userTokens: tronUserTokens,
    trxBalance,
    usdtBalance,
    getBalanceForCurrency,
    buyWithTRX,
    buyWithStablecoin: buyTronStablecoin,
    transactionState: tronTransactionState,
    isPresaleActive: tronIsPresaleActive
  } = useTronPresaleContract()

  // Calculate total tokens including TRON and Solana (after all hooks are initialized)
  const getFinalTotalTokens = () => {
    let total = totalTokensNumber; // EVM tokens from all networks
    
    // Add TRON tokens if connected and available
    if (isTronConnected && tronUserTokens?.data) {
      // Handle different possible data types from TRON contract
      let rawTokenAmount;
      if (typeof tronUserTokens.data === 'bigint') {
        rawTokenAmount = Number(tronUserTokens.data);
      } else if (typeof tronUserTokens.data === 'string' && tronUserTokens.data.startsWith('0x')) {
        rawTokenAmount = parseInt(tronUserTokens.data, 16);
      } else {
        rawTokenAmount = parseFloat(tronUserTokens.data.toString());
      }
      
      // Try multiple conversion methods
      const method1 = rawTokenAmount / 1e18;
      const method2 = rawTokenAmount / 1e6; // SUN to TRX conversion
      const method3 = rawTokenAmount; // Maybe it's already in the right format
      
      // Choose the appropriate conversion method
      let tronTokenAmount;
      if (method2 > 0 && method2 < 1e10) { // Reasonable token amount
        tronTokenAmount = method2;
      } else if (method1 > 0 && method1 < 1e10) {
        tronTokenAmount = method1;  
      } else {
        tronTokenAmount = method3;
      }
      
      total += tronTokenAmount;
    }
    
    // Add Solana tokens if connected and available
    if (isSolanaConnected && solanaUserStats?.totalTokensPurchased) {
      total += solanaUserStats.totalTokensPurchased;
    }
    return total;
  };

  const finalTotalTokens = getFinalTotalTokens();

  // Get the appropriate presale active state based on connected wallet
  const getIsPresaleActive = () => {
    if (isTronConnected && (selectedCurrency === 'TRX' || selectedCurrency === 'USDT')) {
      return tronIsPresaleActive?.data ?? false;
    }
    return isPresaleActive ?? false;
  };
  const currentPresaleActive = getIsPresaleActive();

  // Get available payment methods based on current network - memoized to prevent infinite loop
  const availablePaymentMethods = useMemo(() => {
    // If no wallet is connected at all, show only stablecoins (USDT and USDC)
    if (!isConnected && !isTronConnected && !isSolanaConnected) {
      return [
        { symbol: 'USDT', name: 'Tether USD', type: 'stablecoin' },
        { symbol: 'USDC', name: 'USD Coin', type: 'stablecoin' }
      ]
    }

    // If TRON wallet is connected, show TRX and TRON stablecoins
    if (isTronConnected) {
      const methods = [{ symbol: 'TRX', name: 'Tron', type: 'native' }]

      // Add TRON stablecoins if available
      const networkKey = 'nile' // You can make this dynamic based on your network setup
      if (TRON_STABLECOIN_ADDRESSES.USDT[networkKey as keyof typeof TRON_STABLECOIN_ADDRESSES.USDT]) {
        methods.push({ symbol: 'USDT', name: 'Tether USD (TRC20)', type: 'stablecoin' })
      }

      return methods
    }

    // If Solana wallet is connected, only show SOL
    if (isSolanaConnected) {
      return [{ symbol: 'SOL', name: 'Solana', type: 'native' }]
    }

    // For Ethereum wallets, show existing logic
    if (!chainId || !contractAddress) return []

    const methods = []

    // Add stablecoins if they exist on this network
    const usdtAddress = STABLECOIN_ADDRESSES.USDT[chainId as keyof typeof STABLECOIN_ADDRESSES.USDT]
    if (usdtAddress) {
      methods.push({ symbol: 'USDT', name: 'Tether USD', type: 'stablecoin' })
    }

    const usdcAddress = STABLECOIN_ADDRESSES.USDC[chainId as keyof typeof STABLECOIN_ADDRESSES.USDC]
    if (usdcAddress) {
      methods.push({ symbol: 'USDC', name: 'USD Coin', type: 'stablecoin' })
    }

    // Add xcDOT for Moonbeam mainnet
    const xcDotAddress = STABLECOIN_ADDRESSES.xcDOT?.[chainId as keyof typeof STABLECOIN_ADDRESSES.xcDOT]
    if (xcDotAddress && chainId === 1284) {
      methods.push({ symbol: 'DOT', name: 'Cross-chain DOT', type: 'stablecoin' })
    }

    // Add native token based on network
    switch (chainId) {
      case 1287: // Moonbase Alpha
        methods.push({ symbol: 'DEV', name: 'DEV Token', type: 'native' })
        break
      case 1284: // Moonbeam Mainnet
        methods.push({ symbol: 'GLMR', name: 'Glimmer', type: 'native' })
        break
      case 1: // Mainnet
        methods.push({ symbol: 'ETH', name: 'Ethereum', type: 'native' })
        break
      case 137: // Polygon
        methods.push({ symbol: 'POL', name: 'POL', type: 'native' })
        break
      case 80002: // Polygon Amoy
        methods.push({ symbol: 'POL', name: 'POL Token', type: 'native' })
        break
      case 8453: // Base
        methods.push({ symbol: 'ETH', name: 'Ethereum', type: 'native' })
        break
      case 56: // BSC Mainnet
        methods.push({ symbol: 'BNB', name: 'BNB', type: 'native' })
        break
      case 97: // BSC Testnet
        methods.push({ symbol: 'BNB', name: 'BNB', type: 'native' })
        break
      default:
        methods.push({ symbol: 'ETH', name: 'Native Token', type: 'native' })
    }

    return methods
  }, [chainId, contractAddress, isSolanaConnected, isTronConnected, isConnected])
  const isNativeToken = (symbol: string) => availablePaymentMethods.find(m => m.symbol === symbol)?.type === 'native'

  // Get current selected token address
  const getSelectedTokenAddress = () => {
    if (isNativeToken(selectedCurrency) || !selectedCurrency) return undefined

    // Handle DOT (xcDOT) specifically for Moonbeam
    if (selectedCurrency === 'DOT') {
      return STABLECOIN_ADDRESSES.xcDOT?.[chainId as keyof typeof STABLECOIN_ADDRESSES.xcDOT] as Address
    }

    const currencyAddresses = STABLECOIN_ADDRESSES[selectedCurrency as keyof typeof STABLECOIN_ADDRESSES]
    return currencyAddresses?.[chainId as keyof typeof currencyAddresses] as Address
  }

  // Token approval hook for stablecoins
  const selectedTokenAddress = getSelectedTokenAddress()
  const {
    allowance,
    balance: tokenBalance,
    approve,
    isPending: isApproving,
    isConfirming: isApprovalConfirming,
  } = useTokenApproval(
    selectedTokenAddress,
    address,
    contractAddress as Address
  )

  // Native balance hook for checking native token balance
  const {
    formattedBalance: nativeBalance,
    hasInsufficientBalance: hasInsufficientNativeBalance,
  } = useNativeBalance()

    // Check if any wallet is connected (based on enabled wallets)
    const isAnyWalletConnected = isConnected || 
      (isWalletEnabled.solana() && isSolanaConnected) || 
      (isWalletEnabled.tron() && isTronConnected);
    
    const connectedAddress = isConnected ? address : 
      (isWalletEnabled.solana() && isSolanaConnected ? solanaPublicKey?.toBase58() : 
       isWalletEnabled.tron() && isTronConnected ? tronAddress : '') || '';

    const handleConnectWallet = async () => {
        if (isAnyWalletConnected) {
            // Show disconnect modal instead of directly disconnecting
            setShowDisconnectModal(true)
        } else {
            setShowWalletModal(true)
        }
    }

    const handleDisconnect = async () => {
        try {
            // Disconnect based on which wallet is connected
            if (isConnected) {
                await disconnect()
            }
            if (isWalletEnabled.solana() && isSolanaConnected) {
                await disconnectSolana()
            }
            if (isWalletEnabled.tron() && isTronConnected) {
                disconnectTron()
            }
        } catch (err) {
            console.warn('Disconnect error:', err)
        }
    }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Removed local countdown calculation - now using contractTimeLeft from hook

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle referral code from URL query parameters
  useEffect(() => {
    if (!mounted) return; // Wait for component to mount
    
    const referralParam = searchParams.get('ref') || searchParams.get('referral');
    if (referralParam) {
      setReferralCode(referralParam);
      setIsReferralFromQuery(true);
    } else {
      setIsReferralFromQuery(false);
    }
  }, [mounted, searchParams]);


  // Helper function to get preferred default currency
  const getDefaultCurrency = (methods: typeof availablePaymentMethods) => {
    if (methods.length === 0) return '';
    
    // Prefer USDT as default when available
    const usdtMethod = methods.find(m => m.symbol === 'USDT');
    if (usdtMethod) return 'USDT';
    
    // If no USDT, use the first available method
    return methods[0].symbol;
  };

  // Reset currency selection when chain changes
  useEffect(() => {
    if (availablePaymentMethods.length > 0) {
      setSelectedCurrency(getDefaultCurrency(availablePaymentMethods))
    } else {
      setSelectedCurrency('')
    }
    
    // Clear transaction state when network changes to prevent modal issues
    setShowTransactionModal(false)
    setTransactionStatus(null)
    setPurchasedTokenAmount('')
    setTransactionErrorMessage('')
    // Clear processed transactions to start fresh on new network
    setProcessedTransactions(new Set())
    // Reset transaction network tracker
    setTransactionNetwork(null)
    // CRITICAL: Reset wagmi transaction state to clear the stale hash
    resetTransaction()
  }, [chainId, contractAddress, availablePaymentMethods, resetTransaction])

  // Set default payment method when available methods change and no currency is selected
  useEffect(() => {
    if (availablePaymentMethods.length > 0 && !selectedCurrency) {
      setSelectedCurrency(getDefaultCurrency(availablePaymentMethods))
    }
  }, [availablePaymentMethods, selectedCurrency])

  // Use smart contract data with fallback from translations when wallet is not connected
  const priceFromTranslations = tCommon('pricePerZedi');
  const fallbackPrice = parseFloat(priceFromTranslations) || 0.025;
  
  // Determine which token price to use based on connected wallet
  const getCurrentTokenPrice = () => {
    // If TRON is connected and has price data, use TRON price
    if (isTronConnected && tronTokenPrice && parseFloat(tronTokenPrice) > 0) {
      return parseFloat(tronTokenPrice);
    }
    
    // If Solana is connected and has price data, use Solana price
    if (isSolanaConnected && solanaTokenPrice && solanaTokenPrice > 0) {
      return solanaTokenPrice;
    }
    
    // If EVM is connected and has price data, use EVM price
    if (isConnected && tokenPrice && parseFloat(tokenPrice) > 0) {
      return parseFloat(tokenPrice);
    }
    
    // If no wallet is connected but EVM price is available, use it anyway for display
    if (!isConnected && !isTronConnected && !isSolanaConnected && tokenPrice && parseFloat(tokenPrice) > 0) {
      return parseFloat(tokenPrice);
    }
    
    // Fallback to translations price
    return fallbackPrice;
  };
  
  const currentPrice = getCurrentTokenPrice();
  
  // Calculate token amount based on payment method
  const calculateTokenAmount = () => {
    if (!currentPrice || !investAmount) return 0;
    
    let usdAmount = 0;
    if (isNativeToken(selectedCurrency)) {
      if (selectedCurrency === 'SOL') {
        // For Solana, use the real SOL price from Pyth oracle via smart contract
        // This will match the price the contract actually uses for calculations
        const currentSolPrice = solPrice && solPrice > 0 ? solPrice : 150; // Fallback to 150 if not loaded
        usdAmount = parseFloat(investAmount) * currentSolPrice;
      } else if (selectedCurrency === 'TRX') {
        // For TRON, use ETH price from the TRON contract (which represents TRX/USD rate)
        // The actual conversion happens in the smart contract when calling buyWithETH
        const trxPrice = tronETHPrice && parseFloat(tronETHPrice) > 0 ? parseFloat(tronETHPrice) : 0.25; // Fallback to $0.25
        usdAmount = parseFloat(investAmount) * trxPrice;
      } else {
        // Use real ETH price from the contract for other native tokens
        const nativePrice = ethPrice && parseFloat(ethPrice) > 0 ? parseFloat(ethPrice) :
          (chainId === 1287 ? 0.1 : 3000); // Fallback: DEV=$0.10, ETH=$3000
        usdAmount = parseFloat(investAmount) * nativePrice;
      }
    } else {
      // Use dynamic stablecoin pricing from Chainlink feeds
      let stablecoinAddress;
      if (selectedCurrency === 'DOT') {
        // Special handling for DOT (which maps to xcDOT)
        stablecoinAddress = STABLECOIN_ADDRESSES.xcDOT?.[chainId as keyof typeof STABLECOIN_ADDRESSES.xcDOT];
      } else {
        const currencyAddresses = STABLECOIN_ADDRESSES[selectedCurrency as keyof typeof STABLECOIN_ADDRESSES];
        stablecoinAddress = currencyAddresses?.[chainId as keyof typeof currencyAddresses];
      }
      const stablecoinPrice = stablecoinAddress && getStablecoinPrice ? getStablecoinPrice(stablecoinAddress) : 1.0;
      usdAmount = parseFloat(investAmount) * stablecoinPrice;
    }
    
    return usdAmount / currentPrice;
  };
  
  const tokenAmount = calculateTokenAmount();
  
  // Always use aggregated progress across all networks for the main progress bar
  // This ensures consistent progress display regardless of which network is connected
  const actualProgressPercentage = (() => {
    // Priority 1: Use aggregated stage progress if available and valid
    if (contractAddress && currentStageInfo && aggregatedTotalRaised && getStageProgressPercentage) {
      return getStageProgressPercentage(aggregatedTotalRaised);
    }
    // Priority 2: Fallback to network-specific stage progress if available
    if (contractAddress && currentStageInfo && stageProgressPercentage !== undefined) {
      return stageProgressPercentage;
    }
    // Priority 3: Fallback to contract overall progress if available
    if (contractAddress && contractProgress !== undefined) {
      return contractProgress;
    }
    // Priority 4: Use aggregated progress as last resort
    if (!isLoadingAggregatedProgress && aggregatedProgress !== undefined) {
      return aggregatedProgress;
    }
    // Default to 0
    return 0;
  })();

  // Track processed transactions to prevent modal reopening
  const [processedTransactions, setProcessedTransactions] = useState<Set<string>>(new Set())

  // Track the network where transaction was initiated
  const [transactionNetwork, setTransactionNetwork] = useState<number | null>(null)
  
  // State for Max button tooltip
  const [showMaxTooltip, setShowMaxTooltip] = useState(false)
  
  // Mobile detection
  const isMobile = useIsMobile()


  // Helper function to extract user-friendly error messages
  const getErrorMessage = (error: unknown): string => {
    if (!error) return 'Transaction failed. Please try again.'
    
    // Handle wagmi/viem error structure
    const errorObj = error as Record<string, unknown>
    const errorMessage = String(errorObj?.message || errorObj?.shortMessage || errorObj?.details || error)
    const lowerMessage = errorMessage.toLowerCase()
    
    console.log('🚨 Error details for user message:', {
      error,
      message: errorMessage,
      cause: errorObj?.cause,
      details: errorObj?.details
    })
    
    // Return generic messages based on error type
    if (lowerMessage.includes('internal json-rpc error') || 
        lowerMessage.includes('rpc error') || 
        lowerMessage.includes('network error')) {
      return 'Network connection issue. Please try again.'
    }
    
    if (lowerMessage.includes('insufficient funds') || 
        lowerMessage.includes('insufficient balance')) {
      return 'Insufficient funds in your wallet.'
    }
    
    if (lowerMessage.includes('user rejected') || 
        lowerMessage.includes('rejected') ||
        lowerMessage.includes('user denied')) {
      return 'Transaction was cancelled by user.'
    }
    
    if (lowerMessage.includes('reverted') || 
        lowerMessage.includes('execution reverted')) {
      return 'Transaction failed. Please check your balance and try again.'
    }
    
    if (lowerMessage.includes('gas') && lowerMessage.includes('fee')) {
      return 'Transaction failed due to gas fees. Please try again.'
    }
    
    // Default generic message for any other error
    return 'Transaction failed. Please try again.'
  }

  // Handle transaction status changes
  useEffect(() => {

    // Handle errors without hash (RPC errors, wallet rejections, etc.)
    if (contractError && !hash && contractAddress) {
      const errorKey = `error-without-hash-${contractError.message || contractError.toString()}`
      if (!processedTransactions.has(errorKey)) {
        console.log('🚨 Error without hash detected:', contractError)
        setTransactionStatus('error')
        setTransactionErrorMessage(getErrorMessage(contractError))
        setShowTransactionModal(true)
        // Mark this error as processed to prevent repeated popups
        setProcessedTransactions(prev => new Set(prev).add(errorKey))
      }
      return
    }

    // Only process transactions if we have a hash and contract address (valid network)
    if (!hash || !contractAddress) return

    // If this is a new transaction, record which network it's on
    if ((isTransactionPending || isConfirming) && transactionNetwork !== chainId) {
      setTransactionNetwork(chainId)
    }

    // Only process transactions that belong to the current network
    const isCurrentNetworkTransaction = transactionNetwork === chainId

    // CRITICAL: If transactionNetwork is null (just switched networks), ignore all transaction states
    // until a new transaction is initiated. This prevents cross-network transaction state pollution.
    if (transactionNetwork === null) {
      return
    }

    // Only show pending modal if we have a hash and it's for current network
    if ((isTransactionPending || isConfirming) && isCurrentNetworkTransaction) {
      setTransactionStatus('pending')
      setShowTransactionModal(true)
    } 
    // Show success when confirmed (only if we haven't already processed this transaction and it's current network)
    else if (isConfirmed && isCurrentNetworkTransaction && !processedTransactions.has(hash)) {
      setTransactionStatus('success')
      // Store the purchased token amount for display
      if (tokenAmount > 0) {
        setPurchasedTokenAmount(tokenAmount.toLocaleString())
      }
      // Mark this transaction as processed
      setProcessedTransactions(prev => new Set(prev).add(hash))
      // Refetch token balance after successful transaction
      // Add a small delay to ensure blockchain state is updated
      setTimeout(() => {
        refetchTokenBalance()
      }, 2000)
      
      // Redirect to thank you page with transaction details
      const searchParams = new URLSearchParams({
        tokens: tokenAmount.toLocaleString(),
        amount: investAmount,
        currency: selectedCurrency,
        hash: hash,
        network: getNetworkName(),
        walletAddress: address || '',
        ...(referralCode && { referralCode })
      })
      router.push(`/thank-you?${searchParams.toString()}`)
    } 
    // Show error when there's an error (only if we haven't already processed this error and it's current network)
    else if (contractError && isCurrentNetworkTransaction && !processedTransactions.has(hash)) {
      setTransactionStatus('error')
      setTransactionErrorMessage(getErrorMessage(contractError))
      setShowTransactionModal(true)
      // Mark this transaction as processed
      setProcessedTransactions(prev => new Set(prev).add(hash))
    }
    // Handle case where transaction is rejected or fails without error (only if we had a hash and current network)
    else if (!isTransactionPending && !isConfirming && !isConfirmed && transactionStatus === 'pending' && isCurrentNetworkTransaction) {
      // Transaction was rejected or failed
      setTransactionStatus('error')
      setShowTransactionModal(true)
    }
  }, [isTransactionPending, isConfirming, isConfirmed, contractError, hash, tokenAmount, transactionStatus, processedTransactions, chainId, contractAddress, transactionNetwork, refetchTokenBalance])

  // Monitor TRON transaction state separately
  useEffect(() => {
    if (!isTronConnected) return

    // Handle TRON transaction states
    if (tronTransactionState.isApproving) {
      // Update transaction status to show approval step
      if (transactionStatus !== 'pending') {
        setTransactionStatus('pending')
        setShowTransactionModal(true)
      }
    } else if (tronTransactionState.isConfirming) {
      // Modal is already showing pending from handlePurchase
    } else if (tronTransactionState.isConfirmed && tronTransactionState.hash) {
      const txHash = tronTransactionState.hash
      
      // Only update if we haven't processed this transaction
      if (!processedTransactions.has(txHash)) {
        setTransactionStatus('success')
        setPurchasedTokenAmount(tokenAmount.toLocaleString())
        setProcessedTransactions(prev => new Set(prev).add(txHash))
        
        // Refresh token balance
        setTimeout(() => {
          refetchTokenBalance()
        }, 2000)
        
        // Redirect to thank you page with transaction details
        const searchParams = new URLSearchParams({
          tokens: tokenAmount.toLocaleString(),
          amount: investAmount,
          currency: selectedCurrency,
          hash: txHash,
          network: 'tron',
          walletAddress: tronAddress || '',
          ...(referralCode && { referralCode })
        })
        router.push(`/thank-you?${searchParams.toString()}`)
      }
    } else if (tronTransactionState.error) {
      console.error('❌ TRON transaction error:', tronTransactionState.error)
      setTransactionStatus('error')
      setTransactionErrorMessage(tronTransactionState.error)
    }
  }, [tronTransactionState, isTronConnected, tokenAmount, processedTransactions, refetchTokenBalance])
  
  // Check if approval is needed for stablecoins (only for EVM chains, not TRON)
  const needsApproval = () => {
    if (isNativeToken(selectedCurrency) || !investAmount) return false

    // TRON doesn't use the approval system - tokens are transferred directly
    if (isTronConnected && selectedCurrency === 'USDT') return false

    // Special handling for DOT (xcDOT) which uses 10 decimals
    let decimals: number
    if (selectedCurrency === 'DOT') {
      decimals = 10 // xcDOT uses 10 decimals
    } else {
      decimals = getStablecoinDecimals(chainId)
    }

    const requiredAmount = parseUnits(investAmount, decimals)
    return allowance < requiredAmount
  }

  // Handle approval for stablecoins
  const handleApproval = async () => {
    if (!investAmount) return
    try {
      // Special handling for DOT (xcDOT) which uses 10 decimals
      let decimals: number
      if (selectedCurrency === 'DOT') {
        decimals = 10 // xcDOT uses 10 decimals
      } else {
        decimals = getStablecoinDecimals(chainId)
      }

      const requiredAmount = parseUnits(investAmount, decimals)
      // Approve a bit more to account for future transactions
      const approveAmount = requiredAmount * BigInt(2)
      approve(approveAmount)
    } catch (err) {
      console.error('Approval failed:', err)
    }
  }

  // Purchase handler - handles Ethereum, Solana, and TRON transactions
  const handlePurchase = async () => {
    if (!investAmount || !selectedCurrency) return;

    
    // TRON purchase flow
    if (isTronConnected && (selectedCurrency === 'TRX' || selectedCurrency === 'USDT')) {
      // Check referral code validation for TRON purchases
      if (referralCode && referralCode.trim() && !isReferralFromQuery) {
        if (referralValidation.isValidating) {
          return;
        }
        
        if (referralValidation.isValid === false) {
          setTransactionStatus('error');
          setTransactionErrorMessage(referralValidation.message || 'Invalid referral code. Please correct it before purchasing.');
          setShowTransactionModal(true);
          return;
        }
        
        if (referralValidation.isValid === null) {
          return;
        }
      }

      try {
        // Show pending transaction modal immediately
        setTransactionStatus('pending');
        setShowTransactionModal(true);

        let txHash;
        if (selectedCurrency === 'TRX') {
          // Native TRX purchase
          txHash = await buyWithTRX(investAmount, referralCode);
        } else {
          // Stablecoin purchase (USDT)
          txHash = await buyTronStablecoin(selectedCurrency as 'USDT', investAmount, referralCode);
        }

      } catch (err: unknown) {
        console.error('TRON purchase failed:', err);
        setTransactionStatus('error');
        setTransactionErrorMessage(err instanceof Error ? err.message : 'TRON transaction failed. Please try again.');
        setShowTransactionModal(true);
      }
      return;
    }
    
    // Check if we have the right wallet connected for the selected currency
    if (isSolanaConnected && selectedCurrency === 'SOL') {

      // Solana purchase flow
      if (!solanaPublicKey) return;

      // Check referral code validation for Solana purchases
      if (referralCode && referralCode.trim() && !isReferralFromQuery) {
        if (referralValidation.isValidating) {
          return;
        }
        
        if (referralValidation.isValid === false) {
          setTransactionStatus('error');
          setTransactionErrorMessage(referralValidation.message || 'Invalid referral code. Please correct it before purchasing.');
          setShowTransactionModal(true);
          return;
        }
        
        if (referralValidation.isValid === null) {
          return;
        }
      }

      try {
        // Parse referrer address if referral code exists and is valid
        let referrer: PublicKey | undefined;
        if (referralCode && referralCode.trim()) {
          try {
            // If referral code is a valid Solana address, use it as referrer
            referrer = new PublicKey(referralCode);
          } catch (err) {
            console.warn('Referral code is not a valid Solana address:', err);
          }
        }

        const result = await buyWithSol({
          amount: parseFloat(investAmount),
          referrer
        });

        if (result.success) {
          console.log('✅ Solana purchase successful:', result.signature);
          setTransactionStatus('success');
          setPurchasedTokenAmount(tokenAmount.toLocaleString());
          setSolanaTransactionSignature(result.signature || '');
          // Redirect to thank you page with transaction details
          const searchParams = new URLSearchParams({
            tokens: tokenAmount.toLocaleString(),
            amount: investAmount,
            currency: selectedCurrency || 'SOL',
            hash: result.signature || '',
            network: 'solana',
            walletAddress: solanaPublicKey?.toBase58() || '',
            ...(referralCode && { referralCode })
          })
          router.push(`/thank-you?${searchParams.toString()}`);
        } else {
          console.error('❌ Solana purchase failed:', result.error);
          setTransactionStatus('error');
          setTransactionErrorMessage(result.error || 'Solana transaction failed');
          setShowTransactionModal(true);
        }
      } catch (err) {
        console.error('Solana purchase failed:', err);
        setTransactionStatus('error');
        setTransactionErrorMessage('Solana transaction failed. Please try again.');
        setShowTransactionModal(true);
      }
      return;
    }

    // Ethereum purchase flow (existing logic)
    if (!isConnected || !contractAddress) return;
    
    // Stage limit validation - for all networks that have stage data
    if (contractAddress && currentStageInfo && validatePurchaseAmount) {
      const investAmountNum = parseFloat(investAmount);
      let usdAmount = 0;
      
      // Calculate USD equivalent based on payment method and connected wallet type
      if (isNativeToken(selectedCurrency)) {
        if (selectedCurrency === 'SOL') {
          // For Solana, use real SOL price
          const currentSolPrice = solPrice && solPrice > 0 ? solPrice : 150; // Fallback to $150
          usdAmount = investAmountNum * currentSolPrice;
        } else if (selectedCurrency === 'TRX') {
          // For TRON, use ETH price from TRON contract (represents TRX/USD rate)
          const trxPrice = tronETHPrice && parseFloat(tronETHPrice) > 0 ? parseFloat(tronETHPrice) : 0.25; // Fallback to $0.25
          usdAmount = investAmountNum * trxPrice;
        } else {
          // For EVM native tokens, use ETH price from contract
          const nativePrice = ethPrice && parseFloat(ethPrice) > 0 ? parseFloat(ethPrice) : 
            (chainId === 1287 ? 0.1 : 3000); // Fallback: DEV=$0.10, others=$3000
          usdAmount = investAmountNum * nativePrice;
        }
      } else {
        // Use dynamic stablecoin pricing from Chainlink feeds
        let stablecoinAddress;
        if (selectedCurrency === 'DOT') {
          // Special handling for DOT (which maps to xcDOT)
          stablecoinAddress = STABLECOIN_ADDRESSES.xcDOT?.[chainId as keyof typeof STABLECOIN_ADDRESSES.xcDOT];
        } else {
          const currencyAddresses = STABLECOIN_ADDRESSES[selectedCurrency as keyof typeof STABLECOIN_ADDRESSES];
          stablecoinAddress = currencyAddresses?.[chainId as keyof typeof currencyAddresses];
        }
        const stablecoinPrice = stablecoinAddress && getStablecoinPrice ? getStablecoinPrice(stablecoinAddress) : 1.0;
        usdAmount = investAmountNum * stablecoinPrice;
      }

      // Validate against stage limits using aggregated total raised for accurate validation
      const validation = validatePurchaseAmount(usdAmount, aggregatedTotalRaised);
      if (!validation.isValid) {
        setTransactionStatus('error');
        setTransactionErrorMessage(
          `Purchase amount ($${usdAmount.toLocaleString()}) exceeds the remaining allocation for ${currentStageInfo.name}. ` +
          `Remaining allocation: $${validation.remainingAllocation.toLocaleString()}. ` +
          `Please reduce your purchase amount to $${Math.min(validation.remainingAllocation, 999999999).toFixed(2)} or wait for the next round.`
        );
        setShowTransactionModal(true);
        return;
      }
    }
    
    // Check referral code validation before proceeding with purchase
    if (referralCode && referralCode.trim() && !isReferralFromQuery) {
      // If referral validation is in progress, wait for it
      if (referralValidation.isValidating) {
        console.log('⏳ Waiting for referral validation to complete');
        return;
      }
      
      // If referral code is invalid, prevent purchase
      if (referralValidation.isValid === false) {
        console.log('❌ Referral code is invalid, preventing purchase');
        setTransactionStatus('error');
        setTransactionErrorMessage(referralValidation.message || 'Invalid referral code. Please correct it before purchasing.');
        setShowTransactionModal(true);
        return;
      }
      
      // If referral validation is null (hasn't been validated yet), validate it first
      if (referralValidation.isValid === null) {
        console.log('⏳ Referral code not yet validated, please wait');
        return;
      }
    }
    
    try {
      // Use the wallet address from the referral validation API response
      let referrer: Address | undefined;
      if (referralCode && referralCode.trim() && referralValidation.isValid && referralValidation.walletAddress) {
        try {
          // Validate the wallet address format from API response
          if (/^0x[a-fA-F0-9]{40}$/.test(referralValidation.walletAddress)) {
            referrer = referralValidation.walletAddress as Address;
            console.log('Using referrer wallet address from API:', referrer);
          } else {
            console.warn('Invalid wallet address format from API:', referralValidation.walletAddress);
          }
        } catch (err) {
          console.warn('Error processing referrer wallet address from API:', err);
        }
      }

      if (isNativeToken(selectedCurrency)) {
        buyWithETH(investAmount, referrer);
      } else {
        // For stablecoins, parse with correct decimals based on the chain
        let stablecoinAddress: Address | undefined;
        let decimals: number;

        if (selectedCurrency === 'DOT') {
          // Special handling for DOT (which maps to xcDOT)
          stablecoinAddress = STABLECOIN_ADDRESSES.xcDOT?.[chainId as keyof typeof STABLECOIN_ADDRESSES.xcDOT] as Address;
          decimals = 10; // xcDOT uses 10 decimals
        } else {
          const currencyAddresses = STABLECOIN_ADDRESSES[selectedCurrency as keyof typeof STABLECOIN_ADDRESSES];
          stablecoinAddress = currencyAddresses?.[chainId as keyof typeof currencyAddresses] as Address;
          decimals = getStablecoinDecimals(chainId);
        }

        if (stablecoinAddress) {
          const parsedAmount = parseUnits(investAmount, decimals);
          buyWithStablecoin(stablecoinAddress, parsedAmount, referrer);
        }
      }
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  // Check if user has sufficient balance for both native tokens and stablecoins
  const hasSufficientBalance = () => {
    if (!investAmount) return true

    // Handle TRON balance checks
    if (isTronConnected && (selectedCurrency === 'TRX' || selectedCurrency === 'USDT')) {
      const tronBalance = getBalanceForCurrency(selectedCurrency)
      return parseFloat(tronBalance || '0') >= parseFloat(investAmount)
    }

    if (isNativeToken(selectedCurrency)) {
      // Check native token balance
      return !hasInsufficientNativeBalance(parseFloat(investAmount))
    } else {
      // Check stablecoin balance (for EVM networks)
      // Special handling for DOT (xcDOT) which uses 10 decimals
      let decimals: number
      if (selectedCurrency === 'DOT') {
        decimals = 10 // xcDOT uses 10 decimals
      } else {
        decimals = getStablecoinDecimals(chainId)
      }

      const requiredAmount = parseUnits(investAmount, decimals)
      return tokenBalance >= requiredAmount
    }
  }

  // Calculate maximum purchase amount based on stage limits and wallet balance
  const getMaxPurchaseAmount = () => {
    if (!contractAddress || !currentStageInfo || !validatePurchaseAmount) return 0

    // Get remaining stage allocation in USD
    const validation = validatePurchaseAmount(0, aggregatedTotalRaised)
    const remainingAllocationUSD = validation.remainingAllocation

    if (remainingAllocationUSD <= 0) return 0

    // Convert USD limit to selected currency amount
    let maxFromStageLimit = 0
    if (isNativeToken(selectedCurrency)) {
      if (selectedCurrency === 'SOL') {
        const currentSolPrice = solPrice && solPrice > 0 ? solPrice : 150
        maxFromStageLimit = remainingAllocationUSD / currentSolPrice
      } else if (selectedCurrency === 'TRX') {
        const trxPrice = tronETHPrice && parseFloat(tronETHPrice) > 0 ? parseFloat(tronETHPrice) : 0.25
        maxFromStageLimit = remainingAllocationUSD / trxPrice
      } else {
        const nativePrice = ethPrice && parseFloat(ethPrice) > 0 ? parseFloat(ethPrice) :
          (chainId === 1287 ? 0.1 : 3000)
        maxFromStageLimit = remainingAllocationUSD / nativePrice
      }
    } else {
      // Use dynamic stablecoin pricing from Chainlink feeds
      let stablecoinAddress;
      if (selectedCurrency === 'DOT') {
        // Special handling for DOT (which maps to xcDOT)
        stablecoinAddress = STABLECOIN_ADDRESSES.xcDOT?.[chainId as keyof typeof STABLECOIN_ADDRESSES.xcDOT];
      } else {
        const currencyAddresses = STABLECOIN_ADDRESSES[selectedCurrency as keyof typeof STABLECOIN_ADDRESSES];
        stablecoinAddress = currencyAddresses?.[chainId as keyof typeof currencyAddresses];
      }
      const stablecoinPrice = stablecoinAddress && getStablecoinPrice ? getStablecoinPrice(stablecoinAddress) : 1.0;
      maxFromStageLimit = remainingAllocationUSD / stablecoinPrice
    }

    // Get user's wallet balance
    let walletBalance = 0
    if (isTronConnected && (selectedCurrency === 'TRX' || selectedCurrency === 'USDT')) {
      walletBalance = parseFloat(getBalanceForCurrency(selectedCurrency) || '0')
    } else if (isNativeToken(selectedCurrency)) {
      walletBalance = parseFloat(nativeBalance || '0')
    } else {
      // For EVM stablecoins
      const decimals = getStablecoinDecimals(chainId)
      walletBalance = tokenBalance ? parseFloat(formatUnits(tokenBalance, decimals)) : 0
    }

    // Return the smaller of stage limit or wallet balance
    return Math.min(maxFromStageLimit, walletBalance)
  }

  // Check if current purchase amount exceeds stage limits
  const exceedsStageLimit = () => {
    if (!investAmount || !contractAddress || !currentStageInfo || !validatePurchaseAmount) return false
    
    const investAmountNum = parseFloat(investAmount)
    let usdAmount = 0
    
    // Calculate USD equivalent
    if (isNativeToken(selectedCurrency)) {
      if (selectedCurrency === 'SOL') {
        const currentSolPrice = solPrice && solPrice > 0 ? solPrice : 150
        usdAmount = investAmountNum * currentSolPrice
      } else if (selectedCurrency === 'TRX') {
        const trxPrice = tronETHPrice && parseFloat(tronETHPrice) > 0 ? parseFloat(tronETHPrice) : 0.25
        usdAmount = investAmountNum * trxPrice
      } else {
        const nativePrice = ethPrice && parseFloat(ethPrice) > 0 ? parseFloat(ethPrice) : 
          (chainId === 1287 ? 0.1 : 3000)
        usdAmount = investAmountNum * nativePrice
      }
    } else {
      // Use dynamic stablecoin pricing from Chainlink feeds
      const currencyAddresses = STABLECOIN_ADDRESSES[selectedCurrency as keyof typeof STABLECOIN_ADDRESSES];
      const stablecoinAddress = currencyAddresses?.[chainId as keyof typeof currencyAddresses];
      const stablecoinPrice = stablecoinAddress && getStablecoinPrice ? getStablecoinPrice(stablecoinAddress) : 1.0;
      usdAmount = investAmountNum * stablecoinPrice
    }

    const validation = validatePurchaseAmount(usdAmount, aggregatedTotalRaised)
    
    // Use different tolerance based on currency type to handle floating-point precision
    // Stablecoins (USDT/USDC) need smaller tolerance since they're 1:1 with USD
    // Crypto currencies need larger tolerance due to price volatility and conversion
    const tolerance = isNativeToken(selectedCurrency) ? 0.01 : 0.001
    return !validation.isValid && validation.exceedsBy > tolerance
  }

  // Check if the stage limit is the restricting factor for max purchase amount
  const isStageRoundLimited = () => {
    if (!contractAddress || !currentStageInfo || !validatePurchaseAmount) return false

    // Get remaining stage allocation in USD
    const validation = validatePurchaseAmount(0, aggregatedTotalRaised)
    const remainingAllocationUSD = validation.remainingAllocation

    if (remainingAllocationUSD <= 0) return true

    // Convert USD limit to selected currency amount
    let maxFromStageLimit = 0
    if (isNativeToken(selectedCurrency)) {
      if (selectedCurrency === 'SOL') {
        const currentSolPrice = solPrice && solPrice > 0 ? solPrice : 150
        maxFromStageLimit = remainingAllocationUSD / currentSolPrice
      } else if (selectedCurrency === 'TRX') {
        const trxPrice = tronETHPrice && parseFloat(tronETHPrice) > 0 ? parseFloat(tronETHPrice) : 0.25
        maxFromStageLimit = remainingAllocationUSD / trxPrice
      } else {
        const nativePrice = ethPrice && parseFloat(ethPrice) > 0 ? parseFloat(ethPrice) : 
          (chainId === 1287 ? 0.1 : 3000)
        maxFromStageLimit = remainingAllocationUSD / nativePrice
      }
    } else {
      // Use dynamic stablecoin pricing from Chainlink feeds
      let stablecoinAddress;
      if (selectedCurrency === 'DOT') {
        // Special handling for DOT (which maps to xcDOT)
        stablecoinAddress = STABLECOIN_ADDRESSES.xcDOT?.[chainId as keyof typeof STABLECOIN_ADDRESSES.xcDOT];
      } else {
        const currencyAddresses = STABLECOIN_ADDRESSES[selectedCurrency as keyof typeof STABLECOIN_ADDRESSES];
        stablecoinAddress = currencyAddresses?.[chainId as keyof typeof currencyAddresses];
      }
      const stablecoinPrice = stablecoinAddress && getStablecoinPrice ? getStablecoinPrice(stablecoinAddress) : 1.0;
      maxFromStageLimit = remainingAllocationUSD / stablecoinPrice
    }

    // Get user's wallet balance
    let walletBalance = 0
    if (isTronConnected && (selectedCurrency === 'TRX' || selectedCurrency === 'USDT')) {
      walletBalance = parseFloat(getBalanceForCurrency(selectedCurrency) || '0')
    } else if (isNativeToken(selectedCurrency)) {
      walletBalance = parseFloat(nativeBalance || '0')
    } else {
      // For EVM stablecoins
      const decimals = getStablecoinDecimals(chainId)
      walletBalance = tokenBalance ? parseFloat(formatUnits(tokenBalance, decimals)) : 0
    }

    // Stage limit is restricting if it's smaller than wallet balance
    return maxFromStageLimit < walletBalance
  }

  // Handle Max button click
  const handleMaxClick = () => {
    const maxAmount = getMaxPurchaseAmount()
    if (maxAmount > 0) {
      // Use the full precision for truncation to prevent balance overflow
      let fullPrecisionDecimals = 6 // Default for native tokens

      if (!isNativeToken(selectedCurrency)) {
        // For stablecoins, use the network-specific decimal configuration for truncation
        fullPrecisionDecimals = getStablecoinDecimals(chainId) === 18 ? 18 : 6
      }

      // Truncate at full precision to avoid exceeding wallet balance
      const fullPrecisionMultiplier = Math.pow(10, fullPrecisionDecimals)
      const truncatedAmount = Math.floor(maxAmount * fullPrecisionMultiplier) / fullPrecisionMultiplier

      // Display with 6 decimal places maximum for better UX
      const displayDecimals = 6
      const displayMultiplier = Math.pow(10, displayDecimals)
      const displayAmount = Math.floor(truncatedAmount * displayMultiplier) / displayMultiplier

      // Format with 6 decimal places and remove trailing zeros
      setInvestAmount(displayAmount.toFixed(displayDecimals).replace(/\.?0+$/, ''))
      
      // Show tooltip if stage limit is the restricting factor
      if (isStageRoundLimited()) {
        setShowMaxTooltip(true)
        // Hide tooltip after 3 seconds
        setTimeout(() => {
          setShowMaxTooltip(false)
        }, 3000)
      }
    }
  }
  
  // Get the price value from common translations
  const price = tCommon('pricePerZedi');

  // Referral validation hook
  const referralValidation = useReferralValidation(referralCode, 500);

  // Helper function to get network name for API
  const getNetworkName = () => {
    // For TRON transactions, return 'tron'
    if (isTronConnected && (selectedCurrency === 'TRX' || selectedCurrency === 'USDT' || selectedCurrency === 'USDC')) {
      return 'tron'
    }
    
    switch (chainId) {
      case 1287: return 'moonbase-alpha'
      case 1284: return 'moonbeam'
      case 80002: return 'polygon-amoy'
      case 56: return 'bsc'
      case 97: return 'bsc-testnet'
      case 1: return 'ethereum'
      case 137: return 'polygon'
      case 8453: return 'base'
      default: return 'ethereum'
    }
  }

  // Check if the current network is supported
  const deployedNetworks = useMemo(() => getDeployedNetworks(), [])
  const isCurrentNetworkSupported = useMemo(() => {
    if (!chainId) return true // Don't show modal when chainId is not yet available
    return deployedNetworks.some(network => network.chainId === chainId)
  }, [chainId, deployedNetworks])

  // Effect to show unsupported network modal
  useEffect(() => {
    // Only show modal if wallet is connected, chainId is available, network is unsupported, and component is mounted
    if (isConnected && chainId && !isCurrentNetworkSupported && mounted && !isSolanaConnected) {
      console.log(`🚨 Unsupported network detected: chainId ${chainId}`)
      setShowUnsupportedNetworkModal(true)
    } else {
      setShowUnsupportedNetworkModal(false)
    }
  }, [isConnected, chainId, isCurrentNetworkSupported, mounted, isSolanaConnected])

  const getRoundInfo = (
      total: number,
      daysPerRound: number,
      start: string,
      now: Date = new Date()
  ): {
    currentRound: number;
    remainingDays: number;
    remainingHours: number;
    remainingMinutes: number;
    remainingSeconds: number;
  } => {
    // parse start as UTC
    let startIso = start.replace(' ', 'T');
    if (!startIso.endsWith('Z')) startIso += 'Z';
    const startDate = new Date(startIso);

    // use current time in UTC
    const today = new Date(now.toISOString()); // ensures UTC reference

    // --- current round ---
    const diffMsSinceStart = +today - +startDate;
    const diffDays = Math.floor(diffMsSinceStart / 86400000);
    let currentRound = Math.floor(diffDays / daysPerRound) + 1;
    currentRound = Math.min(total, Math.max(1, currentRound));

    // --- round start & end ---
    const roundStart = new Date(startDate);
    roundStart.setUTCDate(roundStart.getUTCDate() + (currentRound - 1) * daysPerRound);

    const roundEnd = new Date(roundStart);
    roundEnd.setUTCDate(roundEnd.getUTCDate() + daysPerRound);

    // --- remaining time ---
    let diffMs = +roundEnd - +today;
    if (diffMs < 0) diffMs = 0;

    const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs -= remainingDays * 1000 * 60 * 60 * 24;

    const remainingHours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= remainingHours * 1000 * 60 * 60;

    const remainingMinutes = Math.floor(diffMs / (1000 * 60));
    diffMs -= remainingMinutes * 1000 * 60;

    const remainingSeconds = Math.floor(diffMs / 1000);

    return { currentRound, remainingDays, remainingHours, remainingMinutes, remainingSeconds };
  };

  const totalRounds = Number(tHero('totalNoOfRounds'));
  const daysPerRound = Number(tHero('daysPerRound'));
  const startDate = tHero('roundStartDate');

  const {
    currentRound,
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
  } = getRoundInfo(totalRounds, daysPerRound, startDate);


  // Calculate available tokens based on stage limits
  const getAvailableTokens = (): number => {
    if (!contractAddress || !currentStageInfo || !validatePurchaseAmount) return 0;

    // Get remaining stage allocation in USD
    const validation = validatePurchaseAmount(0, aggregatedTotalRaised);
    const remainingAllocationUSD = validation.remainingAllocation;

    if (remainingAllocationUSD <= 0) return 0;

    // Convert USD to tokens using current stage price
    const tokensAvailable = remainingAllocationUSD / currentStageInfo.priceUSD;
    return Math.floor(tokensAvailable);
  };

  const availableTokens: number = getAvailableTokens();

  function getNextStageChangePercent(currentStage: number): number | null {
    const idx = STAGE_CONFIG.findIndex(s => s.stage === currentStage);
    if (idx === -1 || idx >= STAGE_CONFIG.length - 1) {
      return null;
    }

    const current = STAGE_CONFIG[idx].priceUSD;
    const next = STAGE_CONFIG[idx + 1].priceUSD;

    const percentChange = ((next - current) / current)*100;
    return Math.round(percentChange);
  }

  const increasedNextStage: number|null = currentStageInfo?.stage ? getNextStageChangePercent(currentStageInfo.stage) : null;

  return (
      <>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-purple-900/30 via-gray-900 to-violet-900/30'
            : 'bg-gradient-to-br from-purple-100/50 via-white to-violet-100/50'
        }`}></div>
        <div
          className="absolute inset-0 opacity-30 transition-all duration-300"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, ${
              isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)'
            }, transparent 80%)`
          }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Particles */}
      {mounted && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                ></div>
            ))}
          </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className={`absolute top-20 right-[-100px] lg:right-[-150px] xl:right-[-540px] z-0 hidden lg:block`} {...applyAOS('fade-down', isMobile, 200)}>
          {tCommon('elementToggle') === 'true' && (
              isDark ? (
                  <Image
                      src="/images/00.png"
                      alt="Chain Representative"
                      width={760}
                      height={1100}
                      className={applyAnimation('opacity-35 hover:opacity-50 transition-all duration-700 object-cover object-top transform scale-150', isMobile, 'opacity-35 object-cover object-top transform scale-150')}
                      priority
                  />
              ) : (
                  <Image
                      src="/images/01.png"
                      alt="Chain Representative"
                      width={760}
                      height={1100}
                      className={applyAnimation('opacity-65 hover:opacity-80 transition-all duration-700 object-cover object-top transform scale-150', isMobile, 'opacity-65 object-cover object-top transform scale-150')}
                      priority
                  />
              )
          )}
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left" {...applyAOS('fade-right', isMobile, 200)}>
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 border rounded-full text-sm font-medium mb-4 ${
                isDark
                  ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                  : 'bg-purple-50 border-purple-200 text-purple-700'
              }`} {...applyAOS('zoom-in', isMobile, 100)}>
                <Image
                    src="/images/Rocket.png"
                    alt="Rocket"
                    width={16}
                    height={16}
                    className="mr-2"
                />
                {tHero('icoStageBanner', { price: `$${getCurrentTokenPrice().toFixed(3)}` })}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" {...applyAOS('fade-up', isMobile, 300)}>
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDark
                  ? 'from-white via-purple-100 to-violet-200'
                  : 'from-gray-900 via-purple-900 to-violet-900'
              }`}>
               {tHero('title.part1')}
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#c084fc] via-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
                {tHero('title.part2')}
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`} {...applyAOS('fade-up', isMobile, 400)}>
              {tHero('subtitle.part1')} <span className="text-purple-400 font-semibold">{tHero('subtitle.part2')}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12" {...applyAOS('fade-up', isMobile, 500)}>
              <button 
                onClick={() => {
                  if (isMobile) {
                    // Scroll to ICO widget section on mobile
                    const icoWidget = document.getElementById('ico-widget');
                    if (icoWidget) {
                      icoWidget.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }
                }}
                className={`group bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-8 py-4 cursor-pointer rounded-lg font-semibold text-lg transition-all duration-300 transform ${applyAnimation('hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25', isMobile, '')} flex items-center space-x-2`} {...applyAOS('zoom-in', isMobile, 600)}>
                <span className="text-white">{tHero('cta.secureStake')}</span>
                <ArrowRight className={`w-5 h-5 text-white transition-transform ${applyAnimation('group-hover:translate-x-1', isMobile, '')}`} />
              </button>
              {/*<button className={`group border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-purple-500/10 hover:scale-105 flex items-center space-x-2 ${*/}
              {/*  isDark*/}
              {/*    ? 'border-gray-600 hover:border-purple-500'*/}
              {/*    : 'border-gray-300 hover:border-purple-500'*/}
              {/*}`} data-aos="zoom-in" data-aos-delay="700">*/}
              {/*  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />*/}
              {/*  <span>{tHero('cta.watchVision')}</span>*/}
              {/*</button>*/}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" {...applyAOS('fade-up', isMobile, 800)}>
              <div className={`text-center lg:text-left group transition-transform duration-300 ${applyAnimation('hover:scale-105', isMobile, '')}`} {...applyAOS('flip-up', isMobile, 900)}>
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">{tHero('stats.raised.value')}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tHero('stats.raised.label')}</div>
              </div>
              <div className={`text-center lg:text-left group transition-transform duration-300 ${applyAnimation('hover:scale-105', isMobile, '')}`} {...applyAOS('flip-up', isMobile, 1000)}>
                <div className="text-2xl md:text-3xl font-bold text-violet-400 mb-2">{tHero('stats.partners.value')}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tHero('stats.partners.label')}</div>
              </div>
              <div className={`text-center lg:text-left group transition-transform duration-300 ${applyAnimation('hover:scale-105', isMobile, '')}`} {...applyAOS('flip-up', isMobile, 1100)}>
                <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2">{tHero('stats.useCases.value')}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tHero('stats.useCases.label')}</div>
              </div>
              <div className={`text-center lg:text-left group transition-transform duration-300 ${applyAnimation('hover:scale-105', isMobile, '')}`} {...applyAOS('flip-up', isMobile, 1200)}>
                <div className="text-2xl md:text-3xl font-bold text-orange-400 mb-2">
                  {contractTimeLeft?.days || 0} days
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tHero('stats.remaining.label')}</div>
              </div>
            </div>
          </div>

          {/* Right Column - ICO Widget */}
          <div id="ico-widget" className="w-full max-w-md mx-auto lg:mx-0" {...applyAOS('fade-left', isMobile, 300)}>
            <div className={`backdrop-blur-2xl border rounded-2xl p-6 shadow-2xl transition-transform duration-300 glass-panel bg-black/60 border-white/10 ${applyAnimation('hover:scale-105', isMobile, '')}`}>
              {/* Stage Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  {/*<span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>*/}
                  {/*  {tIco('currentStage')}*/}
                  {/*</span>*/}
                  <span className="flex items-center gap-1 text-sm mb-4 bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {tIco('stage')} {contractAddress && contractCurrentRound ? contractCurrentRound : currentRound} Live
                  </span>
                  <span className="text-xs text-green-500 pb-4">
                     +{increasedNextStage}% {tHero('nextRoundIncreases')}
                  </span>
                  {/*<span className={`px-3 py-1 rounded-full text-xs font-medium ${*/}
                  {/*  isDark*/}
                  {/*    ? 'bg-purple-500/20 text-purple-300'*/}
                  {/*    : 'bg-purple-50 text-purple-700'*/}
                  {/*}`}>*/}
                  {/*  {tIco('stage')} {contractAddress && contractCurrentRound ? contractCurrentRound : currentRound}*/}
                  {/*</span>*/}
                </div>
                <div className={`flex justify-between items-center text-2xl font-bold mb-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <p>
                    {currentPrice ? `$${currentPrice.toFixed(3)}` : '0'}
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp; {tIco('perZedi')}
                  </span>
                  </p>

                  <p className="text-sm text-slate-200"> {availableTokens}
                    <span className="text-slate-400">
                      &nbsp; {tHero('zediAvailable')}
                    </span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="relative mt-3">
                  <div className="w-full rounded-full h-2 bg-white/10">
                    <div
                      className="bg-gradient-to-r from-[#6d28d9] to-[#c084fc] h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(actualProgressPercentage)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs mt-1 text-slate-300/80">
                    <span>{(actualProgressPercentage).toFixed(1)}% {tIco('sold')}</span>
                    <span>{(100 - (actualProgressPercentage) ).toFixed(1)}% {tIco('remaining')}</span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6">
                <div className="flex items-center mb-2 gap-1">
                  <Image src="/images/clock-icon.png" alt="clock-icon" width={20} height={20} />
                  <span className="text-sm text-slate-300/80">
                    {tIco('stage')} {contractAddress && contractCurrentRound ? contractCurrentRound : currentRound} {tIco('nextStageIn')}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: tCountdown('days'), value: contractTimeLeft?.days || 0 },
                    { label: tCountdown('hours'), value: contractTimeLeft?.hours || 0 },
                    { label: tCountdown('minutes'), value: contractTimeLeft?.minutes || 0 },
                    { label: tCountdown('seconds'), value: contractTimeLeft?.seconds || 0 }
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="rounded-lg py-2 px-1 bg-white/5 border border-white/10">
                        <div className="text-lg font-bold text-slate-50">
                          {item.value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-slate-300/80">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Token Calculator */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  {isDark ?
                  <Image
                      src="/images/Calculator.png"
                      alt="Calculator"
                      width={18}
                      height={18}
                      className="mr-2"
                  />
                    :
                    <Image
                        src="/images/Calculator-light.png"
                        alt="Calculator-light"
                        width={28}
                        height={28}
                        className="mr-2"
                        style={{
                          scale: 1.5
                        }}
                    />
                }
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tIco('tokenCalculator')}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1 text-slate-300/80">
                      {tIco('investmentAmount')}
                    </label>
                    <div className="relative">
                      <div className="flex">
                        <input
                          type="number"
                          value={investAmount}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow empty string for user to clear input
                            if (value === '') {
                              setInvestAmount('');
                              return;
                            }
                            // Convert to number and check if it's non-negative
                            const numValue = parseFloat(value);
                            if (!isNaN(numValue) && numValue >= 0) {
                              setInvestAmount(value);
                            }
                          }}
                          onKeyDown={(e) => {
                            // Prevent typing minus, plus, and 'e' characters
                            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                          min="0"
                          className="flex-1 border pr-12 px-3 py-2 focus:outline-none focus:border-purple-400 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white/5 border-white/15 text-white placeholder:text-slate-400"
                          placeholder="1000"
                          style={{ borderRadius: '0.5rem 0 0 0.5rem' }}
                        />
                        <select
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                          className="border px-3 py-2 focus:outline-none focus:border-purple-400 transition-all duration-300 bg-white/5 border-white/15 text-white"
                          style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
                        >
                          {availablePaymentMethods.length > 0 ? (
                            availablePaymentMethods.map((method) => (
                              <option key={method.symbol} value={method.symbol}>
                                {method.symbol}
                              </option>
                            ))
                          ) : (
                            <option value="">No payment methods</option>
                          )}
                        </select>
                      </div>
                      
                      {/* Max button positioned on top of input field */}
                      <button
                        onClick={handleMaxClick}
                        disabled={!isAnyWalletConnected}
                        className="absolute top-1/2 transform -translate-y-1/2 right-24 px-2 py-1 text-xs font-medium transition-all duration-300 bg-transparent border-none text-purple-300 hover:text-purple-200 disabled:text-gray-500 disabled:cursor-not-allowed hover:scale-105 active:scale-95 z-10"
                        title="Fill maximum available amount"
                      >
                        MAX
                      </button>
                      
                      {/* Tooltip */}
                      {showMaxTooltip && isAnyWalletConnected && isStageRoundLimited() && (
                        <div className="absolute bottom-full mb-2 right-24 transform px-2 py-1 text-xs rounded whitespace-nowrap z-50 bg-black/80 border border-white/20 text-slate-100 shadow-lg">
                          Max available for this round
                          <div className={`absolute top-full right-6 w-0 h-0 ${
                            isDark
                              ? 'border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'
                              : 'border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'
                          }`}></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 transition-transform duration-300 glass-panel border border-white/10 ${applyAnimation('hover:scale-105', isMobile, '')}`}>
                    <div className="text-xs mb-1 text-slate-300/80">
                      {tIco('youllReceive')}
                    </div>
                    <div className="text-lg font-bold text-purple-400 flex items-center gap-2">
                      {currentPrice && (
                        !isNativeToken(selectedCurrency) || // For stablecoins (USDT/USDC), always show result
                        !ethPriceLoading // For native tokens, wait for ETH price
                      ) ? 
                        `${tokenAmount.toLocaleString()} ZEDI` : 
                        <div className="flex items-center gap-2">
                          <div className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-purple-600 h-4 w-4" />
                          <span>Calculating...</span>
                        </div>
                      }
                    </div>
                    
                    {/* Show bonus tokens when referral code is present and valid */}
                    {referralCode && referralCode.trim() && referralValidation.isValid === true && tokenAmount > 0 && refereeRewardPercent > 0 && (
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                        <span>+</span>
                        <span>{(tokenAmount * (refereeRewardPercent / 10000)).toLocaleString()} ZEDI</span>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                          ({(refereeRewardPercent / 100).toFixed(1)}% {tIco('bonusTokens')})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* Connect Wallet Button - Only show when not connected */}
              {!isAnyWalletConnected ? (
                <button
                    onClick={handleConnectWallet}
                    disabled={isPending}
                    className={`flex items-center justify-center w-full bg-gradient-to-r from-[#b45309] via-[#92400e] to-[#7c2d12] px-4 py-4 rounded-lg font-semibold transition-all duration-300 transform shadow-lg shadow-orange-900/40 ${applyAnimation('hover:scale-105 hover:shadow-lg', isMobile, '')}`}>
                  <Image
                      src="/images/wallet-icon.png"
                      alt="Wallet"
                      width={30}
                      height={30}
                      className="object-contain"
                  />
                  <span className="text-white text-base">
                    {!mounted
                        ? 'Connect Wallet'
                        : isPending
                            ? 'Connecting...'
                            : 'Connect Wallet'}
                  </span>
                </button>
              ) : (
                // Connected wallet display - only show on mobile
                <div className={`md:hidden flex items-center justify-between p-4 rounded-lg transition-transform duration-300 ${applyAnimation('hover:scale-105', isMobile, '')} ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-gradient-to-r from-[#6d28d9] to-[#c084fc]' : 'bg-gradient-to-r from-[#6d28d9] to-[#c084fc]'
                    }`}>
                      <Image
                          src="/images/wallet-icon.png"
                          alt="Wallet"
                          width={20}
                          height={20}
                          className="object-contain brightness-0 invert"
                      />
                    </div>
                    <div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tWallet('connected')}
                      </div>
                      <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {connectedAddress?.slice(0, 6)}...{connectedAddress?.slice(-4)}
                      </div>
                    </div>
                  </div>
                  <button
                      onClick={handleConnectWallet}
                      className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${applyAnimation('hover:scale-105', isMobile, '')} ${
                        isDark 
                          ? `${filterHoverAnimations('hover:bg-gray-600', isMobile)} text-gray-400 ${filterHoverAnimations('hover:text-white', isMobile)}` 
                          : `${filterHoverAnimations('hover:bg-gray-200', isMobile)} text-gray-600 ${filterHoverAnimations('hover:text-gray-900', isMobile)}`
                      }`}
                  >
                    {tWallet('disconnect.disconnect')}
                  </button>
                </div>
              )}
              
              {/* Network Selector - Show when wallet is connected */}
              {isConnected && (
                <div className="mt-4 relative z-30">
                  <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tHero('selectNetwork')}
                  </div>
                  <NetworkSelector />
                </div>
              )}
              
               {/* Your Tokens Component - Aggregated across all networks */}
              <div className={"flex items-center justify-between border-t border-[#8a9199] mt-2 pt-4"} >
                <div className="flex items-center">
                  <Image
                      src="/images/User.png"
                      alt="User"
                      width={30}
                      height={30}
                      className="object-contain"
                  />
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                      {tIco('yourToken')}
                    </div>
                    {/* Show breakdown tooltip if user has tokens on multiple networks */}
                    {(isConnected && tokensByNetwork.length > 1) || (isSolanaConnected && tokensByNetwork.length >= 1) && (
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Across {(isSolanaConnected ? 1 : 0) + tokensByNetwork.length} networks
                      </div>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-sm text-xs font-medium text-white transition-transform duration-300 ${applyAnimation('hover:scale-105', isMobile, '')} ${isDark ? 'bg-gradient-to-r from-[#6d28d9] to-[#c084fc]' : 'bg-[#c084fc]'}`}>
                  {!isAnyWalletConnected 
                    ? '--' 
                    : isLoadingAggregatedTokens 
                      ? 'Loading...' 
                      : `${finalTotalTokens.toLocaleString()} ZEDI`
                  }
                </div>
              </div>

              {/* Purchase Buttons - Show if wallet is connected (Ethereum with contract, Solana, or TRON) */}
              {((isConnected && contractAddress) || (isSolanaConnected && selectedCurrency === 'SOL') || (isTronConnected && (selectedCurrency === 'TRX' || selectedCurrency === 'USDT'))) && (
                <div className="mt-4 space-y-2">
                  {/* Show balance warning for native tokens */}
                  {isNativeToken(selectedCurrency) && !hasSufficientBalance() && (
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-600 rounded text-orange-600 dark:text-orange-400 text-xs" {...applyAOS('slide-down', isMobile)}>
                      Insufficient {selectedCurrency} balance. You have {isTronConnected && selectedCurrency === 'TRX' ? trxBalance : nativeBalance} {selectedCurrency}.
                    </div>
                  )}

                  {/* Show balance warning for stablecoins */}
                  {!isNativeToken(selectedCurrency) && !hasSufficientBalance() && (
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-600 rounded text-orange-600 dark:text-orange-400 text-xs" {...applyAOS('slide-down', isMobile)}>
                      Insufficient {selectedCurrency} balance. You have {
                        isTronConnected && selectedCurrency === 'USDT'
                          ? getBalanceForCurrency(selectedCurrency)
                          : (tokenBalance ? formatUnits(tokenBalance, selectedCurrency === 'DOT' ? 10 : getStablecoinDecimals(chainId)) : '0')
                      } {selectedCurrency}.
                    </div>
                  )}

                  {/* Approval button for stablecoins */}
                  {!isNativeToken(selectedCurrency) && needsApproval() && (
                    <button
                      onClick={handleApproval}
                      disabled={!investAmount || isApproving || isApprovalConfirming || !hasSufficientBalance()}
                      className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform ${applyAnimation('hover:scale-105', isMobile, '')} ${
                        !investAmount || isApproving || isApprovalConfirming || !hasSufficientBalance()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r from-orange-600 to-yellow-600 ${filterHoverAnimations('hover:from-orange-700 hover:to-yellow-700', isMobile)}`
                      }`}
                    >
                      {isApproving || isApprovalConfirming
                        ? 'Approving...'
                        : `Approve ${selectedCurrency} Spending`
                      }
                    </button>
                  )}

                  {/* Purchase button */}
                  {!needsApproval() && (
                      <button
                        onClick={handlePurchase}
                        disabled={
                          !investAmount ||
                          !currentPresaleActive ||
                          isTransactionPending ||
                          isConfirming ||
                          isAggregatedPurchaseDisabled ||
                          (!isNativeToken(selectedCurrency) && needsApproval()) ||
                          !hasSufficientBalance() ||
                          exceedsStageLimit() ||
                          (isConnected && contractAddress && typeof isStageComplete === 'function' && isStageComplete()) ||
                          (isConnected && contractAddress && remainingStageAllocation !== undefined && remainingStageAllocation <= 0)
                        }
                        className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform ${applyAnimation('hover:scale-105', isMobile, '')} ${
                          !investAmount ||
                          !currentPresaleActive ||
                          isTransactionPending ||
                          isConfirming ||
                          isAggregatedPurchaseDisabled ||
                          (!isNativeToken(selectedCurrency) && needsApproval()) ||
                          !hasSufficientBalance() ||
                          exceedsStageLimit() ||
                          (isConnected && contractAddress && typeof isStageComplete === 'function' && isStageComplete()) ||
                          (isConnected && contractAddress && remainingStageAllocation !== undefined && remainingStageAllocation <= 0)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : `bg-gradient-to-r from-green-600 to-emerald-600 ${filterHoverAnimations('hover:from-green-700 hover:to-emerald-700', isMobile)}`
                        }`}
                      >
                        {isTransactionPending || isConfirming
                          ? 'Processing...'
                          : (isConnected && contractAddress && typeof isStageComplete === 'function' && isStageComplete()) || (isConnected && contractAddress && remainingStageAllocation !== undefined && remainingStageAllocation <= 0)
                            ? 'Stage Complete - No More Tokens Available'
                            : isAggregatedPurchaseDisabled
                              ? 'Target Reached - Sales Complete'
                              : !currentPresaleActive
                                ? 'Presale Not Active'
                                : `Buy Tokens with ${selectedCurrency}`
                        }
                      </button>
                  )}
                </div>
              )}

              {/* Referral Code */}
              <div className="mt-4">
                <label className={`block text-xs mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => !isReferralFromQuery && setReferralCode(e.target.value)}
                    readOnly={isReferralFromQuery}
                    className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm transition-all duration-300 ${
                      isReferralFromQuery
                        ? `cursor-not-allowed ${
                            isDark
                              ? 'bg-gray-800 border-gray-500 text-gray-300'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`
                        : `focus:outline-none ${
                            referralValidation.isValid === true
                              ? 'border-green-500 focus:border-green-500'
                              : referralValidation.isValid === false
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:border-purple-500'
                          } ${
                            isDark
                              ? 'bg-gray-700 text-white'
                              : 'bg-white text-gray-900'
                          }`
                    }`}
                    placeholder={isReferralFromQuery ? "Referral code from URL" : "Enter referral code"}
                  />
                  
                  {/* Validation icon */}
                  {!isReferralFromQuery && referralCode && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {referralValidation.isValidating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-purple-600"></div>
                      ) : referralValidation.isValid === true ? (
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : referralValidation.isValid === false ? (
                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : null}
                    </div>
                  )}
                </div>
                
                {/* Validation message */}
                {!isReferralFromQuery && referralCode && referralValidation.message && (
                  <div className={`mt-1 text-xs ${
                    referralValidation.isValid === true
                      ? 'text-green-600 dark:text-green-400'
                      : referralValidation.isValid === false
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {referralValidation.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
    />
    {/* Only show TransactionModal for pending and error states - success redirects to thank you page */}
    {transactionStatus !== 'success' && (
      <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => {
            setShowTransactionModal(false)
            setTransactionStatus(null)
            // Reset purchase token amount when closing
            setPurchasedTokenAmount('')
            setTransactionErrorMessage('')
            // Clear Solana transaction signature
            setSolanaTransactionSignature('')
            // Clear processed transactions when modal is closed to allow new error popups
            setProcessedTransactions(new Set())
            // Reset transaction state to allow fresh transaction attempts
            resetTransaction()
          }}
          status={transactionStatus}
          hash={selectedCurrency === 'SOL' ? solanaTransactionSignature : 
                (isTronConnected && (selectedCurrency === 'TRX' || selectedCurrency === 'USDT')) ? 
                  tronTransactionState.hash || undefined : hash}
          tokenAmount={purchasedTokenAmount}
          paymentAmount={investAmount}
          paymentCurrency={selectedCurrency}
          errorMessage={transactionErrorMessage}
          walletAddress={address}
          referralCode={referralCode}
          networkName={getNetworkName()}
      />
    )}
    <UnsupportedNetworkModal 
        isOpen={showUnsupportedNetworkModal}
        onClose={() => setShowUnsupportedNetworkModal(false)}
    />
    <TronLinkGuideModal 
        isOpen={showTronGuideModal}
        onClose={() => setShowTronGuideModal(false)}
    />
    <DisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onConfirm={handleDisconnect}
        walletAddress={connectedAddress}
    />
    </>
  );
};

// Wrapper component with Suspense
const Hero = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    }>
      <HeroContent />
    </Suspense>
  );
};

export default Hero;
