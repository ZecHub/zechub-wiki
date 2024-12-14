import React from "react";
import ZcashProjectsComp from "@/components/ZcashProjects/ZcashProjects";
import { Metadata } from "next";
import { title } from "process";
import { genMetadata } from "@/lib/helpers";

export const metadata: Metadata = genMetadata({
  title: "Zcash Projects | ZecHub",
  url: "https://zechub.wiki/zcash-projects",
});

const ZcashProject = () => {
  return (
    <main>
      <ZcashProjectsComp />
    </main>
  );
};

export default ZcashProject;
