import { redirect } from 'next/navigation'
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';

export const metadata: Metadata = genMetadata({
    title: "Mobile walets",
    url: "https://zechub.wiki/mobile-wallets"
})

export default async function Page() {
    redirect('/wallets')
}