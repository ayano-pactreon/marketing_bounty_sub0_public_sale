import ComingSoon from './ComingSoon'
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/en.json'

export default function ComingSoonWrapper() {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <ComingSoon />
    </NextIntlClientProvider>
  )
}