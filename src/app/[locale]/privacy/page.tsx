import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";

export const metadata: Metadata = genMetadata({
  title: "ZecHub — Privacy",
  url: "https://zechub.wiki/privacy",
});

// English-first. Fold into the translation-sync routine for the other locales.
// This page states the *current* observable behaviour of the site; keep it in
// sync when the observer surface changes (embeds, the AI assistant, hosting).

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Privacy
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
        ZecHub is an open-source education hub for a privacy-preserving currency,
        so we hold the site itself to the same standard. This page describes,
        plainly, exactly who can observe that you visited — no more, no less.
      </p>

      <Section title="We do not track you">
        <p>
          There are no analytics, no advertising, no tracking cookies, no
          fingerprinting, and no third-party trackers on this site. Reading the
          wiki requires no account, and we build no profile of you. We do not opt
          you into browser ad-topics APIs (they are disabled site-wide).
        </p>
      </Section>

      <Section title="Your connection to the site">
        <p>
          The site is served by our hosting provider (Vercel), which — like any
          web host — processes the network requests needed to deliver each page
          and keeps short-lived operational logs. Connections are HTTPS-only
          (enforced via HSTS). When you click a link that leaves the site, your
          browser sends only the originating site, never the specific page you
          were on.
        </p>
      </Section>

      <Section title="Images, fonts, and assets">
        <p>
          Fonts and the images on our pages are hosted by us and load from this
          domain, so rendering a page does not announce your visit to a content
          network. The only deliberate exceptions are a small number of logos
          served by Wikimedia and live status badges from shields.io — both
          chosen as privacy-respecting sources.
        </p>
      </Section>

      <Section title="Embeds load only when you ask">
        <p>
          Embedded videos (YouTube) and interactive maps load behind a
          click-to-load placeholder. Until you explicitly click to load one,
          nothing about your visit is sent to those services. Once you load an
          embed, it becomes a direct connection to that third party, which
          operates under its own privacy policy.
        </p>
      </Section>

      <Section title="Optional features you choose to use">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Newsletter</strong> — if you subscribe, we store the email
            address you provide, for the newsletter only.
          </li>
          <li>
            <strong>Wallet “likes”</strong> — if you like an item, the server
            records that a vote happened, keyed by a hash of your IP address plus
            that item, purely to stop duplicate votes. It is not tied to your
            identity or used to track you across the site.
          </li>
          <li>
            <strong>AI assistant</strong> — the built-in assistant is disabled by
            default; it only activates if the operator configures a model-provider
            key. When active, it sends your question and the page you are on to
            that third-party provider to generate an answer, and the interface
            makes that clear before you use it.
          </li>
        </ul>
      </Section>

      <Section title="Open source">
        <p>
          Everything here is public. You can read and audit the site&apos;s code
          and this page&apos;s claims in our repositories on{" "}
          <a
            href="https://github.com/ZecHub"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-700 underline decoration-dashed hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            GitHub
          </a>
          . This statement describes the site&apos;s current behaviour and is
          updated when that behaviour changes.
        </p>
      </Section>
    </main>
  );
}
