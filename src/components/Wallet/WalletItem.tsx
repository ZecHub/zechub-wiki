import Image from "next/image";
import WalletLogo from "./WalletLogo";
import { Link } from "@/i18n/navigation";
import React, { useMemo, useState } from "react";
import {
  MdThumbDown as Dislike,
  MdThumbUp as Like,
  MdOpenInNew as OpenNew,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { Icon } from "../UI/Icon";

interface WalletItemProps {
  title: string;
  link: string;
  logo: string;
  tags: Tag[];
  likes: number;
  syncSpeed: string;
  ironwood?: string;
  onLike: () => void;
  onDislike: () => void;
  error: string;
  success: string;
}

interface Tag {
  category: string;
  values: string[] | FeatureLink[];
}

interface FeatureLink {
  name: string;
  url: string;
}

// NU6.3 "Ironwood" upgrade status → badge colors (status text comes from Wallets.md)
const ironwoodBadgeStyles: { [key: string]: { pill: string; dot: string } } = {
  "ready": {
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  "in progress": {
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  "not ready": {
    pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

const ironwoodFallbackStyle = {
  pill: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  dot: "bg-slate-500",
};

const sectionLabel = "text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400";
const chip =
  "rounded-full bg-slate-200 px-2.5 py-0.5 text-[13px] text-slate-700 dark:bg-white/10 dark:text-slate-200";

// Short descriptors that the wallet list in the content repo does not carry yet.
// Logos that replace the image coming from the wallet list in the content repo.
const walletLogoOverrides: { [key: string]: string } = {
  zallet: "/dex-logos/zebra-icon.png", // Zcash Foundation zebra
};

const walletNotes: { [key: string]: string } = {
  dizzy: "Discord wallet",
};

const featureLinkMap: { [key: string]: string } = {
  "Orchard": "https://zechub.wiki/using-zcash/shielded-pools#orchard",
  "Sapling": "https://zechub.wiki/using-zcash/shielded-pools#sapling",
  "Transparent": "https://zechub.wiki/using-zcash/shielded-pools#transparent",
  "Shielded": "https://zechub.wiki/using-zcash/shielded-pools",
  "Mobile": "https://zechub.wiki/using-zcash/mobile-wallets",
  "Desktop": "https://zechub.wiki/using-zcash/desktop-wallets",
  "Web": "https://zechub.wiki/using-zcash/web-wallets",
};

const WalletItem: React.FC<WalletItemProps> = ({
  title,
  link,
  logo,
  tags,
  syncSpeed,
  ironwood,
  likes,
  onLike,
  onDislike,
  error,
  success,
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const note = walletNotes[title.toLowerCase().replace(/[^a-z0-9]/g, "")];

  const handleLike = () => {
    onLike();
    setLiked(true);
    setDisliked(false);
  };

  const handleDislike = () => {
    onDislike();
    setDisliked(true);
    setLiked(false);
  };

  const getFeatureLink = (value: string): string => {
    return featureLinkMap[value] || "https://zechub.wiki/using-zcash/shielded-pools";
  };

  const isFeatureLink = (value: any): value is FeatureLink => {
    return typeof value === 'object' && 'name' in value && 'url' in value;
  };

  const featureValues = useMemo(() => {
    const values = tags.find((t) => t.category === "Features")?.values ?? [];
    return values.map((v) => (typeof v === "string" ? v : v.name));
  }, [tags]);

  const hasTransparent = useMemo(
    () => featureValues.some((v) => v.toLowerCase() === "transparent"),
    [featureValues],
  );
  const hasShielded = useMemo(
    () => featureValues.some((v) => v.toLowerCase() === "shielded"),
    [featureValues],
  );

  const allFeatures = tags.find((t) => t.category === "Features")?.values ?? [];
  const collapsedFeatures: (string | FeatureLink)[] =
    hasShielded || hasTransparent
      ? [...(hasShielded ? ["Shielded"] : []), ...(hasTransparent ? ["Transparent"] : [])]
      : allFeatures.slice(0, 3);

  return (
    <div className="wallet-item flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40">
      <div className="flex flex-1 flex-col p-4">
        {/* Logo top-left, Open button top-right */}
        <div className="flex min-h-16 items-center justify-between gap-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} (opens in a new tab)`}
            className="flex min-w-0 items-center"
          >
            <WalletLogo src={walletLogoOverrides[title.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? logo} alt={`${title} Logo`} />
          </a>
          <Link
            href={link}
            className="inline-flex shrink-0 items-center self-start whitespace-nowrap rounded-lg border border-brand/50 px-3.5 py-1.5 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open
            <Icon icon={OpenNew} className="ms-2 inline-block" size="small" />
          </Link>
        </div>

        {/* Name */}
        <div className="mt-4 min-w-0">
          <h2 className="m-0 text-lg font-semibold leading-tight text-slate-900 dark:text-white">
            {title}
            {syncSpeed && (
              <span className="ml-2 inline-block align-middle">
                <Image src={syncSpeed} width={24} height={24} alt="Sync" />
              </span>
            )}
          </h2>
          {note ? (
            <p className="m-0 mt-1 text-[13px] font-medium text-brand dark:text-brand-soft">{note}</p>
          ) : null}
        </div>

        {/* NU6.3 "Ironwood" readiness badge */}
        {ironwood && (
          <div className="mt-3">
            <span
              title="NU6.3 Ironwood network upgrade status"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                (ironwoodBadgeStyles[ironwood.toLowerCase()] ?? ironwoodFallbackStyle).pill
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  (ironwoodBadgeStyles[ironwood.toLowerCase()] ?? ironwoodFallbackStyle).dot
                }`}
              />
              Ironwood {ironwood}
            </span>
          </div>
        )}

        {/* Labelled sections: Devices, Pools, Features */}
        <div className="mt-4 divide-y divide-slate-200 border-t border-slate-200 dark:divide-white/10 dark:border-white/10">
          {tags
            .filter((t) => ["Devices", "Pools"].includes(t.category) && t.values.length > 0)
            .map((tag) => (
              <div key={tag.category} className="py-3">
                <div className={sectionLabel}>{tag.category}</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tag.values.map((value, vIndex) => (
                    <span key={vIndex} className={chip}>
                      {typeof value === "string" ? value : (value as FeatureLink).name}
                    </span>
                  ))}
                </div>
              </div>
            ))}

          {tags.some((t) => t.category === "Features" && t.values.length > 0) && (
            <div className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className={sectionLabel}>Features</div>
                <button
                  type="button"
                  onClick={() => setFeaturesOpen((v) => !v)}
                  className="inline-flex cursor-pointer items-center gap-1 text-[13px] font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  aria-expanded={featuresOpen}
                  aria-controls={`${title}-features`}
                >
                  <span>{featuresOpen ? "Hide" : "Show all"}</span>
                  <Icon
                    icon={MdKeyboardArrowDown}
                    className={`transition ${featuresOpen ? "rotate-180" : ""}`}
                    size="small"
                  />
                </button>
              </div>
              <div id={`${title}-features`} className="mt-1.5 flex flex-wrap gap-1.5">
                {(featuresOpen
                  ? (tags.find((t) => t.category === "Features")?.values ?? [])
                  : collapsedFeatures
                ).map((value, index) => {
                  const displayValue = typeof value === "string" ? value : (value as FeatureLink).name;
                  const linkUrl = typeof value === "string" ? getFeatureLink(value) : (value as FeatureLink).url;
                  return (
                    <Link
                      key={index}
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${chip} no-underline transition hover:bg-slate-300 dark:hover:bg-slate-600`}
                    >
                      {displayValue}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating pinned at bottom */}
      <div className="mt-auto flex items-center border-t border-slate-200 px-4 py-3 dark:border-white/10">
        <div className="flex-grow text-sm text-gray-400">Rating: {likes}</div>
        <div className="text-pink-700 dark:text-red-300 text-xs pr-2">{error}</div>
        <div className="text-green-700 dark:text-green-300 text-xs pr-2">{success}</div>
        <div className="flex gap-4">
          <button onClick={handleLike} className={`cursor-pointer text-gray-600 hover:text-blue-500 ${liked ? "text-blue-500" : ""}`}>
            <Icon icon={Like} size="small" />
          </button>
          <button onClick={handleDislike} className={`cursor-pointer text-gray-600 hover:text-red-500 ${disliked ? "text-red-500" : ""}`}>
            <Icon icon={Dislike} size="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletItem;
