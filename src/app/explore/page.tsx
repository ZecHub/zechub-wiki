import { exploreFolders } from "@/constants/exploreFolders";
import Explorer from "@/components/explorer/Explorer";
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';

export const metadata: Metadata = genMetadata({
  title: "Explore Zcash",
  url: "https://zechub.wiki/explore"
})



const Explore = async () => {

  return (
    <main className="">
      <Explorer />
    </main>
  )
}

export default Explore;