// This function parses the markdown content into a structured format.
export function parseMarkdown(md: string) {
    const items = md.split("---").map((section: string) => {
      const lines = section.trim().split("\n");
      const titleMatch = lines[0]?.match(/## \[(.*?)\]\((.*?)\)/);
      const imageUrlMatch = lines[1]?.match(/!\[logo\]\((.*?) ".*?"\)/);
      const devices = lines[2]?.split(": ")[1]?.split(" | ").map(item => item.trim()) || [];
      const pools = lines[3]?.split(": ")[1]?.split(" | ").map(item => item.trim()) || [];
      const features = lines[4]?.split(": ")[1]?.split(" | ").map(item => item.trim()) || [];
      const syncSpeed = lines[5]?.match(/!\[syncspeed\]\((.*?) ".*?"\)/);
  
      return {
        title: titleMatch ? titleMatch[1] : '',
        url: titleMatch ? titleMatch[2] : '',
        imageUrl: imageUrlMatch ? imageUrlMatch[1] : '',
        devices,
        pools,
        features,
        syncSpeed : syncSpeed ?  syncSpeed[1] : '',
      };
    });
  
    return items.filter((item) => item.title); // Filter out any empty sections
  }
  
