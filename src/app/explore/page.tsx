import { exploreFolders } from "@/constants/exploreFolders";
import Explorer from "@/components/explorer/Explorer";
import  Metadata from 'next';


interface Metadata {
  title: string;
  description: string;
  icons?: string; 
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export const metadata: Metadata = {
  title: 'Explore Zcash',
  description: 'Exploring Zcash',
  ogTitle: 'Explore Zcash',
  ogDescription: 'Exploring Zcash',
  ogImage: 'public/Start-02.png',
};

const Explore = async () => {

    return (
        <main className="">
           <Explorer  />
        </main>
    )
}

export default Explore;