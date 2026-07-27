import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// `alternateLinks: false` disables next-intl's automatic `Link:` hreflang
// response header. That header would otherwise advertise ALL routing.locales as
// alternates on EVERY response (including untranslated and bespoke pages),
// conflicting with the precise per-page hreflang we emit in <head> (via
// generateMetadata) and in the sitemap. Google reads all sources and they must
// agree, so we keep our controlled head + sitemap hreflang as the single
// source. Locale routing and detection are unaffected — only the Link
// alternates stop.
export default createMiddleware({ ...routing, alternateLinks: false });

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    "/((?!api|_next/static|_next/image|trpc|_vercel|favicon.ico|icon.png|.*\\..*).*)",
  ],
};
