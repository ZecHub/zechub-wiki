import ZecToZatsConverter from '@/components/Converter/ZecToZatsConverter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZEC <-> Zats Converter | ZecHub',
  description: 'ZEC to Zats (Zatoshi) converter.',
  openGraph: {
    title: 'ZEC <-> Zats Converter',
    description: '1 ZEC = 100,000,000 Zats - precise converter for Zcash users',
  },
}

export default function ConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          ZEC ↔ Zats Converter
        </h1>
        <p className="mt-4 text-2xl text-emerald-600 dark:text-emerald-400">
          1 ZEC = 100,000,000 Zats (Zatoshi)
        </p>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          Real-time conversion
        </p>
      </div>

      <ZecToZatsConverter />
    </div>
  )
}
