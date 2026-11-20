# Interfaces

An interface is a whole look for the wiki: type, spacing, shapes, motion. Visitors pick one in the header's **Appearance** menu, above Mode. Interfaces are separate from colour themes, so any interface works with any colour theme in light and dark mode.

## Add an interface

1. For a stylesheet interface, create `src/components/Interfaces/<id>.css` and scope **every** rule to `:root[data-interface="<id>"]`. For a full interface with its own URL, set `embedUrl` and render it from `DesktopInterfaceHost`.
2. Import the stylesheet in `src/components/Interfaces/index.css`.
3. Add an entry to `INTERFACES` in `src/lib/interfaces.ts`: `id`, `name`, a short `hint`, and the `sampleFont` used for the "Aa" preview in the menu.
4. Run `yarn test src/lib/__tests__/interfaces.test.ts`.

## Rules

- **No colours.** Use the colour theme tokens (`--color-brand`, `--color-page`, `--color-surface`, ...) and never set them. That keeps your interface working with every colour theme.
- **Light and dark.** Check both modes. Dark mode is the `.dark` class on `<html>`.
- **Only stable hooks.** Target elements, the `.mdx-article` article wrapper, `[data-backdrop]` (the page background), and theme variables such as `--font-heading`, `--font-body`, `--font-reader` and `--radius`. Avoid long chains of utility classes; they change often.
- **Fonts.** Load new fonts with `next/font` in `src/app/[locale]/layout.tsx` (`preload: false`, a CSS `variable`), never from a third-party URL: the site makes no third-party requests on page load.
- **Readable first.** Keep body text at 16px or more and enough contrast in both modes.

## Available

| id | Name | What it changes |
|---|---|---|
| `classic` | Classic | Nothing: the standard ZecHub look (no attribute is set). |
| `reader` | Reader | Serif headings and article text, about 68 characters a line, flatter corners, no background glow, less motion. Navigation stays sans. |
| `text` | Text | One monospace font, no images, video or decoration, a single 80-character column, Markdown-style `#` heading marks and keyboard shortcuts (`j`/`k` headings, `/` search, `t` top, `h` home, `?` key list). The keys live in `src/components/TextInterfaceKeys.tsx`, run only while Text is active, ignore typing and dialogs, and can be turned off from the key list (WCAG 2.1.4). YouTube placeholders become a one-line `[Play video: title]` button. |
| `desktop` | Desktop | The full Mac-style desktop wiki, embedded from `embedUrl` over the current page. Set `NEXT_PUBLIC_DESKTOP_INTERFACE_URL` to its deployment URL. |
