import React from "react";
import DonationComp from "@/components/Donation/Donation";
import { Metadata } from "next";
import { title } from "process";
import { genMetadata } from "@/lib/helpers";
import ZcashUAZArt from '../../components/ZcashUAZArt';

export const metadata: Metadata = genMetadata({
  title: "Donate now | Zechub",
  url: "https://zechub.wiki/donation",
});

const Donation = () => {
  return (
    <main>
      <ZcashUAZArt />
    </main>
  );
};

export default Donation;
