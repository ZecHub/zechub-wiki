export type CommunityProject = {
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnailImage?: string;
  features?: string[];
};

/**
 * Parses the structured Community_Projects.md into a clean array.
 *
 * Expected format:
 * ## Category
 * ### Project Title
 * Description text...
 * [Visit](https://...)   or [Forum](...) / [Paper](...)
 */
export function parseCommunityProjects(md: string): CommunityProject[] {
  const projects: CommunityProject[] = [];

  // Normalize line endings and remove the top-level H1 if present
  const content = md
    .replace(/\r\n/g, "\n")
    .replace(/^#\s+Community Projects[\s\S]*?(?=^## )/m, "")
    .trim();

  // Split into category blocks
  const categoryBlocks = content.split(/^## /m).filter(Boolean);

  for (const block of categoryBlocks) {
    const lines = block.trim().split("\n");
    const category = lines[0].trim();

    // Everything after the category heading
    const rest = lines.slice(1).join("\n").trim();

    // Split into project blocks on ### headings
    const projectBlocks = rest.split(/^### /m).filter(Boolean);

    for (const projectBlock of projectBlocks) {
      const projectLines = projectBlock.trim().split("\n");
      const title = projectLines[0].trim();

      // Find the first Visit / Forum / Paper link
      let url = "";
      let descriptionLines: string[] = [];

      for (const line of projectLines.slice(1)) {
        const linkMatch = line.match(
          /\[(?:Visit|Forum|Paper)\]\((https?:\/\/[^)]+)\)/i
        );
        if (linkMatch) {
          url = linkMatch[1];
          break;
        }
        // Collect description lines until we hit the link
        if (line.trim()) {
          descriptionLines.push(line.trim());
        }
      }

      if (!title || !url) continue;

      projects.push({
        title,
        description: descriptionLines.join(" ").replace(/\s+/g, " ").trim(),
        url,
        category,
        // thumbnailImage is filled later by the image map
      });
    }
  }

  return projects;
}