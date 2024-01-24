import './globals.css'


import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navigation, Footer } from '@/components'
import { AppProvider } from '@/components/AppProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZecHub Wiki',
  description: 'An open source education hub for Zcash',
  icons: 'https://i.ibb.co/ysPDS9Q/Zec-Hub-blue-globe.png'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //dark:bg-slate-900 dark:text-gray-200

  return (
    <html lang='en'>
      <body className={`${inter.className} px-12`}>
        <AppProvider>
          <Navigation />
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
