import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { getRootCached } from "@/lib/authAndFetch";
import { getBanner, genMetadata } from "@/lib/helpers";
import SideMenu from "@/components/SideMenu/SideMenu";
import ListTutorial from "./ListTutorial";

export const metadata: Metadata = genMetadata({
  title: "Zechub Tutorial",
  url: "https://zechub.wiki/tutorials",
});

const ZechubTutorial = async () => {
  const slug = "tutorials";
  const urlRoot = `/site/tutorials`;
  const roots = await getRootCached(urlRoot);
  const imgUrl = getBanner(slug);
  
  return (
    <main>
      <div className="flex justify-center w-full  mb-5 bg-transparent rounded pb-4">
        <Image
          className="w-full mb-5 object-cover "
          alt="wiki-banner"
          width={800}
          height={50}
          src={imgUrl != undefined ? imgUrl : "/wiki-banner.avif"}
        />
      </div>

      <div
        id="content"
        className={`flex flex-col space-y-5 ${
          roots && roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"
        } h-auto w-full p-5`}
      >
        {roots && roots.length > 0 && (
          <div className="relative">
            <ListTutorial folder={slug} roots={roots} />
          </div>
        )}
      </div>
    </main>
  );
};

export default ZechubTutorial;
