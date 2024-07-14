import React from 'react'
import DonationComp from "@/components/Donation/Donation"
import { Metadata } from 'next';
import { title } from 'process';
import { genMetadata } from '@/lib/helpers';

export const metadata: Metadata = genMetadata({
    title: "Donate now",
    url: "https://zechub.wiki/donation"
})


const Donation = () => {
    return (
        <main>
            <DonationComp />
        </main>
    )
}

export default Donation;