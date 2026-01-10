import { contentBanners } from '@/constants/contentBanners';
import { getRootCached } from './authAndFetch';

type MetadataOpts = {
  title?: string,
  description?: string,
  image?: string,
  url?: string
}

export const genMetadata = ({ title, description, image, url }: MetadataOpts) => {
  const defaultImage = '/previews/default-banner.jpg';
  const defaultUrl = 'https://zechub.wiki';
  const defaultTitle = 'ZecHub Wiki';
  const defaultDescription = 'The goal of ZecHub is to provide an educational platform where community members can work together on creating, validating, and promoting content that supports the Zcash & Privacy technology ecosystems.'

  return {
    metadataBase: new URL("https://zechub.wiki"),
    title: title || defaultTitle,
    description: description || defaultDescription,
    openGraph: {
      title: title,
      description: description || defaultDescription,
      images: image || defaultImage,
      siteName: "ZecHub Wiki",
      type: "website",
      url: url || defaultUrl
    },
    twitter: {
      title: title || defaultTitle,
      card: "summary_large_image",
      description: description || defaultDescription,
      image: image || defaultImage,
      url: url || defaultUrl
    }
  };
};

export const getName = (item: string) => {
  const newItem = transformUri(item.substring(item.lastIndexOf('/') + 1), true);
  const newFolder = newItem.split('_').join(' ');
  if (newFolder === 'Glossary And FAQs') {
    return `Glossary & FAQ's`;
  } else {
    return newFolder;
  }
};

export const getDynamicRoute = (slug: string): string => {
  let uri = '';
  for (let i = 0; i < slug.length; i++) {
    uri += '/' + slug[i];
  }
  return  uri === '/contribute/community-infrastructure' ? `/site/contribute/Community_Infrastructure.md` : `/site${transformUri(uri)}.md`;
};

export const getFiles = (data: any) => {
  return data.filter((e: any) => e.path).map((element: any) => element.path);
};

export const getFolders = (folder: string[]) => {
  return folder.filter((st: string) => !st.endsWith('.md'));
};

export const firstFileForFolders = async (folders: string[]) => {
  let files: string[] = [''];
  for (let i = 0; i <= folders.length; i++) {
    const res = await getRootCached(folders[i]);
    files.push(res[0]);
  }
  return files;
};

export const getBanner = (name: string) => {
  const transformedName = transformUri(name);
  const banner = contentBanners.find(banner => banner.name === transformedName);
  return banner ? banner.url : '';
};

const uppercaseWords = [
  'Zec',
  'Dex',
  'Nft',
  'Zcap',
  'Zfav',
  'Snarks',
  'Frost',
  '2fa',
  'Pgp',
  'I2p',
  'Dao',
];
const lowercaseWords = [
  'Guides',
  'Tutorials',
  'Contribute',
  'In',
  'The',
  'Vs',
  'And',
  'Is',
  'Zk',
];
const specialWordsMap = {
  Non_Custodial: 'Non-Custodial',
  Zero_Knowledge: 'Zero-Knowledge',
  Defi: 'DeFi',
  'Glossary And FAQs': `Glossary & FAQ's`,
  Z2z: 'z2z',
  Faq: 'FAQ',
  ZECHub: 'ZecHub',
  ZEChub: 'ZecHub',
  Av_Club: 'AV_Club',
  guides_For_Creators: 'Guides_for_Creators',
  Grapheneos: 'GrapheneOS',
  Vpn: 'VPN',
  Dvpn: 'DVPN',
  zk_Shielded: 'ZK_Shielded',
  ZECweekly: 'ZecWeekly',
  ZECWeekly: 'ZecWeekly',
  Help_Build_ZecHub: 'Help_build_ZecHub',
  zkool_Multisig : 'Zkool_Multisig',
  Zenith_installation : 'Zenith_Installation',
  Raspberry_Pi5_Zebra_Lightwalletd_Zingo : "Raspberry_pi5_Zebra_Lightwalletd_Zingo",
  Btcpayserver_Zcash_Plugin : "BTCPayServer_Zcash_Plugin",
  Uris: 'URIs',
  Free2z_Livestreaming : "Free2Z_Livestreaming",
  Avalanche_Redbridge : "Avalanche_RedBridge",
  Raspberry_Pi_4_Full_Node : "Raspberry_Pi_4_Full_Node",
  Raspberry_Pi_4_Zebra_Node : "Raspberry_pi_4_Zebra_Node",
  Coinholder_Directed_Retroactive_Grants : "CoinHolder_Directed_Retroactive_Grants",
  zkav : 'ZKAV',
};

export const transformUri = (uri: string, ignoreLowerCase = false) => {
  let transformed = uri
    .replace(/\b\w/g, (l) => l.toUpperCase())  
    .replace(/-/g, '_');

  if (!ignoreLowerCase)
    lowercaseWords.forEach((word) => {
      if (transformed.includes(word))
        transformed = transformed.replace(word, word.toLowerCase());
    });
  uppercaseWords.forEach((word) => {
    if (transformed.includes(word))
      transformed = transformed.replace(word, word.toUpperCase());
  });
  Object.entries(specialWordsMap).forEach(([word, targetWord]) => {
    if (transformed.includes(word))
      transformed = transformed.replaceAll(word, targetWord);
  });
  return transformed;
};

export const transformGithubFilePathToWikiLink = (path: string) => {
  return path
    .replace('site/', '')
    .replace(/\w/g, (l) => l.toLowerCase())
    .replace(/_/g, '-');
};

export const formatString = {
  titleCase: (txt: string) => {
    return txt[0].toUpperCase() + txt.slice(1);
  },
  removeUnderscore: (str: string) => {
    return str.split('_').join(' ');
  },
  /**
   * The function wrap a sentence at particular length of characters
   * @param txt The sentence body
   * @param wrapAfter The number of characters to start
   * @returns The wrapped sentence
   */
  wordWrap: (txt: string, wrapAfter: number) => {
    txt = txt.trim();
    if (txt.length > wrapAfter) {
      return txt.slice(0, wrapAfter) + '...';
    }

    return txt;
  },
};

// Function to format number with commas
export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(n);
