"use client";
import { useEffect } from "react";
import { MDXRemote } from "next-mdx-remote";
import MdxComponents from "./MdxComponents/MdxComponent";

export default function MdxRenderer({ source }: { source: any }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("zechub:mdx-ready"));
  }, [source]);

  return <MDXRemote {...source} components={MdxComponents} />;
}
