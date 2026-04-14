"use client";
import { MDXRemote } from "next-mdx-remote";
import MdxComponents from "./MdxComponents/MdxComponent";

export default function MdxRenderer({ source }: { source: any }) {
  return <MDXRemote {...source} components={MdxComponents} />;
}
