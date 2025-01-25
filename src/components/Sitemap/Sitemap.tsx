"use client";
import SiteLinks from "../SiteLinks/SiteLinks";
import "./sitemap.css";

const SitemapComp = () => {
  return (
    <div className="zcash-projects-container">
      <div className="text-center">
        <h1 className="dark:text-slate-100 text-slate-800">Sitemap</h1>
        {/* <p className="dark:text-slate-400 text-slate-800 text-lg">
          Listed below are all wiki docs on the Wiki Site!
        </p> */}
      </div>
      <SiteLinks />
    </div>
  );
};

export default SitemapComp;
