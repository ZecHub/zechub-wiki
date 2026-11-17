// Rewrite of "Arti: The Next-Generation Tor Client in Rust". The source page still described Arti 1.4.0,
// opened with two images that no longer exist (_unavailable.svg) and mixed install steps, a diagram and
// contribution notes with heavy bold markup. This keeps the commands and links from the ZecHub/zechub
// page, drops the broken images, updates the release status, and lays the steps out as numbered items.
// If the source is not this page any more, the original markdown is returned untouched.
export function rewriteArtiGuide(original: string): string {
  if (!/arti-tor/i.test(original) && !/^#\s*\**\s*Arti: The Next-Generation Tor Client/im.test(original)) return original;
  if (!/git clone https:\/\/gitlab\.torproject\.org\/tpo\/core\/arti\.git/.test(original)) return original;
  if (!/arti proxy/.test(original)) return original;

  const fm = original.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? "";
  const edit = original.match(/^\[!\[Edit Page\][^\n]*\n/m)?.[0] ?? "";

  return `${fm}${edit}
# Arti: the Tor client in Rust

Arti is the Tor Project's rewrite of the Tor client in Rust. It is designed to be modular, embeddable and production-ready, with the same anonymity protocols as the C implementation, and memory safety from the language.

> **Status.** The latest release is Arti 2.6.0 (1 September 2026), per the [Tor Project announcement](https://blog.torproject.org/arti_2_6_0_released/). Congestion control and Counter Galois Onion encryption are now always on. Running Arti as a **relay** is still in development, so today it is a client only. There are **no official pre-built binaries**: you build it from source, as below.

## Install and run Arti as a SOCKS proxy

<PointList>

<PointItem n="1" title="Install Rust">

Install a working Rust toolchain from the [Rust website](https://www.rust-lang.org/) (on Windows, use [rustup](https://rustup.rs/) and the Visual Studio Build Tools), then check it:

\`\`\`sh
rustc --version
\`\`\`

</PointItem>

<PointItem n="2" title="Clone the Arti repository">

\`\`\`sh
git clone https://gitlab.torproject.org/tpo/core/arti.git
cd arti
\`\`\`

</PointItem>

<PointItem n="3" title="Build the binary">

\`\`\`sh
cargo build -p arti --release
\`\`\`

The binary is created at \`target/release/arti\`.

</PointItem>

<PointItem n="4" title="Start the SOCKS proxy">

\`\`\`sh
./target/release/arti proxy -p 9150
\`\`\`

This starts Arti as a SOCKS5 proxy on port 9150, the same port Tor Browser uses.

</PointItem>

<PointItem n="5" title="Point your applications at it">

In the proxy settings of your browser or other application, set the SOCKS5 proxy to \`localhost:9150\`. Traffic from that application then goes through the Tor network.

</PointItem>

</PointList>

## How it fits together

\`\`\`plaintext
[Application] --(SOCKS5)--> [Arti SOCKS proxy] --(Tor protocol)--> [Tor network]
\`\`\`

The application talks to Arti over SOCKS5, and Arti talks to the Tor network, so your traffic is anonymised on the way out.

## Contribute

The code lives on the [Arti GitLab repository](https://gitlab.torproject.org/tpo/core/arti). The codebase is still changing, so expect refactoring as features land.

1. Fork the repository on GitLab (you need an account).
2. Add your fork as a remote, replacing \`_name_\` with your GitLab username:

   \`\`\`sh
   git remote add _name_ git@gitlab.torproject.org:_name_/arti.git
   git fetch _name_
   git push _name_ main
   \`\`\`

3. Open a merge request from your fork at \`https://gitlab.torproject.org/_name_/arti/-/merge_requests\`.

During review, add new commits rather than rebasing and squashing; use \`fixup!\` or \`squash!\` commits if needed so they can be auto-squashed later.
`;
}
