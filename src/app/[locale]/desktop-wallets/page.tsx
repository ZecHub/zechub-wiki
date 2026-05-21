import { redirect } from 'next/navigation'
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';

export const metadata: Metadata = genMetadata({
    title: "Desktop wallets",
    url: "https://zechub.wiki/desktop-wallets"
})

export default async function Page() {
    redirect('/wallets')
}