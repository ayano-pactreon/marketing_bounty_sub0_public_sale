'use client'

import React, { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslations } from 'next-intl'

interface PasswordGateProps {
  children: React.ReactNode
}

const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const { isDark } = useTheme()
  const tPasswordGate = useTranslations('passwordGate')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/password', {
        method: 'GET',
        credentials: 'include'
      })
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError(tPasswordGate('errors.enterPassword'))
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setError(data.message || tPasswordGate('errors.invalidPassword'))
        setPassword('')
      }
    } catch (error) {
      console.error('Password submission failed:', error)
      setError(tPasswordGate('errors.connectionError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className={`fixed inset-0 z-[99999] flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {tPasswordGate('checkingAccess')}
          </p>
        </div>
      </div>
    )
  }

  // Show children if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Show password gate if not authenticated
  return (
    <div className={`fixed inset-0 z-[99999] ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-white to-violet-50'
    }`} style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'all'
    }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className={`w-full max-w-md ${
          isDark ? 'bg-gray-800/95' : 'bg-white/95'
        } backdrop-blur-md rounded-2xl shadow-2xl border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } p-8`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r from-[#6d28d9] to-[#c084fc]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {tPasswordGate('title')}
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {tPasswordGate('description')}
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {tPasswordGate('passwordLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className={`w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${error ? 'border-red-500' : ''}`}
                  placeholder={tPasswordGate('passwordPlaceholder')}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                isSubmitting || !password.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#6d28d9] to-[#c084fc] hover:from-[#2d5ba8] hover:to-[#0066dd] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {tPasswordGate('verifying')}
                </div>
              ) : (
                tPasswordGate('accessSite')
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={`text-center mt-6 text-xs ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {tPasswordGate('pageTitle')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordGate