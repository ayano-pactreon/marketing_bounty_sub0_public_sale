'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/config/wagmi'
import React, { useState, useEffect } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { SolanaWalletProvider } from '@/contexts/SolanaWalletContext';
import { TronProvider } from '@/contexts/TronContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                // Don't retry connection errors
                if (error?.message?.includes('Connection interrupted')) {
                    return false
                }
                return failureCount < 3
            },
        },
    },
})

type Props = {
    children: React.ReactNode
}

export default function Providers({ children }: Props) {
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);

    const loadMessages = async () => {
        try {
            const response = await fetch('/api/messages');
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error('Failed to load messages:', response.statusText);
                // Fallback to empty messages to prevent app crash
                setMessages({});
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            // Fallback to empty messages to prevent app crash
            setMessages({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load messages immediately
        loadMessages();
        
        // Reload messages every minute to catch updates from database
        const interval = setInterval(loadMessages, 60000);
        return () => clearInterval(interval);
    }, []);

    // Show themed loading screen while messages are being loaded
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1a1030] via-[#241345] to-[#2d1b52] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,132,252,0.12),transparent_55%)]"></div>
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
                
                {/* Loading content */}
                <div className="relative z-10 text-center">
                    {/* Animated logo/icon */}
                    <div className="mb-8">
                        <div className="w-20 h-20 mx-auto relative">
                            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                        </div>
                    </div>
                    
                    {/* Loading text */}
                    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_10px_25px_rgba(255,255,255,0.18)]">Chain</h1>
                    <p className="text-lg mb-6 text-slate-100 font-semibold tracking-wide drop-shadow-[0_8px_20px_rgba(192,132,252,0.35)]">
                        Powering AI-Driven Digital Nations
                    </p>
                    
                    {/* Loading indicator */}
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    
                    <p className="text-purple-100/70 text-sm mt-4">Loading latest content...</p>
                </div>
            </div>
        );
    }

    return (
        <NextIntlClientProvider locale="en" messages={messages}>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <SolanaWalletProvider>
                        <TronProvider>
                            {children}
                        </TronProvider>
                    </SolanaWalletProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </NextIntlClientProvider>
    )
}
