import ThankYouPage from '@/components/ThankYouPage';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function ThankYouPageRoute() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThankYouPage />
    </NextIntlClientProvider>
  );
}