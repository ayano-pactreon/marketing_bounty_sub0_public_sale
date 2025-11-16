'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ComingSoonWrapper from './ComingSoonWrapper'
import Providers from './providers'
import { AnnouncementProvider } from '@/contexts/AnnouncementContext'
import PasswordGate from './PasswordGate'
import AOSInit from './AOSInit'

interface ComingSoonBypassProps {
  isComingSoonEnabled: boolean
  children: React.ReactNode
}

function ComingSoonBypassContent({ isComingSoonEnabled, children }: ComingSoonBypassProps) {
  const searchParams = useSearchParams()
  const [shouldBypass, setShouldBypass] = useState(false)
  
  useEffect(() => {
    // Check for bypass parameter
    const bypass = searchParams.get('bypass')
    if (bypass === 'coming-soon' || bypass === 'true') {
      setShouldBypass(true)
    }
  }, [searchParams])
  
  // If coming soon is enabled and we're not bypassing it, show coming soon page
  if (isComingSoonEnabled && !shouldBypass) {
    return <ComingSoonWrapper />
  }
  
  // Otherwise show the normal site with password protection
  return (
    <Providers>
      <AnnouncementProvider>
        <PasswordGate>
          <AOSInit />
          {children}
        </PasswordGate>
      </AnnouncementProvider>
    </Providers>
  )
}

export default function ComingSoonBypass({ isComingSoonEnabled, children }: ComingSoonBypassProps) {
  return (
    <Suspense fallback={
      isComingSoonEnabled ? <ComingSoonWrapper /> : (
        <Providers>
          <AnnouncementProvider>
            <PasswordGate>
              <AOSInit />
              {children}
            </PasswordGate>
          </AnnouncementProvider>
        </Providers>
      )
    }>
      <ComingSoonBypassContent isComingSoonEnabled={isComingSoonEnabled}>
        {children}
      </ComingSoonBypassContent>
    </Suspense>
  )
}