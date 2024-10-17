import './globals.css';
import { Footer, Navigation } from '@/components';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'ZecHub Wiki',
//   description: 'An open source education hub for Zcash',
//   icons: 'https://i.ibb.co/ysPDS9Q/Zec-Hub-blue-globe.png',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //dark:bg-slate-900 dark:text-gray-200

  return (
    <html lang='en-US'>
      <body className={`${inter.className} px-6`}>
        <div className='container mx-auto min-h-screen flex flex-col'>
          <div className='flex flex-col justify-between flex-grow'>
            <div>
              <Navigation />
              <div style={{ margin: '0 0 48px 0' }}>{children}</div>
            </div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

