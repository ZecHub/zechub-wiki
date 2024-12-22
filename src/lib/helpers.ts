import { contentBanners } from '@/constants/contentBanners';
import { getRoot } from './authAndFetch';
import matter from 'gray-matter'; // To parse front matter in markdown

type MetadataOpts = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

// Function to fetch markdown file content from a repository (e.g., GitHub)
const fetchMarkdownFile = async (slug: string) => {
  const response = await fetch(`https://api.github.com/repos/{owner}/{repo}/contents/{path}/${slug}.md`);
  const data = await response.json();

  if (data.content) {
    const content = atob(data.content); // Decode base64 content
    return content;
  }

  throw new Error('Failed to fetch markdown file');
};

// Function to parse metadata from markdown file using gray-matter
const parseMarkdownMetadata = (content: string) => {
  const { data, content: bodyContent } = matter(content);

  return {
    title: data.title || 'Default Title',
    description: data.description || 'Default Description',
    image: data.image || '/previews/default-banner.jpg',
    bodyContent, // You can use this to render the markdown content
  };
};

// Modified genMetadata to fetch and generate metadata dynamically from markdown files
export const generateMetadataForMarkdown = async (slug: string) => {
  try {
    // Fetch and parse markdown content from the repository
    const content = await fetchMarkdownFile(slug);
    const { title, description, image } = parseMarkdownMetadata(content);

    // Generate metadata based on the parsed content
    return genMetadata({
      title,
      description,
      image,
      url: window.location.href, // URL can be dynamic depending on your routing
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return genMetadata({}); // Fallback to default metadata
  }
};

// Existing genMetadata function
export const genMetadata = ({ title, description, image, url }: MetadataOpts) => {
  const defaultImage = '/previews/default-banner.jpg';
  const defaultUrl = 'https://zechub.wiki';
  const defaultTitle = 'ZecHub Wiki';
  const defaultDescription =
    'The goal of ZecHub is to provide an educational platform where community members can work together on creating, validating, and promoting content that supports the Zcash & Privacy technology ecosystems.';

  return {
    metadataBase: new URL('https://zechub.wiki'),
    title: title || defaultTitle,
    description: description || defaultDescription,
    openGraph: {
      title: title,
      description: description || defaultDescription,
      images: image || defaultImage,
      siteName: 'ZecHub Wiki',
      type: 'website',
      url: url || defaultUrl,
    },
    twitter: {
      title: title || defaultTitle,
      card: 'summary_large_image',
      description: description || defaultDescription,
      image: image || defaultImage,
      url: url || defaultUrl,
    },
  };
};

// Existing helper functions (like transformUri, getDynamicRoute, etc.)

export const getDynamicRoute = (slug: string): string => {
  let uri = '';
  for (let i = 0; i < slug.length; i++) {
    uri += '/' + slug[i];
  }
  return uri === '/contribute/community-infrastructure'
    ? `/site/contribute/Community_Infrastructure.md`
    : `/site${transformUri(uri)}.md`;
};

// You can use this inside your page or dynamic route rendering
export const generateMetadataForDynamicPage = async (slug: string) => {
  const metadata = await generateMetadataForMarkdown(slug);

  // Example of injecting metadata into the head dynamically
  return metadata;
};

// Example of how this could work in a component/page (for frameworks like Next.js):
export const PageComponent = ({ slug }) => {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const metadata = await generateMetadataForMarkdown(slug);
      setMetadata(metadata);
    };
    fetchData();
  }, [slug]);

  if (!metadata) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Dynamically inject metadata into the head (SEO) */}
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.image} />
        <meta name="twitter:url" content={metadata.twitter.url} />
      </Head>

      {/* Render markdown content */}
      <div>{/* Content from the markdown file */}</div>
    </div>
  );
};
