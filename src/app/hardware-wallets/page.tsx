import { redirect } from 'next/navigation'
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';

export const metadata: Metadata = genMetadata({
    title: "Hardware walets",
    url: "https://zechub.wiki/hardware-wallets"
})

export default async function Page() {
    redirect('/wallets')
}