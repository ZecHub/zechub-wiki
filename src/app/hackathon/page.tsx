import Hackathon from "@/components/Hackathon/Hackathon";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import { getDictionary } from '@/lib/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dict = (await getDictionary()) as {
    pages?: {
      hackathon?: {
        title?: string;
      };
    };
  };
  return genMetadata({
    title: dict.pages?.hackathon?.title || "Hackathon | ZecHub",
    url: "https://zechub.wiki/hackathon",
  }) as Metadata;
}

export default function page() {
  return <Hackathon />;
}