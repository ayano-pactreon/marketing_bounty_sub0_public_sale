'use client'
import React, {useEffect, useState} from 'react';
import {Copy, Send} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter, useSearchParams} from 'next/navigation';
import {useAccount, useChainId} from 'wagmi';
import {useReferralGeneration} from '@/hooks/useReferralGeneration';
import {purchaseService} from '@/services/purchase-service';

const ThankYouPage = () => {
  const tThankYou = useTranslations('thankYou');
  const tSharing = useTranslations('thankYou.sharing');
  const tReferral = useTranslations('thankYou.referralGeneration');
  const searchParams = useSearchParams();
  const router = useRouter();
  const chainId = useChainId();
  const { address } = useAccount();
  const { referralData, isLoading: isGeneratingReferral, error: referralError, generateReferral } = useReferralGeneration();
  const [purchaseSubmitted, setPurchaseSubmitted] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [processedTransactions, setProcessedTransactions] = useState<Set<string>>(new Set());

  const tokens = searchParams.get('tokens');
  const amount = searchParams.get('amount');
  const hash = searchParams.get('hash');
  const currency = searchParams.get('currency');
  const walletAddress = searchParams.get('walletAddress');
  const referralCode = searchParams.get('referralCode');
  const network = searchParams.get('network');

  const baseReferralUrl = tThankYou('referralLink');
  const referralLink = referralData?.referralCode 
    ? baseReferralUrl.replace(/ref=.*$/, `ref=${referralData.referralCode}`)
    : baseReferralUrl;

  const twitterMessage = tSharing('twitterMessage', { 
    tokens: tokens || '0',
    referralLink: referralLink 
  });

  // Submit purchase to API when page loads with valid transaction data
  useEffect(() => {
    const submitPurchaseToAPI = async () => {
      // Check if we have all required data
      if (!walletAddress || !tokens || !hash || !network) {
        return;
      }

      // Check if this transaction has already been processed
      // Use localStorage to persist across page reloads
      const processedKey = `purchase_submitted_${hash}`;
      const alreadyProcessed = localStorage.getItem(processedKey);
      
      if (alreadyProcessed) {
        console.log('📝 Purchase already submitted for transaction:', hash);
        return;
      }

      // Also check in-memory state to prevent double calls in same session
      if (processedTransactions.has(hash)) {
        console.log('📝 Purchase already submitted in this session:', hash);
        return;
      }

      try {
        // Mark as processing immediately to prevent double calls
        setProcessedTransactions(prev => new Set(prev).add(hash));
        
        // Parse token amount (remove commas and convert to number)
        const tokenAmount = parseFloat(tokens.replace(/,/g, ''));
        
        await purchaseService.submitPurchase({
          walletAddress,
          tokens: tokenAmount,
          referralCode: referralCode || undefined,
          network,
          transactionHash: hash
        });
        
        // Mark as processed in localStorage to persist across reloads
        localStorage.setItem(processedKey, 'true');
        
        console.log('✅ Purchase successfully submitted to API for transaction:', hash);
      } catch (error) {
        console.error('❌ Failed to submit purchase to API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to submit purchase to API';
        setPurchaseError(errorMessage);
        
        // Remove from processed set on error to allow retry
        setProcessedTransactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(hash);
          return newSet;
        });
      }
    };

    submitPurchaseToAPI();
  }, [walletAddress, tokens, hash, network, referralCode]);

  useEffect(() => {
    if (address && !referralData && !isGeneratingReferral) {
      generateReferral(address);
    }
  }, [address, referralData, isGeneratingReferral, generateReferral]);

  useEffect(() => {
    if (!tokens || !hash) {
      router.push('/');
    }
  }, [tokens, hash, router]);

  if (!tokens || !hash) {
    return null;
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterMessage)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      try {
        window.location.href = `tg://msg?text=${encodeURIComponent(twitterMessage)}`;
      } catch {
        window.open(`https://t.me/share/url?text=${encodeURIComponent(twitterMessage)}`, '_blank');
      }
    } else {
      window.open(`tg://msg_url?url=${encodeURIComponent(twitterMessage)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 px-4 bg-white">
      <div className="max-w-2xl w-full mx-auto">
        <div className="sm:p-8 md:p-10 text-center">
          
          {/* Congratulations Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {tThankYou('congratsMessage')}
            </h1>
            
            <p className="text-lg sm:text-xl mb-6 text-gray-700">
              {tThankYou('purchaseMessage.part1')} <span className="font-bold text-purple-500">{tokens} {tThankYou('purchaseMessage.part2')}</span>
              {amount && (
                <>
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  {tThankYou('purchaseMessage.part3')} <span className="font-bold text-gray-900">{amount} {currency}</span>.
                </>
              )}
            </p>
          </div>

          {/* Share Section */}
          <div className="px-6 pt-6 rounded-2xl backdrop-blur-sm">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">
                {tThankYou('sharing.title')}
              </h2>
              <p className="text-sm sm:text-base mb-2 text-gray-600">
                {tThankYou('sharing.description')}
              </p>
            </div>

            {/* Share to Twitter Button */}
            <button
              onClick={shareToTwitter}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-center space-x-2 mb-4 sm:mb-6 shadow-lg mx-auto"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-base sm:text-lg">{tThankYou('sharing.shareButton')}</span>
            </button>

            {/* Pre-filled message */}
            <div className="p-3 sm:p-4 rounded-xl border text-left text-xs sm:text-sm mb-4 sm:mb-6 bg-white border-gray-300 text-gray-700">
              <p className="break-words leading-relaxed">{twitterMessage}</p>
            </div>

            {/* Referral Link with Copy */}
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <input
                type="text"
                value={isGeneratingReferral ? tReferral('loading') : referralLink}
                readOnly
                className={`flex-1 px-3 sm:px-4 py-3 text-sm rounded-xl border min-w-0 font-mono bg-white border-gray-300 text-gray-700 ${isGeneratingReferral ? 'animate-pulse' : ''}`}
              />
              <button
                onClick={() => copyToClipboard(referralLink)}
                disabled={isGeneratingReferral || referralError !== null}
                className="p-3 rounded-xl border flex-shrink-0 transition-all duration-300 hover:scale-105 bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            
            {/* Error message for referral generation */}
            {referralError && (
              <div className="text-red-600 text-sm mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
                <p>⚠️ {referralError}</p>
                <p className="mt-1 text-xs">{tReferral('fallbackNote')}</p>
              </div>
            )}
          </div>
          
          {/* Also share on */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-900">
              {tThankYou('sharing.alsoShareOn')}
            </h3>
            
            <div className="flex items-center justify-center sm:gap-4">
              {/* Telegram */}
              <button
                onClick={shareToTelegram}
                className="flex items-center justify-center space-x-2 p-3 sm:p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-purple-500/50 shadow-md hover:shadow-lg"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Send width={12} height={12} className="stroke-white" />
                </div>
                <span className="text-sm sm:text-base font-medium truncate">{tThankYou('socialPlatforms.telegram')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
