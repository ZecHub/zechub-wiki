import React from 'react'
import DonationComp from "@/components/Donation/Donation"
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
  title: 'Donation',
  description: 'The goal of ZecHub is to provide an educational platform where community members can work together on creating, validating, and promoting content that supports the Zcash & Privacy technology ecosystems.',
  ogTitle: 'Donate now',
  ogDescription: 'The goal of ZecHub is to provide an educational platform where community members can work together on creating, validating, and promoting content that supports the Zcash & Privacy technology ecosystems.',
  ogImage: 'public/donate.gif',
};

const Donation = () => {
    return (
        <main>
            <DonationComp />
        </main>
    )
}

export default Donation;