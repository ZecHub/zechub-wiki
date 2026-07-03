// src/lib/parseMarkdown.ts
export function parseProcessorMarkdown(md: string) {
  // First remove any empty lines and trim each line
  const cleanedMd = md
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  const items = cleanedMd.split("---").map((section: string) => {
    const lines = section.trim().split("\n");
    
    // Parse title (either ## [Name](URL) or ## Name format)
    let name = "";
    let url = "";
    const titleLine = lines[0] || "";
    
    // Check for ## [Name](URL) format
    const linkedTitleMatch = titleLine.match(/^## \[(.*?)\]\((.*?)\)/);
    if (linkedTitleMatch) {
      name = linkedTitleMatch[1];
      url = linkedTitleMatch[2];
    } 
    // Check for ## Name format
    else {
      const plainTitleMatch = titleLine.match(/^## (.*)/);
      if (plainTitleMatch) {
        name = plainTitleMatch[1];
      }
    }

    // Parse other fields by POSITION with a generic bold label, so translated
    // field labels (e.g. "Tipo di supporto"/"Descrizione") still parse — the
    // parser must not depend on English label text.
    const supportTypeMatch = lines[1]?.match(/- \*\*[^*]+\*\*:\s*(.*)/);
    const descriptionMatch = lines[2]?.match(/- \*\*[^*]+\*\*:\s*(.*)/);

    // Get URL from URL line if not already set from title
    const urlLineMatch = lines[3]?.match(/- \*\*[^*]+\*\*:\s*\[.*?\]\((.*?)\)/);
    if (!url && urlLineMatch) {
      url = urlLineMatch[1];
    }
    
    // Parse logo/image URL
    const logoMatch = lines[4]?.match(/<img src="(.*?)"/);

    return {
      name: name,
      supportType: supportTypeMatch ? supportTypeMatch[1].trim() : "",
      description: descriptionMatch ? descriptionMatch[1].trim() : "",
      url: url,
      logoUrl: logoMatch ? logoMatch[1] : "",
    };
  });

  return items.filter((item) => item.name);
}