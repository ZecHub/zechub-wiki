import type { ReactNode } from "react";

// With next-intl's `[locale]` segment, the `<html>`/`<body>` document shell is
// rendered by `src/app/[locale]/layout.tsx`. This root layout only needs to
// pass children through so that requests which never enter the `[locale]`
// segment (handled by the middleware) still have a valid root layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
