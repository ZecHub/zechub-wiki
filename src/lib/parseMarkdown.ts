
export function parseMarkdown(md: string) {
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
    let nu7 = '';

    // Deprecated wallets are listed separately.
    // Stage (e.g. Beta) is shown as a badge.
    let status = '';
    let statusReason = '';
    let stage = '';

    const devices: string[] = [];
    const pools: string[] = [];
    const features: string[] = [];
    const operatingSystem: string[] = [];
    const walletSupport: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('## [')) {
        const match = line.match(/^## \[(.*?)\]\((.*?)\)/);
        if (match) {
          title = match[1];
          url = match[2];
        }
      }
      else if (line.includes('![logo]')) {
        const match = line.match(/!\[logo\]\((.*?) /);
        if (match) imageUrl = match[1];
      }
      else if (line.startsWith('- Devices:')) {
        const value = line.split(': ')[1];
        if (value) devices.push(...value.split(' | ').map(s => s.trim()));
      }
      else if (line.startsWith('- Operating System:')) {
        const value = line.split(': ')[1];
        if (value) operatingSystem.push(...value.split(' | ').map(s => s.trim()));
      }
      else if (line.startsWith('- Pools:')) {
        const value = line.split(': ')[1];
        if (value) pools.push(...value.split(' | ').map(s => s.trim()));
      }
      else if (line.startsWith('- Wallet Support:')) {
        const value = line.split(': ')[1];
        if (value) walletSupport.push(...value.split(' | ').map(s => s.trim()));
      }
      else if (line.startsWith('- Features:')) {
        const value = line.split(': ')[1];
        if (value) features.push(...value.split(' | ').map(s => s.trim()));
      }
      else if (line.startsWith('- NU7:')) {
        const value = line.split(': ')[1];
        if (value) nu7 = value.trim();
      }
      else if (line.startsWith('- Status:')) {
        const at = line.indexOf(': ');
        if (at > -1) {
          const [value, ...reason] = line.slice(at + 2).split(' | ');
          status = value.trim();
          statusReason = reason.join(' | ').trim();
        }
      }
      else if (line.startsWith('- Stage:')) {
        const value = line.split(': ')[1];
        if (value) stage = value.trim();
      }
      else if (line.includes('![syncspeed]')) {
        const match = line.match(/!\[syncspeed\]\((.*?) /);
        if (match) syncSpeed = match[1];
      }
    });

    return {
      title,
      url,
      imageUrl,
      devices: [...new Set(devices)],
      pools: [...new Set(pools)],
      features: [...new Set(features)],
      operatingSystem: [...new Set(operatingSystem)],
      walletSupport: [...new Set(walletSupport)],
      syncSpeed,
      nu7,
      status,
      statusReason,
      stage,
    };
  });

  return items.filter(item => item.title);
}
