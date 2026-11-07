// Raspberry Pi 4 Zebra Node (guides/raspberry-pi-4-zebra-node). The source guide is broken: it tells readers to copy a zcash.conf
// that Zebra does not use (Zebra reads a TOML file made with zebrad generate), has a stray "git comment" step, and points a browser
// at port 8233, which is the P2P port. The maintained guide is "Run a Full Node on a Raspberry Pi 4 (Zebra + Zallet)".
// If the page does not have the expected title, the original markdown is returned untouched.
export function rewritePiZebraGuide(original: string): string {
  const i = original.indexOf("# Raspberry Pi 4 Guide for Running Zebra");
  if (i < 0) return original;
  const body = [
    "# Raspberry Pi 4 Guide for Running Zebra",
    "",
    "This guide has been replaced. Its steps no longer match how Zebra is set up: Zebra reads a TOML configuration file that you create with the zebrad generate command, not a zcash.conf file.",
    "",
    "Use the maintained guide instead: [Run a Full Node on a Raspberry Pi 4 (Zebra + Zallet)](/guides/raspberry-pi-4-full-node).",
    "",
    "For Zebra itself, including requirements, configuration and ports, see [Zebra Full Node](/zcash-tech/zebra-full-node).",
    "",
  ].join("\n");
  return original.slice(0, i) + body;
}
