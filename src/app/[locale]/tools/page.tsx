import Image from 'next/image'
import ToolTabs from './ToolTabs'
import ToolsBackdrop from './ToolsBackdrop'

// Which tool is open comes from `?tool=`, so this page can't be prerendered as
// one static document — rendering per request is what lets a shared link land
// on the right tool instead of flipping to it after hydration.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Zcash Developer Tools | ZecHub',
  description:
    'ZEC/Zats converter, ZIP-321 payment request builder, unified address decoder, block-time converter, and Crosslink testnet tools.',
  openGraph: {
    title: 'Zcash Developer Tools',
    description:
      'Convert ZEC ↔ Zats, build ZIP-321 payment URIs, decode unified addresses, convert block times, and open Crosslink testnet tools.',
  },
}

export default function ToolsPage() {
  return (
    <div className="relative min-h-screen">
      <ToolsBackdrop />

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/ZecHubBlue.png"
              alt="ZecHub"
              width={72}
              height={72}
              priority
              className="h-[72px] w-[72px] dark:hidden"
            />
            <Image
              src="/zechubLogo-white.png"
              alt="ZecHub"
              width={72}
              height={72}
              priority
              className="hidden h-[72px] w-[72px] dark:block"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Zcash Tools
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-[#5a6a7e] max-w-lg mx-auto">
            Convert, build payment requests, decode addresses, look up block times, claim testnet ZEC, and follow Crosslink.
          </p>
        </div>

        <ToolTabs />
      </div>
    </div>
  )
}
