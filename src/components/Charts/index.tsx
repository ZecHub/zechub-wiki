"use client";

import { Button } from "@/components/UI/shadcn/button";
import {
  BarChart3,
  FileText,
  Shield,
  Award,
  Youtube,
  Play,
  Eye,
  Landmark,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

import "./index.css";

import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import { useLanguage } from "@/context/LanguageContext";
import NamadaChart from "./Namada/NamadaChart";
import PenumbraChart from "./Penumbra/PenumbraChart";
import ZcashChart from "./Zcash/ZcashChart";

import { ProposalsList } from "@/components/Proposals";

import SheetTreasuryTab from "@/components/Charts/SheetTreasuryTab";

const ZCGDashboard = dynamic(() => import("@/app/zips-grants/page"), {
  ssr: false,
});

type ViewType = "dashboard" | "proposals" | "zcg" | "youtube";
type SubViewType = "top" | "latest";
type ChannelType = "ZecHub" | "Zcash Foundation" | "Shielded Labs" | "Zcash Media";

type DashboardDictionary = {
  pages?: {
    dashboard?: {
      charts?: {
        headerTitle?: string;
        headerSubtitle?: string;
        shieldedNetworks?: string;
        currentYoutubeChannel?: string;
        totalVideos?: string;
        totalViews?: string;
        mostViewed?: string;
        viewsSuffix?: string;
        searchPlaceholder?: string;
        top15ByViews?: string;
        latest15Videos?: string;
        sortByNewest?: string;
        sortByViews?: string;
        top15VideosByViews?: string;
        latest15VideosSortedByViews?: string;
        tabs?: {
          zechubDashboard?: string;
          governanceDashboard?: string;
          treasuryDashboard?: string;
          zcgDashboard?: string;
          youtubeDashboard?: string;
        };
      };
    };
  };
};

const Dashboard = ({ dict }: { dict?: DashboardDictionary }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { t: languageDict } = useLanguage();
  const [selectedCrypto, setSelectedCrypto] = useState("zcash");
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [subView, setSubView] = useState<SubViewType>("top");
  const [latestSortByViews, setLatestSortByViews] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<ChannelType>("ZecHub");

  const allowedTabs: ViewType[] = ["dashboard", "proposals", "zcg", "youtube"];

  // Data for each channel
  const [zecSorted, setZecSorted] = useState<any[]>([]);
  const [zecDate, setZecDate] = useState<any[]>([]);
  const [slSorted, setSlSorted] = useState<any[]>([]);
  const [slDate, setSlDate] = useState<any[]>([]);
  const [zfSorted, setZfSorted] = useState<any[]>([]);
  const [zfDate, setZfDate] = useState<any[]>([]);
  const [zmSorted, setZmSorted] = useState<any[]>([]);
  const [zmDate, setZmDate] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const t =
    languageDict?.pages?.dashboard?.charts || dict?.pages?.dashboard?.charts;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Load all channel data
  useEffect(() => {
    if (currentView === "youtube") {
      // ZecHub
      fetch("/data/youtube/ZecHubSorted.json")
        .then((r) => r.json())
        .then(setZecSorted);
      fetch("/data/youtube/ZecHubByDate.json")
        .then((r) => r.json())
        .then(setZecDate);

      // Shielded Labs
      fetch("/data/youtube/SLSorted.json")
        .then((r) => r.json())
        .then(setSlSorted);
      fetch("/data/youtube/SLByDate.json")
        .then((r) => r.json())
        .then(setSlDate);

      // Zcash Foundation
      fetch("/data/youtube/ZFSorted.json")
        .then((r) => r.json())
        .then(setZfSorted);
      fetch("/data/youtube/ZFByDate.json")
        .then((r) => r.json())
        .then(setZfDate);
      // Zcash Media
      fetch("/data/youtube/ZMSorted.json")
        .then((r) => r.json())
        .then(setZmSorted);
      fetch("/data/youtube/ZMByDate.json")
        .then((r) => r.json())
        .then(setZmDate);
    }
  }, [currentView]);

  // Close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeView = (view: ViewType) => {
    setCurrentView(view);
    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("tab", view);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    if (view !== "youtube") {
      setSubView("top");
      setLatestSortByViews(false);
    }
  };

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (!tab) return;
    if (allowedTabs.includes(tab as ViewType)) {
      setCurrentView(tab as ViewType);
    }
  }, []);

  const tabs = [
    {
      key: "dashboard" as const,
      label: t?.tabs?.zechubDashboard || "ZecHub Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      key: "proposals" as const,
      label: t?.tabs?.governanceDashboard || "Governance Dashboard",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      key: "zcg" as const,
      label: t?.tabs?.zcgDashboard || "ZCG Dashboard",
      icon: <Award className="w-5 h-5" />,
    },
    {
      key: "youtube" as const,
      label: t?.tabs?.youtubeDashboard || "YouTube Dashboard",
      icon: <Youtube className="w-5 h-5" />,
    },
  ];

  // Select correct data for current channel
  const currentSorted =
  currentChannel === "ZecHub"
    ? zecSorted
    : currentChannel === "Shielded Labs"
      ? slSorted
      : currentChannel === "Zcash Media"
        ? zmSorted
        : zfSorted;

  const currentDate =
  currentChannel === "ZecHub"
    ? zecDate
    : currentChannel === "Shielded Labs"
      ? slDate
      : currentChannel === "Zcash Media"
        ? zmDate
        : zfDate;

  const filteredSorted = currentSorted.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredDate = currentDate.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayedVideos =
    subView === "top"
      ? filteredSorted.slice(0, 15)
      : latestSortByViews
        ? filteredDate.slice(0, 15).sort((a, b) => b.views - a.views)
        : filteredDate.slice(0, 15);

  const totalVideos = currentSorted.length;
  const totalViews = currentSorted.reduce((sum, v) => sum + (v.views || 0), 0);
  const mostViewed = currentSorted[0] || {};

  const formatViews = (views: number) => views.toLocaleString();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* HEADER */}
        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {t?.headerTitle || "Dashboard(s)"}
          </h1>
          <p className="text-muted-foreground">
            {t?.headerSubtitle || "Analyze Zcash network metrics and trends"}
          </p>
        </div>

        {/* MAIN TABS – mobile-friendly wrap */}
        <div className="grid grid-cols-1 imd:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 justify-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              className={`cursor-pointer px-6 py-2.5 md:px-9 md:py-3.5 rounded-3xl font-semibold flex items-center gap-2 transition-all text-sm md:text-base flex-1 md:flex-none min-w-[140px] md:min-w-0 justify-center bg-slate-100 dark:bg-slate-800 ${
                currentView === tab.key
                  ? "bg-purple-700 text-white shadow-lg dark:bg-purple-800 hover:bg-purple-700 hover:cursor-pointer"
                  : "text-slate-700 dark:text-slate-300 hover:bg-purple-700 dark:hover:bg-purple-800 hover:text-white"
              }`}
              onClick={() => changeView(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Shielded Networks – Top-right on desktop, below tabs on mobile */}
        <div
          className="flex justify-end md:absolute md:top-6 md:right-6 z-50"
          ref={dropdownRef}
        >
          <Button
            size="icon"
            className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white h-11 w-11 rounded-2xl shadow-lg"
            onClick={() => setOpen(!open)}
            title={t?.shieldedNetworks || "Shielded Networks"}
          >
            <Shield className="h-5 w-5" />
          </Button>
          {open && (
            <div className="absolute mt-2 right-0 bg-white shadow-lg rounded-lg dark:bg-slate-900 w-[160px] border border-slate-200 dark:border-slate-700">
              <ul className="w-[160px]">
                <li className="px-4 py-2 hover:bg-purple-300/50 dark:hover:bg-purple-500/50 rounded-md cursor-pointer w-[160px]">
                  <Link
                    href="https://namada.zechub.wiki"
                    className="block w-full h-full"
                    onClick={() => setOpen(false)}
                    target="_blank"
                  >
                    Namada
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* === YOUTUBE SECTION === */}
        {currentView === "youtube" && (
          <div className="space-y-8">
            {/* Channel Selector */}
            <div className="flex flex-col items-center">
              <p className="text-sm dark:text-muted-foreground mb-2">
                {t?.currentYoutubeChannel || "Current YouTube Channel"}
              </p>
              <div className="grid grid-cols-2 imd:inline-flex imd:bg-slate-100 imd:dark:bg-slate-800 rounded-3xl p-1 shadow-inner">
                {[
                  { name: "ZecHub", value: "ZecHub" as ChannelType },
                  {
                    name: "Zcash Foundation",
                    value: "Zcash Foundation" as ChannelType,
                  },
                  {
                    name: "Shielded Labs",
                    value: "Shielded Labs" as ChannelType,
                  },
                  {
                    name: "Zcash Media",
                    value: "Zcash Media" as ChannelType,
                  },
                ].map((ch) => (
                  <Button
                    key={ch.value}
                    variant="ghost"
                    className={`cursor-pointer px-6 py-2 md:px-8 md:py-3 rounded-3xl font-medium transition-all text-sm md:text-base hover:text-black dark:text-white  ${
                      currentChannel === ch.value
                        ? "bg-purple-700 shadow-sm hover:bg-purple-600 hover:text-white text-white"
                        : "hover:text-white hover:bg-purple-700"
                    }`}
                    onClick={() => setCurrentChannel(ch.value)}
                  >
                    {ch.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 text-center relative overflow-hidden flex flex-col items-center justify-center h-64 md:h-72">
                <Play className="absolute -bottom-12 -right-12 h-36 w-36 md:h-44 md:w-44 text-purple-200 dark:text-purple-950/30" />
                <p className="text-sm text-muted-foreground relative z-10">
                  {t?.totalVideos || "Total Videos"}
                </p>
                <p className="text-4xl md:text-5xl font-bold text-purple-600 mt-3 relative z-10">
                  {totalVideos}
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 text-center relative overflow-hidden flex flex-col items-center justify-center h-64 md:h-72">
                <Eye className="absolute -bottom-12 -right-12 h-36 w-36 md:h-44 md:w-44 text-purple-200 dark:text-purple-950/30" />
                <p className="text-sm text-muted-foreground relative z-10">
                  {t?.totalViews || "Total Views"}
                </p>
                <p className="text-4xl md:text-5xl font-bold text-purple-600 mt-3 relative z-10">
                  {formatViews(totalViews)}
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 overflow-hidden flex flex-col h-64 md:h-72">
                <p className="text-sm text-muted-foreground mb-3">
                  {t?.mostViewed || "Most Viewed"}
                </p>
                {mostViewed.video_id && (
                  <div className="flex-1 bg-black rounded-2xl overflow-hidden mb-3 relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${mostViewed.video_id}`}
                      title={mostViewed.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                )}
                <p className="text-base font-medium truncate">
                  {mostViewed.title || "—"}
                </p>
                <p className="text-purple-600 font-bold">
                  {formatViews(mostViewed.views || 0)}{" "}
                  {t?.viewsSuffix || "views"}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder={t?.searchPlaceholder || "Search videos..."}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 dark:bg-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* SUB-TABS */}
            <div className="flex justify-center">
              <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-3xl p-1 shadow-inner flex-wrap">
                <Button
                  variant="ghost"
                  className={`cursor-pointer px-6 py-2.5 md:px-8 md:py-3 rounded-3xl font-medium transition-all text-sm md:text-base ${subView === "top" ? "bg-purple-700 text-white shadow-sm" : "hover:bg-purple-100 dark:hover:bg-purple-950"}`}
                  onClick={() => {
                    setSubView("top");
                    setLatestSortByViews(false);
                  }}
                >
                  {t?.top15ByViews || "Top 15 by Views"}
                </Button>
                <Button
                  variant="ghost"
                  className={`cursor-pointer px-6 py-2.5 md:px-8 md:py-3 rounded-3xl font-medium transition-all text-sm md:text-base ${subView === "latest" ? "bg-purple-700 text-white shadow-sm" : "hover:bg-purple-100 dark:hover:bg-purple-950"}`}
                  onClick={() => setSubView("latest")}
                >
                  {t?.latest15Videos || "Latest 15 Videos"}
                </Button>
              </div>
            </div>

            {/* SORT BUTTON */}
            {subView === "latest" && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLatestSortByViews(!latestSortByViews)}
                  className="cursor-pointer px-6 py-2 text-sm"
                >
                  {latestSortByViews
                    ? t?.sortByNewest || "↩ Sort by Newest"
                    : t?.sortByViews || "↑ Sort by Views"}
                </Button>
              </div>
            )}

            {/* Thumbnail + Bar Chart */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-8 text-center">
                {subView === "top"
                  ? t?.top15VideosByViews || "Top 15 Videos by Views"
                  : latestSortByViews
                    ? t?.latest15VideosSortedByViews ||
                      "Latest 15 Videos (Sorted by Views)"
                    : t?.latest15Videos || "Latest 15 Videos"}
              </h2>
              <div className="space-y-5 md:space-y-6">
                {displayedVideos.map((video) => (
                  <div
                    key={video.video_id}
                    className="flex items-center gap-4 md:gap-6 group"
                  >
                    <a
                      href={`https://youtube.com/watch?v=${video.video_id}`}
                      target="_blank"
                      rel="noopener"
                      className="flex-shrink-0"
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-16 h-10 md:w-20 md:h-14 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                      />
                    </a>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium truncate pr-4 text-sm md:text-base">
                          {video.title}
                        </span>
                        <span className="font-mono text-purple-600 font-semibold text-xs md:text-sm">
                          {formatViews(video.views)}
                        </span>
                      </div>
                      <div className="h-4 md:h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all group-hover:brightness-110"
                          style={{
                            width: `${Math.max((video.views / (displayedVideos[0]?.views || 1)) * 100, 8)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other sections unchanged */}
        {currentView === "dashboard" && (
          <>
            {selectedCrypto === "zcash" && (
              <ZcashChart
                divChartRef={divChartRef}
                handleSaveToPng={handleSaveToPng}
              />
            )}
            {selectedCrypto === "namada" && (
              <NamadaChart
                divChartRef={divChartRef}
                handleSaveToPng={handleSaveToPng}
              />
            )}
            {selectedCrypto === "penumbra" && (
              <PenumbraChart divChartRef={divChartRef} />
            )}
          </>
        )}
        {currentView === "proposals" && <ProposalsList />}
        {currentView === "zcg" && <ZCGDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
