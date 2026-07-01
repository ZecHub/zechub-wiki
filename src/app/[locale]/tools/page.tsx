import ToolTabs from './ToolTabs'

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
    <div className="min-h-screen bg-zinc-50 dark:bg-[#111b27]">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(244,183,40,0.04),transparent)]"
        aria-hidden
      />

      <div className="relative max-w-xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4B728] to-[#d9a520] shadow-lg shadow-[#F4B728]/15 mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7v10l9 5 9-5V7l-9-5z"
                fill="#151e29"
                fillOpacity="0.15"
                stroke="#151e29"
                strokeWidth="1.5"
              />
              <text
                x="50%"
                y="58%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill="#151e29"
              >
                Z
              </text>
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Zcash Tools
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-[#5a6a7e] max-w-sm mx-auto">
            Convert, build payment requests &amp; decode addresses.
          </p>
        </div>

        <ToolTabs />
      </div>
    </div>
  )
}