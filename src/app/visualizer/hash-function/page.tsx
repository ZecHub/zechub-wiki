import { HashFunctionVisualizer } from "@/components/visualizer/hash-function-visualizer";
import { genMetadata } from '@/lib/helpers';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
    const dict = (await getDictionary()) as {
        pages?: {
            visualizer?: {
                hashFunction?: {
                    title?: string;
                };
            };
        };
    };

    return genMetadata({
        title: dict.pages?.visualizer?.hashFunction?.title || 'Hash Function Visualizer',
        url: 'https://zechub.wiki/visualizer/hash-function',
    }) as Metadata;
}

export default function HashFunctionContent(){
        return <HashFunctionVisualizer/>
}
