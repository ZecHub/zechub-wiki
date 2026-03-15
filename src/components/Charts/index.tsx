'use client';

import { Button } from "@/components/UI/shadcn/button";
import {
  BarChart3,
  FileText,
  Shield,
  Award,
  Youtube,
  Play,
  Eye,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import "./index.css";

import useExportDashboardAsPNG from "@/hooks/useExportDashboardAsPNG";
import NamadaChart from "./Namada/NamadaChart";
import PenumbraChart from "./Penumbra/PenumbraChart";
import ZcashChart from "./Zcash/ZcashChart";

import { ProposalsList } from "@/components/Proposals";

const ZCGDashboard = dynamic(() => import("@/app/zips-grants/page"), {
  ssr: false,
});

type ViewType = "dashboard" | "proposals" | "zcg" | "youtube";
type SubViewType = "top" | "latest";
type ChannelType = "ZecHub" | "Zcash Foundation" | "Shielded Labs";

const Dashboard = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("zcash");
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [subView, setSubView] = useState<SubViewType>("top");
  const [latestSortByViews, setLatestSortByViews] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<ChannelType>("ZecHub");

  // Data for each channel
  const [zecSorted, setZecSorted] = useState<any[]>([]);
  const [zecDate, setZecDate] = useState<any[]>([]);
  const [slSorted, setSlSorted] = useState<any[]>([]);
  const [slDate, setSlDate] = useState<any[]>([]);
  const [zfSorted, setZfSorted] = useState<any[]>([]);
  const [zfDate, setZfDate] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { divChartRef, handleSaveToPng } = useExportDashboardAsPNG();

  // Load all channel data
  useEffect(() => {
    if (currentView === "youtube") {
      fetch("/data/youtube/ZecHubSorted.json")
        .then((r) => r.json())
        .then(setZecSorted);
      fetch("/data/youtube/ZecHubByDate.json")
        .then((r) => r.json())
        .then(setZecDate);

      fetch("/data/youtube/SLSorted.json")
        .then((r) => r.json())
        .then(setSlSorted);
      fetch("/data/youtube/SLByDate.json")
        .then((r) => r.json())
        .then(setSlDate);

      fetch("/data/youtube/ZFSorted.json")
        .then((r) => r.json())
        .then(setZfSorted);
      fetch("/data/youtube/ZFByDate.json")
        .then((r) => r.json())
        .then(setZfDate);
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
    if (view !== "youtube") {
      setSubView("top");
      setLatestSortByViews(false);
    }
  };

  const tabs = [
    {
      key: "dashboard" as const,
      label: "ZecHub Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      key: "proposals" as const,
      label: "DaoDao Dashboard",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      key: "zcg" as const,
      label: "ZCG Dashboard",
      icon: <Award className="w-5 h-5" />,
    },
    {
      key: "youtube" as const,
      label: "YouTube Dashboard",
      icon: <Youtube className="w-5 h-5" />,
    },
  ];

  const currentSorted =
    currentChannel === "ZecHub"
      ? zecSorted
      : currentChannel === "Shielded Labs"
        ? slSorted
        : zfSorted;
  const currentDate =
    currentChannel === "ZecHub"
      ? zecDate
      : currentChannel === "Shielded Labs"
        ? slDate
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
          <h1 className="text-3xl font-bold text-foreground">Dashboard(s)</h1>
          <p className="text-muted-foreground">
            Analyze Zcash network metrics and trends
          </p>
        </div>

        {/* MAIN TABS */}
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant="ghost"
              className={`px-6 py-2.5 md:px-9 md:py-3.5 rounded-3xl font-semibold flex items-center gap-2 transition-all text-sm md:text-base flex-1 md:flex-none min-w-[140px] md:min-w-0 justify-center ${
                currentView === tab.key
                  ? "bg-purple-700 text-white shadow-lg  hover:bg-purple-800"
                  : "text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-700"
              }`}
              onClick={() => changeView(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Shielded Networks – FIXED: now z-20 so it sits BELOW the fixed top bar / Donate button */}
        <div
          className="flex justify-end md:absolute md:top-6 md:right-6 z-20"
          ref={dropdownRef}
        >
          <Button
            size="icon"
            className="bg-purple-600 hover:bg-purple-700 text-white h-11 w-11 rounded-2xl shadow-lg"
            onClick={() => setOpen(!open)}
            title="Shielded Networks"
          >
            <Shield className="h-5 w-5" />
          </Button>
          {open && (
            <div className="absolute mt-2 right-0 bg-white shadow-lg rounded-lg dark:bg-slate-900 w-[160px] border border-slate-200 dark:border-slate-700 z-50">
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

        {/* === DASHBOARD VIEW – RESTORED TO ORIGINAL (only ZcashChart by default) === */}
        {currentView === "dashboard" && (
          <>
            {selectedCrypto === "zcash" && (
              <ZcashChart
                divChartRef={divChartRef}
                handleSaveToPng={handleSaveToPng}
              />
            )}
            {/* Namada + Penumbra are here ONLY if you ever switch selectedCrypto (they were never forced visible) */}
            {selectedCrypto === "namada" && (
              <NamadaChart
                divChartRef={divChartRef}
                handleSaveToPng={handleSaveToPng}
              />
            )}
            {selectedCrypto === "penumbra" && <PenumbraChart divChartRef={divChartRef} />}
          </>
        )}

        {/* === PROPOSALS VIEW === */}
        {currentView === "proposals" && <ProposalsList />}

        {/* === ZCG VIEW === */}
        {currentView === "zcg" && <ZCGDashboard />}

        {/* === YOUTUBE SECTION === */}
        {currentView === "youtube" && (
          <div className="space-y-8">
            {/* Channel Selector */}
            <div className="flex flex-col items-center">
              <p className="text-sm dark:text-muted-foreground mb-2">
                Current YouTube Channel
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
                ].map((ch) => (
                  <Button
                    key={ch.value}
                    variant="ghost"
                    className={`px-6 py-2 md:px-8 md:py-3 rounded-3xl font-medium transition-all text-sm md:text-base hover:text-black dark:text-white  ${
                      currentChannel === ch.value
                        ? "bg-purple-700 shadow-sm hover:bg-purple-600"
                        : "hover:bg-purple-100 dark:hover:bg-purple-950"
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
                  Total Videos
                </p>
                <p className="text-4xl md:text-5xl font-bold text-purple-600 mt-3 relative z-10">
                  {totalVideos}
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 text-center relative overflow-hidden flex flex-col items-center justify-center h-64 md:h-72">
                <Eye className="absolute -bottom-12 -right-12 h-36 w-36 md:h-44 md:w-44 text-purple-200 dark:text-purple-950/30" />
                <p className="text-sm text-muted-foreground relative z-10">
                  Total Views
                </p>
                <p className="text-4xl md:text-5xl font-bold text-purple-600 mt-3 relative z-10">
                  {formatViews(totalViews)}
                </p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 overflow-hidden flex flex-col h-64 md:h-72">
                <p className="text-sm text-muted-foreground mb-3">
                  Most Viewed
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
                  {formatViews(mostViewed.views || 0)} views
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search videos..."
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
                  className={`px-6 py-2.5 md:px-8 md:py-3 rounded-3xl font-medium transition-all text-sm md:text-base ${subView === "top" ? "bg-purple-700 text-white shadow-sm" : "hover:bg-purple-100 dark:hover:bg-purple-950"}`}
                  onClick={() => {
                    setSubView("top");
                    setLatestSortByViews(false);
                  }}
                >
                  Top 15 by Views
                </Button>
                <Button
                  variant="ghost"
                  className={`px-6 py-2.5 md:px-8 md:py-3 rounded-3xl font-medium transition-all text-sm md:text-base ${subView === "latest" ? "bg-purple-700 text-white shadow-sm" : "hover:bg-purple-100 dark:hover:bg-purple-950"}`}
                  onClick={() => {
                    setSubView("latest");
                    setLatestSortByViews(false);
                  }}
                >
                  Latest 15
                </Button>
                {subView === "latest" && (
                  <Button
                    variant="ghost"
                    className={`px-6 py-2.5 md:px-8 md:py-3 rounded-3xl font-medium transition-all text-sm md:text-base ${latestSortByViews ? "bg-purple-700 text-white shadow-sm" : "hover:bg-purple-100 dark:hover:bg-purple-950"}`}
                    onClick={() => setLatestSortByViews((prev) => !prev)}
                  >
                    {latestSortByViews ? "Sort by Date" : "Sort by Views"}
                  </Button>
                )}
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVideos.map((video) => (
                <div
                  key={video.video_id}
                  className="bg-card border border-border rounded-3xl overflow-hidden group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                      {Math.floor(video.views / 1000)}K
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium line-clamp-2 text-sm leading-snug">
                      {video.title}
                    </p>
                    <div className="text-xs text-muted-foreground mt-3 flex justify-between">
                      <span>{video.published_at}</span>
                      <span className="font-mono">{formatViews(video.views)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;