import './globals.css';

import { Footer, Navigation } from '@/components';
import { AppProvider } from '@/components/AppProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZecHub Wiki',
  description: 'An open source education hub for Zcash',
  icons: 'https://i.ibb.co/ysPDS9Q/Zec-Hub-blue-globe.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //dark:bg-slate-900 dark:text-gray-200

  return (
    <html lang='en'>
      <body className={`${inter.className} px-6`}>
          <AppProvider>
            <Navigation />
            <div style={{ margin: '48px 0' }}>{children}</div>
            <Footer />
          </AppProvider>
      </body>
    </html>
  );
}
