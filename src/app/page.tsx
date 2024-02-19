import { getBannerMessage } from './actions';
import HomePage from "@/components/home/Home";

export default async function Home() {
  // const bannerMsg = await getBannerMessage();

  const text = `ZecHub is the community driven education hub for the Zcash cryptocurrency (ZEC). Zcash is a digital currency providing censorship resistant, secure & private payments. The Zcash Blockchain utilises highly advanced 'verifiable' zk-snarks that do not require Trusted Setup following the NU5 network upgrade in 2022.`;

  return <HomePage text={text} />;
}
