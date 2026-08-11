import { Link } from "@/i18n/navigation";

// Rendered when the [...slug] catch-all calls notFound() for a URL that
// resolves to neither an article nor a browsable section (see page.tsx).
// Kept intentionally minimal and on-brand; the surrounding chrome (nav,
// providers) comes from the [locale] layout.
export default function NotFound() {
  return (
    <main className="container m-auto flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-7xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        We couldn&apos;t find the page you were looking for. It may have been
        moved, renamed, or never existed. Try browsing the wiki from the
        homepage.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        ← Back to home
      </Link>
    </main>
  );
}
