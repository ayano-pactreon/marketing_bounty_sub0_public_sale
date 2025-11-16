'use client'

import { useConnect } from 'wagmi'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import type {WalletName} from "@solana/wallet-adapter-base";
import { useTron } from '@/contexts/TronContext'
import { isTronLinkInstalled } from '@/config/tron'
import { isWalletEnabled } from '@/utils/walletConfig'
import { useTranslations } from 'next-intl'

interface WalletModalProps {
    isOpen: boolean
    onClose: () => void
}

interface WalletOption {
    id: string
    name: string
    icon: string
    description: string
    available: boolean
    connector?: unknown
    type: 'extension' | 'mobile' | 'both'
    iconType: 'image' | 'emoji'
    installUrl?: string
    blockchain: 'ethereum' | 'solana' | 'tron'
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { connectors, connect, isPending } = useConnect()
    const [isMobile, setIsMobile] = useState(false)
    const [isTronConnecting, setIsTronConnecting] = useState(false)
    const tWallet = useTranslations('wallet.modal')
    const tTronlinkErrors = useTranslations('tronlink.errors')
    
    // Solana wallet functionality
    const { select: selectSolanaWallet, wallets: solanaWallets } = useWallet()
    
    // TRON wallet functionality
    const { connect: connectTron } = useTron()

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        }
        checkMobile()
    }, [])

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;

        // width of the scrollbar we’re about to hide
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


    // On mobile, only auto-trigger WalletConnect if no mobile-specific wallets are available
    useEffect(() => {
        if (isOpen && isMobile) {
            // Check if mobile-specific wallets are available inline
            const hasMobileSolanaWallets = isWalletEnabled.solana()
            const hasMobileTronWallets = isWalletEnabled.tron()
            
            // Only auto-trigger WalletConnect if no mobile-specific wallets
            if (!hasMobileSolanaWallets && !hasMobileTronWallets) {
                const walletConnectConnector = connectors.find(c => c.name === 'WalletConnect')
                if (walletConnectConnector) {
                    handleWalletSelect(walletConnectConnector)
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, isMobile, connectors])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleWalletSelect = async (connector: any) => {
        try {
            // Close our modal immediately for WalletConnect to prevent z-index conflicts
            if (connector.name === 'WalletConnect') {
                onClose()
            }
            
            await connect({ connector })
            
            // Close modal after successful connection for other wallets
            if (connector.name !== 'WalletConnect') {
                onClose()
            }
        } catch (err) {
            console.warn('Connection failed:', err)
            // Reopen our modal if WalletConnect fails
            if (connector.name === 'WalletConnect') {
                // Modal will remain closed, user can reopen if needed
            }
        }
    }

    const handleWalletClick = async (wallet: WalletOption) => {
        if (wallet.blockchain === 'tron') {
            // Handle TRON wallet connection
            if (wallet.available) {
                try {
                    setIsTronConnecting(true)
                    await connectTron()
                    onClose()
                } catch (err) {
                    console.error('TRON wallet connection failed:', err)
                    
                    const errorMessage = err instanceof Error ? err.message : 'Failed to connect to TronLink'
                    
                    // Show user-friendly error message
                    if (errorMessage.includes('not installed')) {
                        // Error already opens install page, just show message
                        alert(tTronlinkErrors('notInstalled'))
                    } else if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
                        alert(tTronlinkErrors('connectionRejected'))
                    } else if (errorMessage.includes('timeout')) {
                        alert(tTronlinkErrors('timeout'))
                    } else if (errorMessage.includes('initialize') || errorMessage.includes('not responding')) {
                        alert(tTronlinkErrors('initializationFailed'))
                    } else {
                        alert(tTronlinkErrors('connectionFailed', { errorMessage }))
                    }
                } finally {
                    setIsTronConnecting(false)
                }
            } else if (wallet.installUrl) {
                window.open(wallet.installUrl, '_blank')
                alert(tTronlinkErrors('installRequired'))
            }
            return
        }
        
        if (wallet.blockchain === 'solana') {
            // Handle Solana wallet connection
            if (wallet.available) {
                try {

                    // Find the wallet adapter - try exact name match first, then case-insensitive
                    let solanaWallet = solanaWallets.find(w => w.adapter.name === wallet.id)
                    if (!solanaWallet) {
                        solanaWallet = solanaWallets.find(w => w.adapter.name.toLowerCase().includes(wallet.id.toLowerCase()))
                    }
                    
                    if (solanaWallet) {
                        selectSolanaWallet(solanaWallet.adapter.name)
                        onClose()
                    } else {
                        console.warn('Solana wallet adapter not found for:', wallet.id)
                        // Try to trigger connection anyway
                        selectSolanaWallet(wallet.id as WalletName<'solflare'>);
                        onClose()
                    }
                } catch (err) {
                    console.error('Solana wallet connection failed:', err)
                }
            } else if (wallet.installUrl) {
                window.open(wallet.installUrl, '_blank')
            }
            return
        }

        // Handle Ethereum wallet connection (existing logic)
        if (wallet.available && wallet.connector) {
            // For wallets using the Injected connector, we need to ensure the right wallet is active
            if (wallet.id === 'talisman' && typeof window !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const win = window as any
                // Try to ensure Talisman is the active wallet
                if (win.talismanEth && win.ethereum !== win.talismanEth) {
                    win.ethereum = win.talismanEth
                }
            } else if (wallet.id === 'trust' && typeof window !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const win = window as any
                // Try to ensure Trust Wallet is the active wallet
                if (win.trustwallet && win.ethereum !== win.trustwallet) {
                    win.ethereum = win.trustwallet
                }
            }
            
            // If wallet is detected, connect to it
            await handleWalletSelect(wallet.connector)
        } else if (!wallet.available && wallet.installUrl) {
            // If wallet is not detected, open install URL
            window.open(wallet.installUrl, '_blank')
        }
    }

    const getWalletOptions = () => {
        const wallets: WalletOption[] = [
            {
                id: 'walletconnect',
                name: 'WalletConnect',
                icon: '/wallet-icons/wallet-connect.webp',
                description: tWallet('scanWithMobile'),
                available: !!connectors.find(c => c.name === 'WalletConnect'),
                connector: connectors.find(c => c.name === 'WalletConnect'),
                type: 'mobile',
                iconType: 'image',
                blockchain: 'ethereum'
            },
            {
                id: 'metamask',
                name: 'MetaMask',
                icon: '/wallet-icons/metamask.svg',
                description: tWallet('connectUsingBrowser'),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                available: typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
                connector: connectors.find(c => c.name === 'MetaMask'),
                type: 'extension',
                iconType: 'image',
                installUrl: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
                blockchain: 'ethereum'
            },
            {
                id: 'talisman',
                name: 'Talisman',
                icon: '/wallet-icons/talisman.svg',
                description: tWallet('multiChainWallet'),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                available: typeof window !== 'undefined' && !!(window as any).talismanEth,
                connector: connectors.find(c => c.name === 'Talisman') || connectors.find(c => c.name === 'Injected'),
                type: 'extension',
                iconType: 'image',
                installUrl: 'https://chromewebstore.google.com/detail/talisman-ethereum-and-pol/fijngjgcjhjmmpcmkeiomlglpeiijkld',
                blockchain: 'ethereum'
            },
            // Add Solflare as a Solana wallet option (only if enabled)
            ...(isWalletEnabled.solana() ? [{
                id: 'solflare',
                name: 'Solflare',
                icon: '/wallet-icons/solflare.svg',
                description: tWallet('solanaWallet'),
                available: !!solanaWallets.find(w => 
                    w.adapter.name.toLowerCase().includes('solflare') || 
                    w.adapter.name === 'Solflare'
                ),
                type: 'extension' as const,
                iconType: 'image' as const,
                installUrl: 'https://solflare.com/',
                blockchain: 'solana' as const
            }] : []),
            // Add TronLink wallet option (only if enabled)
            ...(isWalletEnabled.tron() ? [{
                id: 'tronlink',
                name: 'TronLink',
                icon: '/wallet-icons/tronlink.png',
                description: tWallet('tronWallet'),
                available: isTronLinkInstalled(),
                type: 'extension' as const,
                iconType: 'image' as const,
                installUrl: 'https://www.tronlink.org/',
                blockchain: 'tron' as const
            }] : []),
            {
                id: 'coinbase',
                name: 'Coinbase Wallet',
                icon: '/wallet-icons/coinbase.png',
                description: tWallet('coinbaseApp'),
                available: typeof window !== 'undefined' && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    !!((window as any).ethereum?.isCoinbaseWallet) || 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    !!((window as any).coinbaseWalletExtension)
                ),
                connector: connectors.find(c => c.name === 'Coinbase Wallet'),
                type: 'extension',
                iconType: 'image',
                installUrl: 'https://chromewebstore.google.com/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
                blockchain: 'ethereum'
            },
            {
                id: 'trust',
                name: 'Trust Wallet',
                icon: '/wallet-icons/trust-wallet.svg',
                description: tWallet('mobileCryptoWallet'),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                available: typeof window !== 'undefined' && !!(window as any).trustwallet,
                connector: connectors.find(c => c.name === 'Trust Wallet') || connectors.find(c => c.name === 'Injected'),
                type: 'extension',
                iconType: 'image',
                installUrl: 'https://chromewebstore.google.com/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
                blockchain: 'ethereum'
            }
        ]

        // Return all wallets, filtering out Ethereum wallets without connectors
        return wallets.filter(wallet => 
            wallet.blockchain === 'solana' || wallet.blockchain === 'tron' || wallet.connector
        )
    }

    const walletOptions = getWalletOptions()

    if (!isOpen) return null

    // Don't show modal on mobile - WalletConnect will handle directly
    if (isMobile) return null

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] transition-opacity duration-300"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[51] p-4">
                <div 
                    className="relative w-full max-w-[360px] min-h-[557px] flex flex-col bg-black border border-gray-600 rounded-[2.5rem] shadow-2xl transform transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative px-6 pt-5 pb-3">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 transition-colors text-gray-400 hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-white">
                                {tWallet('subtitle')}
                            </h2>
                        </div>
                    </div>

                    {/* Wallet Options */}
                    <div className={`px-6 pb-5 flex-1 flex flex-col ${
                        walletOptions.length <= 5 ? 'py-4' : ''
                    }`}>
                        <div className={`flex flex-col flex-1 ${
                            walletOptions.length <= 6 ? 'gap-3' : 'gap-2'
                        }`}>
                            {walletOptions.map((wallet) => (
                                <button
                                    key={wallet.id}
                                    onClick={() => handleWalletClick(wallet)}
                                    disabled={isPending || (wallet.blockchain === 'tron' && isTronConnecting)}
                                    className={`w-full rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 text-left flex items-center justify-between group disabled:opacity-50 flex-1 max-h-[75px] ${
                                        walletOptions.length <= 4 ? 'py-4 px-4' : 'py-3 px-4'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors bg-gray-800 group-hover:bg-gray-700">
                                            {wallet.iconType === 'image' ? (
                                                <Image
                                                    src={wallet.icon}
                                                    alt={wallet.name}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-lg">{wallet.icon}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-base text-white">
                                                {wallet.name}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        {wallet.id === 'walletconnect' ? (
                                            <span className="text-xs text-purple-400 font-medium bg-purple-400/10 px-2 py-1 rounded-md">
                                                {tWallet('qrCode')}
                                            </span>
                                        ) : wallet.available ? (
                                            <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded-md">
                                                {tWallet('installed')}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-purple-600 font-medium bg-purple-600/10 px-2 py-1 rounded-md">
                                                {wallet.type === 'extension' ? tWallet('install') : tWallet('get')}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Footer */}
                        {!connectors.find(c => c.name === 'WalletConnect') && (
                            <div className="mt-6 p-4 border rounded-2xl bg-yellow-900/20 border-yellow-800">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-yellow-300">
                                        {tWallet('walletConnectNotConfigured')}
                                    </div>
                                    <div className="text-xs mt-1 text-yellow-400">
                                        {tWallet('walletConnectConfigNote')}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}
