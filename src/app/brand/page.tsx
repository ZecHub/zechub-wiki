import React from "react";
import BrandComp from "@/components/Brand/Brand";
import { Metadata } from "next";
import { title } from "process";
import { genMetadata } from "@/lib/helpers";

export const metadata: Metadata = genMetadata({
  title: "Brand | ZecHub",
  url: "https://zechub.wiki/brand",
});

const ZcashProject = () => {
  return (
    <main>
      <BrandComp />
    </main>
  );
};

export default ZcashProject;
