'use client';
import { MDXRemote } from 'next-mdx-remote'; // ← client version, not /rsc
import MdxComponents from './MdxComponents/MdxComponent';

export default function MdxRenderer({ source }: { source: any }) {
  return <MDXRemote {...source} components={MdxComponents} />;
}
