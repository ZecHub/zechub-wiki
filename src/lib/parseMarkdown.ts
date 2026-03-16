// src/lib/parseMarkdown.ts
// Robust parser for Wallets.md — no more fragile line indexing

export function parseMarkdown(md: string) {
  // Clean the markdown exactly like parseProcessorMarkdown.ts does
  const cleanedMd = md
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  const items = cleanedMd.split('---').map((section: string) => {
    const lines = section.trim().split('\n');

    let title = '';
    let url = '';
    let imageUrl = '';
    let syncSpeed = '';
    const devices: string[] = [];
    const pools: string[] = [];
    const features: string[] = [];

    lines.forEach(line => {
      // Title & URL
      if (line.startsWith('## [')) {
        const match = line.match(/^## \[(.*?)\]\((.*?)\)/);
        if (match) {
          title = match[1];
          url = match[2];
        }
      }
      // Logo image
      else if (line.includes('![logo]')) {
        const match = line.match(/!\[logo\]\((.*?) /);
        if (match) imageUrl = match[1];
      }
      // Devices
      else if (line.startsWith('- Devices:')) {
        const value = line.split(': ')[1];
        if (value) devices.push(...value.split(' | ').map(s => s.trim()));
      }
      // Pools
      else if (line.startsWith('- Pools:')) {
        const value = line.split(': ')[1];
        if (value) pools.push(...value.split(' | ').map(s => s.trim()));
      }
      // Features
      else if (line.startsWith('- Features:')) {
        const value = line.split(': ')[1];
        if (value) features.push(...value.split(' | ').map(s => s.trim()));
      }
      // Sync speed image (optional)
      else if (line.includes('![syncspeed]')) {
        const match = line.match(/!\[syncspeed\]\((.*?) /);
        if (match) syncSpeed = match[1];
      }
    });

    return {
      title,
      url,
      imageUrl,
      devices,
      pools,
      features,
      syncSpeed,
    };
  });

  return items.filter(item => item.title); // remove any empty sections
}
