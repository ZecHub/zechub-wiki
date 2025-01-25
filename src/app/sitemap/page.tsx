import React from "react";
import SitemapComp from "@/components/Sitemap/Sitemap";
import { Metadata } from "next";
import { title } from "process";
import { genMetadata } from "@/lib/helpers";

export const metadata: Metadata = genMetadata({
  title: "Sitemap | ZecHub",
  url: "https://zechub.wiki/sitemap",
});

const ZcashProject = () => {
  return (
    <main>
      <SitemapComp />
    </main>
  );
};

export default ZcashProject;
