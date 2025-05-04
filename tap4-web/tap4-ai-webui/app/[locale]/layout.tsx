import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Metadata } from 'next';

import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/home/Navigation';
import './globals.css';
import { Suspense } from 'react';
import GoogleAdScript from '@/components/ad/GoogleAdScript';
import SeoScript from '@/components/seo/SeoScript';
import Loading from './loading';

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning className='dark'>
      <body className='relative mx-auto flex min-h-screen flex-col bg-tap4-black text-white'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Toaster
            position='top-center'
            toastOptions={{
              classNames: {
                error: 'bg-red-400',
                success: 'text-green-400',
                warning: 'text-yellow-400',
                info: 'bg-blue-400',
              },
            }}
          />
          <Navigation />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </NextIntlClientProvider>
        <SeoScript />
        <GoogleAdScript />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | Survivor Game Online',
    default: 'Survivor Game Online - 500+ HTML5游戏任您畅玩',
  },
  description: 'Survivor Game Online提供500+精彩HTML5游戏，从激烈的生存挑战到紧张刺激的竞速游戏、烧脑的解谜游戏和史诗级冒险游戏。无需下载安装，直接在浏览器中畅玩。',
  keywords: 'HTML5游戏, 在线游戏, 免费游戏, 浏览器游戏, 生存游戏, 解谜游戏, 竞速游戏, 冒险游戏',
  applicationName: 'Survivor Game Online',
  authors: [{ name: 'Survivor Game Team' }],
  generator: 'Next.js',
  creator: 'Survivor Game Team',
  publisher: 'Survivor Game Online',
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://survivorgame.online'),
  openGraph: {
    type: 'website',
    siteName: 'Survivor Game Online',
    title: 'Survivor Game Online - 500+ HTML5游戏任您畅玩',
    description: 'Survivor Game Online提供500+精彩HTML5游戏，无需下载安装，直接在浏览器中畅玩。',
    images: '/images/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Survivor Game Online - 500+ HTML5游戏任您畅玩',
    description: 'Survivor Game Online提供500+精彩HTML5游戏，无需下载安装，直接在浏览器中畅玩。',
    images: '/images/twitter-image.jpg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: 'google-site-verification-code', // 替换为实际的验证码
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};
