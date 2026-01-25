import HomePage from "@/components/Home/Home"

// Define Metadata interface locally
interface Metadata {
  title: string;
  description: string;
  icons?: string; 
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

// Define metadata object
export const metadata: Metadata = {
  title: 'Welcome to ZecHub',
  description: 'An open source education hub for Zcash',
  ogTitle: 'Welcome to ZecHub',
  ogDescription: 'An open source education hub for Zcash',
  ogImage: 'public/BannerPrancheta.png',
};

export default function Home() {
  const text = `ZecHub is the community-driven education hub for the Zcash cryptocurrency (ZEC). Zcash is a digital currency providing censorship resistant, secure & private payments. The Zcash Blockchain utilises highly advanced 'verifiable' zk-snarks that do not require Trusted Setup following the NU5 network upgrade in 2022.`;

  return <HomePage text={text} />;
}
