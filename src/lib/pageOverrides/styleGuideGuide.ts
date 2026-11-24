// Style Guide: full rewrite. Keeps the original rules (plain, brief, user first, sentence case, no end punctuation in
// titles, start with a verb, one space, no Latin abbreviations, Microsoft style guide as the fallback) and adds the
// content rules the wiki follows: TL;DR, no date stamps or "latest/current", sourced claims, terminology, formatting,
// images and a pre-submit checklist. Skipped if the H1 is missing.

const BODY = `## TL;DR

- Write for users first, developers second, everyone else third.
- Start with the most important point, then keep it short.
- Begin every page with a **TL;DR** and end it with **Related pages**.
- State only facts you can link to a source. Leave out what you cannot confirm.
- Do not write "latest", "current" or "last updated". Link to the page that holds the answer instead.

## Principles

1. **Be ready to help.** Show Zcash users that the page is on their side.
2. **Be brief and direct.** Deliver the simplest message first.
3. **Write for the user.** Users come first, developers second, everyone else third.

## Writing rules

- **Get to the point.** Put the most important point first and front-load keywords so readers can skim. Make options and next steps clear.
- **Write like you speak.** Readers are real people. Use plain words.
- **Be brief.** Give readers enough to solve a problem or make a choice, and stop.
- **Start with a verb** when you can. Write "Send and receive ZEC with your phone", not "You can send and receive ZEC from your mobile phone".
- **Use sentence case in titles and headings.** Capitalize the first word and proper nouns such as Zcash. Write "How to send ZEC with a unified address".
- **Skip periods in titles,** headings, subheads and list items of three words or fewer. Use periods in paragraphs.
- **Use one space** after periods and colons.
- **Avoid foreign phrases and Latin abbreviations.**

| Use this | Instead of this |
| --- | --- |
| for example | e.g. |
| that is | i.e. |
| and so on | etc. |

## Page structure

1. **Title.** One H1 that names the topic.
2. **TL;DR.** Three to six bullets that say what the page covers and what the reader should do.
3. **Body.** Short sections with one idea each. Use a numbered list for steps and a table for comparisons.
4. **Common mistakes.** Add this when readers often get something wrong. Keep each point to one line.
5. **Related pages.** Link to the pages a reader is likely to need next.

## Keeping facts accurate

- **Source every claim.** Every number, date, version, address and statement about another project needs a source you can link. If you cannot confirm it, leave it out.
- **Link to the source of truth.** Point to the official site, the ZIP or the repository instead of copying details that change.
- **Avoid "latest", "current" and "currently" for versions.** Releases change often. Write "see the releases page" and link it.
- **Do not add "last updated" or "last verified" labels.** They go stale and make the rest of the page look unchecked.
- **Date events, not the page.** Write "NU7 activated at block 3,543,405", not "NU7 is the newest upgrade".
- **Mark third-party services as third-party.** Tell readers to check the service's own site before they send funds.
- **Never invent figures.** If the page needs a number you do not have, say what is known and link where to look.

## Terminology

| Write | Meaning |
| --- | --- |
| Zcash | The network and the protocol |
| ZEC | The currency |
| TAZ | The test coin on the Testnet |
| shielded | Uses a shielded pool: sender, receiver and amount are hidden |
| transparent | Public, like Bitcoin. Addresses start with \`t\` |
| unified address | An address that bundles several receivers. Starts with \`u1\` |
| ZODL | The wallet formerly named Zashi |
| ZIP | Zcash Improvement Proposal, written as "ZIP 258" |
| NU7 | Network upgrade names: NU5, NU6.3, NU7 |

Use the same name for a thing everywhere on a page. Spell out an abbreviation the first time you use it.

## Formatting

- **Headings.** Use H2 for sections and H3 for subsections. Do not skip levels.
- **Lists.** Use bullets for items without an order and numbers for steps. Keep each item parallel.
- **Tables.** Use them to compare things across the same attributes.
- **Code.** Put commands, addresses and file names in code formatting. Use a code block for more than one line.
- **Links.** Use descriptive link text, never "click here". Use relative links such as \`/using-zcash/wallets\` for pages on this wiki.
- **Emphasis.** Use bold for key terms and warnings. Do not use all caps.

## Images and media

- **Describe every image** with alt text.
- **Keep images small** enough to read on a phone, and crop the empty margins.
- **Use your own images** or ones you have the right to use. Do not use another project's logo without checking its terms.
- **Add a caption** when an image shows data, and say what the data covers.
- **Do not paste secrets.** Never include seed phrases, private keys or API keys, even example ones that look real.

## Social media and short posts

This guide also applies to tweets and other short messages: keep them brief, put the point first and skip end punctuation on short lines.

## Before you submit

- [ ] The page starts with a TL;DR and ends with Related pages.
- [ ] Every number, date and claim has a source.
- [ ] There is no "latest", "current" or "last updated" wording.
- [ ] Links work and images have alt text.
- [ ] The page reads well on a phone.
- [ ] A reader can finish the task on the page without leaving it, or knows where to go next.

---

<small>
The ZecHub style guide is adapted from the <a href="https://learn.microsoft.com/en-us/style-guide/">Microsoft Writing Style Guide</a> with changes. Read the Microsoft guide when this one does not answer your question.
</small>
`;

export function rewriteStyleGuide(original: string): string {
  const h1 = original.match(/^# ZecHub Style Guide\s*$/m);
  if (!h1 || h1.index === undefined) return original;
  return original.slice(0, h1.index + h1[0].length) + "\n\n" + BODY;
}
