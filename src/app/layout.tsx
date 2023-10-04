import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZecHub Wiki',
  description: 'Learn all about ZCash',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //dark:bg-slate-900 dark:text-gray-200
  return (
    <html lang="en">
      <body className={`${inter.className} px-12`}>{children}</body>
    </html>
  )
}
