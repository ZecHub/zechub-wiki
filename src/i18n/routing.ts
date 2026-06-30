import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported.
  // Scoped to the locales we actually ship dictionaries + translated content for.
  locales: ["en", "it", "es"],

  // Used when no locale matches.
  defaultLocale: "en",

  // English is served unprefixed at the root (`/`); other locales are
  // prefixed (`/it/...`). next-intl only adds the prefix when needed.
  localePrefix: "as-needed",
});
