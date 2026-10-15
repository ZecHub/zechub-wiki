import { Wrench } from 'lucide-react'
import ToolTabs from './ToolTabs'

// Which tool is open comes from `?tool=`, so this page can't be prerendered as
// one static document — rendering per request is what lets a shared link land
// on the right tool instead of flipping to it after hydration.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Zcash Developer Tools | ZecHub',
  description:
    'ZEC/Zats converter, ZIP-321 payment request builder, and unified address decoder.',
  openGraph: {
    title: 'Zcash Developer Tools',
    description:
      'Convert ZEC ↔ Zats, build ZIP-321 payment URIs, and decode unified addresses.',
  },
}

export default function ToolsPage() {
  return (
    <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand/40 bg-brand/10 text-brand dark:text-brand-soft">
          <Wrench aria-hidden="true" className="h-5 w-5" />
        </div>
        <h1 className="mb-3 text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
          Zcash Tools
        </h1>
        <p className="m-0 text-base leading-7 text-slate-600 dark:text-slate-300">
          Convert, build payment requests, decode addresses &amp; claim testnet ZEC.
        </p>
      </header>

      <ToolTabs />
    </div>
  )
}
