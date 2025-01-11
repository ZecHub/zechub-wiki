import { redirect } from 'next/navigation'
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';

export const metadata: Metadata = genMetadata({
    title: "Web wallets",
    url: "https://zechub.wiki/web-wallets"
})

export default async function Page() {
    redirect('/wallets')
}