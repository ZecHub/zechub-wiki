import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import DonationClientWrapper from "@/components/DonationClientWrapper";

export const metadata: Metadata = genMetadata({
  title: "Donate now | Zechub",
  url: "https://zechub.wiki/donation",
});

const Donation = () => {
  return (
    <main>
      <DonationClientWrapper />
    </main>
  );
};

export default Donation;