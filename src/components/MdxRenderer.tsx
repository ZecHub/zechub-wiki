'use client';
import { MDXRemote } from 'next-mdx-remote'; // ← client version, not /rsc
import MdxComponents from './MdxComponents/MdxComponent';

export default function MdxRenderer({ source, slug }: { source: any; slug?: string }) {
  return <MDXRemote {...source} components={MdxComponents} />;
}