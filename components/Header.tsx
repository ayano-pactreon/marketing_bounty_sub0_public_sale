'use client'
import React, {useState, useEffect} from 'react';
import {Menu, X, LogOut} from 'lucide-react';
import {useTheme} from '@/contexts/ThemeContext';
import Image from "next/image";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import { useWallet } from '@solana/wallet-adapter-react';
import { useTron } from '@/contexts/TronContext';
import WalletModal from "@/components/WalletModal";
import DisconnectModal from "@/components/DisconnectModal";
import { useTranslations } from 'next-intl';

const Header = () => {
    const {isDark} = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const {isPending} = useConnect();
    const {isConnected, address} = useAccount();
    const {disconnect} = useDisconnect();
    
    // Solana wallet state
    const { connected: isSolanaConnected, publicKey: solanaPublicKey, disconnect: disconnectSolana } = useWallet();
    
    // TRON wallet state
    const { isConnected: isTronConnected, address: tronAddress, disconnect: disconnectTron } = useTron();
    
    const [isMounted, setIsMounted] = useState(false);
    
    // Check if any wallet is connected (Ethereum, Solana or TRON)
    const isAnyWalletConnected = isConnected || isSolanaConnected || isTronConnected;
    const connectedAddress = isConnected ? address : (isSolanaConnected ? solanaPublicKey?.toBase58() : tronAddress) || '';
    
    const tNavigation = useTranslations('navigation');
    const tWallet = useTranslations('wallet');
    const t = useTranslations('comingSoon')

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        {name: tNavigation('technology'), href: '#technology'},
        {name: tNavigation('tokenomics'), href: '#tokenomics'},
        {name: tNavigation('useCases'), href: '#traction'},
        {name: tNavigation('roadmap'), href: '#roadmap'},
        {name: tNavigation('faq'), href: '#faq'},
        {name: tNavigation('telegram'), href: t('links.telegram')},
        {name: tNavigation('twitter'), href: t('links.twitter')}
    ];
    useEffect(() => {
        setIsMounted(true)
    }, [])
    const handleWalletClick = () => {
        if (!isAnyWalletConnected) {
            setShowWalletModal(true)
        }
        // Do nothing when connected - button shows address only
    };

    const handleDisconnect = async () => {
        try {
            // Disconnect based on which wallet is connected
            if (isConnected) {
                await disconnect()
            }
            if (isSolanaConnected) {
                await disconnectSolana()
            }
            if (isTronConnected) {
                disconnectTron()
            }
        } catch (err) {
            console.warn('Disconnect error:', err)
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
                ? 'bg-black/60 backdrop-blur-xl border-b border-purple-500/25 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="w-40 shrink-0 flex items-center">
                        <span className="text-2xl font-bold tracking-wide uppercase px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#b45309] via-[#92400e] to-[#7c2d12] text-white shadow-lg shadow-orange-900/40 border border-white/10 drop-shadow-[0_10px_25px_rgba(180,83,9,0.45)]">
                            Zexify
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-6 text-slate-200">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`transition-colors duration-200 text-sm font-medium ${
                                    isDark
                                        ? 'text-slate-200 hover:text-purple-300'
                                        : 'text-slate-100 hover:text-purple-200'
                                }`}
                                target={item.name === tNavigation('telegram') || item.name === tNavigation('twitter') ? '_blank' : undefined}
                                rel={item.name === tNavigation('telegram') || item.name === tNavigation('twitter') ? 'noopener noreferrer' : undefined}
                            >
                                {item.name === tNavigation('telegram') ? (
                                    <Image 
                                        src="/images/telegram.png"
                                        alt="Telegram" 
                                        width={25}
                                        height={25}
                                        className=""
                                    />
                                ) : item.name === tNavigation('twitter') ? (
                                    <Image
                                        src="/images/X_icon.png"
                                        alt="Twitter"
                                        width={25}
                                        height={25}
                                        className="inline-block"
                                    />
                                ) : (
                                    item.name
                                )}
                            </a>
                        ))}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleWalletClick}
                                disabled={isPending}
                                className="bg-gradient-to-r from-[#b45309] via-[#92400e] to-[#7c2d12] px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg shadow-orange-900/40"
                            >
                               <span className="text-white text-base">
                                 {!isMounted
                                     ? tWallet('connectWallet')
                                     : isPending
                                         ? tWallet('connecting')
                                         : isAnyWalletConnected && connectedAddress
                                             ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
                                             : tWallet('connectWallet')}
                               </span>
                            </button>
                            {/* Logout button - only show when connected */}
                            {isAnyWalletConnected && isMounted && (
                                <button
                                    onClick={() => setShowDisconnectModal(true)}
                                    className="bg-gradient-to-r from-[#6d28d9] to-[#c084fc] p-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                                    aria-label="Disconnect Wallet"
                                >
                                    <LogOut className="w-5 h-5 text-white" />
                                </button>
                            )}
                        </div>
                    </nav>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors duration-200 border border-white/5 bg-white/5 hover:border-purple-400/50 hover:bg-white/10 ${
                            isDark
                                ? 'text-slate-200 hover:text-white'
                                : 'text-slate-100 hover:text-white'
                        }`}
                    >
                        {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>} 
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden backdrop-blur-xl border-t bg-black/70 border-white/10">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-3 py-2 transition-colors ${
                                        isDark
                                            ? 'text-slate-200 hover:text-purple-300'
                                            : 'text-slate-100 hover:text-purple-200'
                                    } ${
                                        item.name === tNavigation('telegram') || item.name === tNavigation('twitter') ? 'flex items-center' : ''
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    target={item.name === tNavigation('telegram') || item.name === tNavigation('twitter') ? '_blank' : undefined}
                                    rel={item.name === tNavigation('telegram') || item.name === tNavigation('twitter') ? 'noopener noreferrer' : undefined}
                                >
                                    {item.name === tNavigation('telegram') ? (
                                        <>
                                            <Image 
                                                src="/images/telegram.png"
                                                alt="Telegram" 
                                                width={18}
                                                height={18}
                                                className="inline-block"
                                            />
                                        </>
                                    ) : item.name === tNavigation('twitter') ? (
                                        <>
                                            <Image
                                                src="/images/X_icon.png"
                                                alt="Twitter"
                                                width={18}
                                                height={18}
                                                className="inline-block"
                                            />
                                        </>
                                    ) : (
                                        item.name
                                    )}
                                </a>
                            ))}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleWalletClick}
                                    disabled={isPending}
                                    className="flex-1 bg-gradient-to-r from-[#b45309] via-[#92400e] to-[#7c2d12] px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-lg shadow-orange-900/40"
                                >
                      <span className="text-white text-base">
                            {!isMounted
                            ? tWallet('connectWallet')
                            : isPending
                             ? tWallet('connecting')
                             : isAnyWalletConnected && connectedAddress
                              ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
                              : tWallet('connectWallet')}
                      </span>
                                </button>
                                {/* Mobile logout button */}
                                {isAnyWalletConnected && isMounted && (
                                    <button
                                        onClick={() => {
                                            setShowDisconnectModal(true)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="bg-gradient-to-r from-[#6d28d9] to-[#c084fc] px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                                        aria-label="Disconnect Wallet"
                                    >
                                        <LogOut className="w-5 h-5 text-white" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <WalletModal
                isOpen={showWalletModal}
                onClose={() => setShowWalletModal(false)}
            />
            <DisconnectModal
                isOpen={showDisconnectModal}
                onClose={() => setShowDisconnectModal(false)}
                onConfirm={handleDisconnect}
                walletAddress={connectedAddress}
            />
        </header>
    );
};


export default Header;
