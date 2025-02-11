import dynamic from "next/dynamic";
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';

export const metadata: Metadata = genMetadata({
  title: "Explore Zcash",
  url: "https://zechub.wiki/explore"
})

const Explorer = dynamic(() => import("@/components/Explorer/Explorer"))


const Explore = async () => {

  return (
    <main className="">
      <Explorer />
    </main>
  )
}

export default Explore;