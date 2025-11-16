'use client'
import React, { useState, useEffect } from 'react';
import { X, Clock, ArrowRight, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useAnnouncement } from '@/contexts/AnnouncementContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslations } from 'next-intl';

const AnnouncementPopup = () => {
  const { announcement, showAnnouncement, dismissAnnouncement } = useAnnouncement();
  const { isDark } = useTheme();
  const tAnnouncement = useTranslations('announcement');
  const tCountdown = useTranslations('countdown');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !announcement?.showCountdown || !announcement?.countdownTarget) return;

    const updateCountdown = () => {
      const target = new Date(announcement.countdownTarget!).getTime();
      const now = Date.now();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    // Initial update
    updateCountdown();
    
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [mounted, announcement]);

  if (!showAnnouncement || !announcement) return null;

  const getTypeStyles = () => {
    switch (announcement.type) {
      case 'success':
        return {
          bg: 'from-emerald-500/20 to-green-500/20',
          border: 'border-emerald-500/30',
          icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
          accent: 'text-emerald-400'
        };
      case 'warning':
        return {
          bg: 'from-orange-500/20 to-yellow-500/20',
          border: 'border-orange-500/30',
          icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
          accent: 'text-orange-400'
        };
      case 'urgent':
        return {
          bg: 'from-red-500/20 to-pink-500/20',
          border: 'border-red-500/30',
          icon: <AlertCircle className="w-6 h-6 text-red-400" />,
          accent: 'text-red-400'
        };
      default:
        return {
          bg: 'from-purple-500/20 to-violet-500/20',
          border: 'border-purple-500/30',
          icon: <Info className="w-6 h-6 text-purple-400" />,
          accent: 'text-purple-400'
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleButtonClick = () => {
    if (announcement.buttonLink) {
      if (announcement.buttonLink.startsWith('#')) {
        // Smooth scroll to section
        const element = document.querySelector(announcement.buttonLink);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // External link
        window.open(announcement.buttonLink, '_blank');
      }
    }
    dismissAnnouncement();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Popup */}
        <div className={`relative max-w-md w-full rounded-3xl border backdrop-blur-md shadow-2xl transform transition-all duration-300 ${
          isDark 
            ? `bg-gray-900/95 ${typeStyles.border}`
            : `bg-white/95 ${typeStyles.border}`
        }`}>
          {/* Close Button */}
          <button
            onClick={dismissAnnouncement}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="mr-3">
                {typeStyles.icon}
              </div>
              <h3 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {announcement.title}
              </h3>
            </div>

            {/* Message */}
            <p className={`mb-6 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {announcement.message}
            </p>

            {/* Countdown Timer */}
            {announcement.showCountdown && (
              <div className={`rounded-2xl p-4 mb-6 bg-gradient-to-r ${typeStyles.bg}`}>
                <div className="flex items-center mb-3">
                  <Clock className={`w-4 h-4 mr-2 ${typeStyles.accent}`} />
                  <span className={`text-sm font-medium ${typeStyles.accent}`}>
                    {tAnnouncement('timeRemaining')}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: tCountdown('days'), value: timeLeft.days },
                    { label: tCountdown('hours'), value: timeLeft.hours },
                    { label: tCountdown('minutes'), value: timeLeft.minutes },
                    { label: tCountdown('seconds'), value: timeLeft.seconds }
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className={`rounded-lg py-2 px-1 ${
                        isDark ? 'bg-gray-800/50' : 'bg-white/50'
                      }`}>
                        <div className={`text-lg font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.value.toString().padStart(2, '0')}
                        </div>
                        <div className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            {announcement.buttonText && (
              <button
                onClick={handleButtonClick}
                className={`w-full bg-gradient-to-r ${
                  announcement.type === 'success' ? 'from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' :
                  announcement.type === 'warning' ? 'from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700' :
                  announcement.type === 'urgent' ? 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' :
                  'from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700'
                } px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2`}
              >
                <span className="text-white">{announcement.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            )}

            {/* Dismiss Link */}
            <button
              onClick={dismissAnnouncement}
              className={`w-full mt-3 text-sm transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              {tAnnouncement('dontShowAgain')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementPopup;