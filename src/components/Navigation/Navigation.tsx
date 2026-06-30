"use client";
import DonationBtn from "@/components/UI/DonationBtn";
import { navigations } from "@/constants/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import DropdownMobile from "../DropdownMobile/DropdownMobile";
import SearchBar from "../SearchBar";
import Logo from "../UI/Logo";
import { Sheet, SheetContent, SheetTrigger } from "../UI/Sheet";
import SocialIcons from "../UI/SocialIcons";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

import { matchIcons } from "@/constants/Icons";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Moon,
  Search,
  Sun,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../UI/button";
import { Icon } from "../UI/Icon";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";

import { DarkModeContext } from "@/context/DarkModeContext";
import Image from "next/image";
import { Trophy, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";

const liStyle = `hover:bg-yellow-300 dark:hover:bg-yellow-500 rounded-sm dark:text-slate-300 hover:text-slate-900 dark:hover:text-white`;

// Translation helper function
const getTranslatedLabel = (
  itemName: string,
  linkName: string | undefined,
  t: any,
  originalLabel?: string,
): string => {
  const mainNavMap: Record<string, string> = {
    DAO: t.navigation?.dao || "DAO",
    Governance: t.navigation?.governance || "Governance",
    Tutorials: t.navigation?.tutorials || "Tutorials",
    Developers: t.navigation?.developers || "Developers",
    Contribute: t.navigation?.contribute || "Contribute",
    Visualizer: t.navigation?.visualizer || "Visualizer",
  };

  const usingZcashMap: Record<string, string> = {
    "Use Cases": t.navigation?.usingZcash?.useCases || "Use Cases",
    "Buying ZEC": t.navigation?.usingZcash?.buyingZec || "Buying ZEC",
    Faucets: t.navigation?.usingZcash?.faucets || "Faucets",
    Wallets: t.navigation?.usingZcash?.wallets || "Wallets",
    "Metamask Snap": t.navigation?.usingZcash?.metamaskSnap || "Metamask Snap",
    Exchanges: t.navigation?.usingZcash?.exchanges || "Exchanges",
    "Block Explorers":
      t.navigation?.usingZcash?.blockExplorers || "Block Explorers",
    "Blockchain Explorers":
      t.navigation?.usingZcash?.blockExplorers || "Blockchain Explorers",
    "Shielded Pools":
      t.navigation?.usingZcash?.shieldedPools || "Shielded Pools",
    "Transparent Exchange Addresses":
      t.navigation?.usingZcash?.transparentExchangeAddresses ||
      "Transparent Exchange Addresses",
    Transactions: t.navigation?.usingZcash?.transactions || "Transactions",
    Memos: t.navigation?.usingZcash?.memos || "Memos",
    "Mobile Top Ups":
      t.navigation?.usingZcash?.mobileTopUps || "Mobile Top Ups",
    "Payment Request URIs":
      t.navigation?.usingZcash?.paymentRequestUris || "Payment Request URIs",
    "Payment Processors":
      t.navigation?.usingZcash?.paymentProcessors || "Payment Processors",
    "Recovering Funds":
      t.navigation?.usingZcash?.recoveringFunds || "Recovering Funds",
    Testnet: t.navigation?.usingZcash?.testnet || "Testnet",
    Tools: t.navigation?.usingZcash?.tools || "Tools",
  };

  const communityMap: Record<string, string> = {
    "Arborist Calls":
      t.navigation?.zcashCommunity?.arboristCalls || "Arborist Calls",
    "Zcash Governance":
      t.navigation?.zcashCommunity?.zcashGovernance || "Zcash Governance",
    "Community Blogs":
      t.navigation?.zcashCommunity?.communityBlogs || "Community Blogs",
    "Community Links":
      t.navigation?.zcashCommunity?.communityLinks || "Community Links",
    "Community Forum":
      t.navigation?.zcashCommunity?.communityForum || "Community Forum",
    "Community Projects":
      t.navigation?.zcashCommunity?.communityProjects || "Community Projects",
    "Zcash Global Ambassadors":
      t.navigation?.zcashCommunity?.globalAmbassadors ||
      "Zcash Global Ambassadors",
    "Zcash Media": t.navigation?.zcashCommunity?.zcashMedia || "Zcash Media",
    ZCAP: t.navigation?.zcashCommunity?.zcap || "ZCAP",
    "Zcash Podcasts":
      t.navigation?.zcashCommunity?.zcashPodcasts || "Zcash Podcasts",
    "Zcash Ecosystem Security":
      t.navigation?.zcashCommunity?.ecosystemSecurity ||
      "Zcash Ecosystem Security",
    "Cypherpunk Zero NFT":
      t.navigation?.zcashCommunity?.cypherpunkZeroNFT || "Cypherpunk Zero NFT",
    "Zcon Archive": t.navigation?.zcashCommunity?.zconArchive || "Zcon Archive",
  };

  const organizationsMap: Record<string, string> = {
    "Electric Coin Company":
      t.navigation?.organizations?.electricCoinCompany ||
      "Electric Coin Company",
    "Zcash Foundation":
      t.navigation?.organizations?.zcashFoundation || "Zcash Foundation",
    "Zcash Community Grants":
      t.navigation?.organizations?.communityGrants || "Zcash Community Grants",
    "Financial Privacy Foundation":
      t.navigation?.organizations?.financialPrivacyFoundation ||
      "Financial Privacy Foundation",
    "Shielded Labs":
      t.navigation?.organizations?.shieldedLabs || "Shielded Labs",
    "Zingo Labs": t.navigation?.organizations?.zingoLabs || "Zingo Labs",
    Brand: t.navigation?.organizations?.brand || "Brand",
    "ZKAV Club": t.navigation?.organizations?.zkavClub || "ZKAV Club",
  };

  const guidesMap: Record<string, string> = {
    "Zgo Payment Processor":
      t.navigation?.guidesSubmenu?.zgoPaymentProcessor ||
      "Zgo Payment Processor",
    "Free2z Live": t.navigation?.guidesSubmenu?.free2zLive || "Free2z Live",
    "Keystone Zashi":
      t.navigation?.guidesSubmenu?.keystoneZashi || "Keystone Zashi",
    "Maya Protocol":
      t.navigation?.guidesSubmenu?.mayaProtocol || "Maya Protocol",
    "Nym VPN": t.navigation?.guidesSubmenu?.nymVpn || "Nym VPN",
    "Using ZEC in DeFi":
      t.navigation?.guidesSubmenu?.usingZecInDefi || "Using ZEC in DeFi",
    "Using ZEC Privately":
      t.navigation?.guidesSubmenu?.usingZecPrivately || "Using ZEC Privately",
    "Raspberry Pi Zcashd Node":
      t.navigation?.guidesSubmenu?.raspberryPiZcashdNode ||
      "Raspberry Pi Zcashd Node",
    "Raspberry Pi 4 Full Node":
      t.navigation?.guidesSubmenu?.raspberryPiZcashdNode ||
      "Raspberry Pi 4 Full Node",
    "Raspberry pi5 Zebra Lightwalletd Zingo":
      t.navigation?.guidesSubmenu?.raspberryPi5ZebraLightwalletdZingo ||
      "Raspberry pi5 Zebra Lightwalletd Zingo",
    "Raspberry Pi Zebra Node":
      t.navigation?.guidesSubmenu?.raspberryPiZebraNode ||
      "Raspberry Pi Zebra Node",
    "Raspberry pi 4 Zebra Node":
      t.navigation?.guidesSubmenu?.raspberryPiZebraNode ||
      "Raspberry pi 4 Zebra Node",
    "Akash Network":
      t.navigation?.guidesSubmenu?.akashNetwork || "Akash Network",
    "Avalanche RedBridge":
      t.navigation?.guidesSubmenu?.avalancheRedbridge || "Avalanche RedBridge",
    "Zkool Multisig":
      t.navigation?.guidesSubmenu?.zkoolMultisig || "Zkool Multisig",
    "Ywallet FROST Demo":
      t.navigation?.guidesSubmenu?.ywalletFrostDemo || "Ywallet FROST Demo",
    "Blockchain Explorers":
      t.navigation?.guidesSubmenu?.blockchainExplorers ||
      "Blockchain Explorers",
    "Brave Wallet": t.navigation?.guidesSubmenu?.braveWallet || "Brave Wallet",
    "BTCPayServer Plugin":
      t.navigation?.guidesSubmenu?.btcPayServerPlugin || "BTCPayServer Plugin",
    "Visualizing the Zcash Network":
      t.navigation?.guidesSubmenu?.visualizingZcashNetwork ||
      "Visualizing the Zcash Network",
    "Visualizing Zcash Addresses":
      t.navigation?.guidesSubmenu?.visualizingZcashAddresses ||
      "Visualizing Zcash Addresses",
    "Zcash Devtool":
      t.navigation?.guidesSubmenu?.zcashDevtool || "Zcash Devtool",
    "Zcash Improvement Proposals":
      t.navigation?.guidesSubmenu?.zcashImprovementProposals ||
      "Zcash Improvement Proposals",
    "Zingolib and Zaino Tutorial":
      t.navigation?.guidesSubmenu?.zingolibAndZainoTutorial ||
      "Zingolib and Zaino Tutorial",
    "Zenith Installation":
      t.navigation?.guidesSubmenu?.zenithInstallation || "Zenith Installation",
    "Zero Knowledge vs Decoy Systems":
      t.navigation?.guidesSubmenu?.zeroKnowledgeVsDecoys ||
      "Zero Knowledge vs Decoy Systems",
    "Zero-Knowledge vs Decoys":
      t.navigation?.guidesSubmenu?.zeroKnowledgeVsDecoys ||
      "Zero-Knowledge vs Decoys",
  };

  const parentLabels: Record<string, string> = {
    "Using Zcash": t.navigation?.usingZcash?.label || "Use Zcash",
    "Use Zcash": t.navigation?.usingZcash?.label || "Use Zcash",
    "Zcash Community": t.navigation?.zcashCommunity?.label || "Ecosystem",
    Ecosystem: t.navigation?.zcashCommunity?.label || "Ecosystem",
    "Zcash Organizations":
      t.navigation?.organizations?.label || "Organizations",
    Organizations: t.navigation?.organizations?.label || "Organizations",
    Guides: t.navigation?.guides || "Guides",
  };

  const useCasesMap: Record<string, string> = {
    "Use Cases": t.navigation?.usingZcash?.useCases || "Use Cases",
    "Start Here":
      t.navigation?.usingZcash?.useCasesSubmenu?.startHere || "Start Here",
    "Accept Payments":
      t.navigation?.usingZcash?.useCasesSubmenu?.acceptPayments ||
      "Accept Payments",
    "Freelance Privacy":
      t.navigation?.usingZcash?.useCasesSubmenu?.freelancePrivacy ||
      "Freelance Privacy",
    "Journalist Privacy":
      t.navigation?.usingZcash?.useCasesSubmenu?.journalistPrivacy ||
      "Journalist Privacy",
    "Keeping Records":
      t.navigation?.usingZcash?.useCasesSubmenu?.keepingRecords ||
      "Keeping Records",
    "Private Community Treasury":
      t.navigation?.usingZcash?.useCasesSubmenu?.privateCommunityTreasury ||
      "Private Community Treasury",
    Donations:
      t.navigation?.usingZcash?.useCasesSubmenu?.donations || "Donations",
    "Send Money Privately":
      t.navigation?.usingZcash?.useCasesSubmenu?.sendMoneyPrivately ||
      "Send Money Privately",
  };

  const searchName = linkName || itemName;

  return (
    mainNavMap[searchName] ||
    useCasesMap[searchName] ||
    usingZcashMap[searchName] ||
    communityMap[searchName] ||
    organizationsMap[searchName] ||
    guidesMap[searchName] ||
    parentLabels[searchName] ||
    searchName
  );
};

// ─── Flyout sub-menu item (extracted so hooks are always called at top level) ───
const FlyoutLinkItem = ({
  link,
  parentItem,
  t,
  onLinkClick,
}: {
  link: NonNullable<(typeof navigations)[number]["links"]>[number];
  parentItem: (typeof navigations)[number];
  t: any;
  onLinkClick: () => void;
}) => {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openFlyout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlyoutOpen(true);
  };
  const closeFlyout = () => {
    timerRef.current = setTimeout(() => setFlyoutOpen(false), 80);
  };

  const label = getTranslatedLabel(parentItem.name, link.name, t, link.label);

  if (!link.links || link.links.length === 0) {
    return (
      <div
        className={`hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200 ${liStyle}`}
      >
        <Link
          prefetch
          href={link.path ?? "#"}
          onClick={onLinkClick}
          className="flex items-center gap-2 text-sm w-full text-nav-foreground hover:text-nav-hover"
          {...(link.newTab && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {(link.icon || matchIcons(parentItem.name, link.name)) && (
            <Icon
              icon={link.icon ?? matchIcons(parentItem.name, link.name)}
              size={link.name === "Wallets" ? 24 : "small"}
              className="xl:w-6 w-4 h-4 xl:h-6"
            />
          )}
          {label}
        </Link>
      </div>
    );
  }

  // Has nested children — render with flyout opening to the left
  return (
    <div
      className="relative"
      onMouseEnter={openFlyout}
      onMouseLeave={closeFlyout}
    >
      <div
        className={`flex items-center justify-between gap-2 text-sm w-full px-3 py-2 rounded-sm cursor-pointer text-nav-foreground hover:text-nav-hover transition-colors duration-200 ${liStyle}`}
      >
        <span className="flex items-center gap-2">
          {(link.icon || matchIcons(parentItem.name, link.name)) && (
            <Icon
              icon={link.icon ?? matchIcons(parentItem.name, link.name)}
              className="xl:w-5 w-4 h-4 xl:h-5 shrink-0"
            />
          )}
          {label}
        </span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60 rotate-180" />
      </div>

      {flyoutOpen && (
        <div
          className="absolute right-full top-0 z-[60] bg-slate-100 dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 min-w-[220px] p-1.5 rounded-sm"
          onMouseEnter={openFlyout}
          onMouseLeave={closeFlyout}
        >
          {link.links.map((child, idx) => (
            <Link
              prefetch
              key={`${child.name}-${idx}`}
              href={child.path ?? "#"}
              onClick={onLinkClick}
              className={`flex items-center gap-2 text-sm w-full px-3 py-2 rounded-sm text-nav-foreground hover:text-nav-hover transition-colors duration-200 ${liStyle}`}
              {...(child.newTab && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {(child.icon || matchIcons(parentItem.name, child.name)) && (
                <Icon
                  icon={child.icon ?? matchIcons(parentItem.name, child.name)}
                  className="xl:w-5 w-4 h-4 xl:h-5 shrink-0"
                />
              )}
              {getTranslatedLabel(parentItem.name, child.name, t, child.label)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Primary dropdown (hover) ────────────────────────────────────────────────
const Dropdown = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center gap-1 text-nav-foreground hover:text-nav-hover transition-colors duration-200 cursor-pointer py-2">
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 bg-slate-100 text-slate-700 dark:bg-slate-900 shadow-lg min-w-[600px] mt-0 grid grid-cols-2 gap-2 p-2 transition-all duration-150">
          {children}
        </div>
      )}
    </div>
  );
};

// ─── "More" menu item (for items beyond the primary nav slots) ───────────────
const MoreMenuItem = ({
  item,
  t,
  onLinkClick,
}: {
  item: (typeof navigations)[number];
  t: any;
  onLinkClick: () => void;
}) => {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openFlyout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlyoutOpen(true);
  };
  const closeFlyout = () => {
    timerRef.current = setTimeout(() => setFlyoutOpen(false), 80);
  };

  const label = getTranslatedLabel(item.name, item.label, t, item.label);

  if (!item.links) {
    return (
      <Link
        prefetch
        href={item.path ?? "#"}
        onClick={onLinkClick}
        className={`flex items-center gap-2 text-sm w-full px-3 py-2 rounded-sm text-nav-foreground hover:text-nav-hover transition-colors duration-200 ${liStyle}`}
        {...(item.newTab && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {(item.icon || matchIcons(item.name, item.name)) && (
          <Icon
            icon={item.icon ?? matchIcons(item.name, item.name)}
            className="xl:w-5 w-4 h-4 xl:h-5 shrink-0"
          />
        )}
        {label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={openFlyout}
      onMouseLeave={closeFlyout}
    >
      <div
        className={`flex items-center justify-between gap-2 text-sm w-full px-3 py-2 rounded-sm cursor-pointer text-nav-foreground hover:text-nav-hover transition-colors duration-200 ${liStyle}`}
      >
        <span className="flex items-center gap-2">
          {(item.icon || matchIcons(item.name, item.name)) && (
            <Icon
              icon={item.icon ?? matchIcons(item.name, item.name)}
              className="xl:w-5 w-4 h-4 xl:h-5 shrink-0"
            />
          )}
          {label}
        </span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
      </div>

      {flyoutOpen && (
        <div
          className="absolute left-full top-0 z-[60] bg-slate-100 dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 min-w-[220px] p-1.5 rounded-sm"
          onMouseEnter={openFlyout}
          onMouseLeave={closeFlyout}
        >
          {item.links.map((link, idx) => (
            <Link
              prefetch
              key={`${link.name}-${idx}`}
              href={link.path ?? "#"}
              onClick={onLinkClick}
              className={`flex items-center gap-2 text-sm w-full px-3 py-2 rounded-sm text-nav-foreground hover:text-nav-hover transition-colors duration-200 ${liStyle}`}
              {...(link.newTab && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {(link.icon || matchIcons(item.name, link.name)) && (
                <Icon
                  icon={link.icon ?? matchIcons(item.name, link.name)}
                  className="xl:w-5 w-4 h-4 xl:h-5 shrink-0"
                />
              )}
              {getTranslatedLabel(item.name, link.name, t, link.label)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Nav links (desktop) ──────────────────────────────────────────────────────
const NavLinks = ({
  classes,
  closeMenu,
}: {
  classes: string;
  closeMenu: () => void;
}) => {
  const { t } = useLanguage();
  const handleLinkClick = () => {
    closeMenu();
  };

  const [openIndex, setOpenIndex] = useState<null | number>(null);

  return (
    <div className={`flex items-center ${classes}`}>
      {/* Large screens */}
      <div className="hidden lg:flex items-center space-x-10">
        {navigations.slice(0, 4).map((item, i) =>
          item.links ? (
            <Dropdown
              label={getTranslatedLabel(item.name, item.label, t, item.label)}
              key={`${item.name}-${i}`}
            >
              {item.links.map((link, j) => (
                <FlyoutLinkItem
                  key={`${link.name}-${j}`}
                  link={link}
                  parentItem={item}
                  t={t}
                  onLinkClick={handleLinkClick}
                />
              ))}
            </Dropdown>
          ) : (
            <Link
              prefetch
              key={`${item.name}-${i}`}
              href={item.path ?? "#"}
              onClick={handleLinkClick}
              className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 whitespace-nowrap"
              {...(item.newTab && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {getTranslatedLabel(item.name, item.label, t, item.label)}
            </Link>
          ),
        )}

        {navigations.length > 4 && (
          <MoreDropdown
            items={navigations.slice(4)}
            t={t}
            onLinkClick={handleLinkClick}
          />
        )}
      </div>

      {/* Medium screens (md–lg) */}
      <div className="hidden md:flex lg:hidden items-center space-x-12">
        {navigations.slice(0, 3).map((item, i) => (
          <Dropdown
            label={getTranslatedLabel(item.name, item.label, t, item.label)}
            key={`${item.name}-${i}`}
          >
            {item.links?.map((link, j) => (
              <FlyoutLinkItem
                key={`${link.name}-${j}`}
                link={link}
                parentItem={item}
                t={t}
                onLinkClick={handleLinkClick}
              />
            ))}
          </Dropdown>
        ))}

        {navigations.length > 2 && (
          <Dropdown label={t.navigation?.more || "More"}>
            <div onMouseLeave={() => setOpenIndex(null)}>
              {navigations.slice(3).map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={`${item.name}-${i}`}
                    className="hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200"
                  >
                    {item.links ? (
                      <>
                        <div
                          className="flex items-center gap-1 text-white hover:text-nav-hover transition-colors duration-200 cursor-pointer py-2"
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                        >
                          {getTranslatedLabel(
                            item.name,
                            item.label,
                            t,
                            item.label,
                          )}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                        {isOpen &&
                          item.links.map((link, j) => (
                            <div
                              key={`${link.name}-${j}`}
                              className={`hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200 ${liStyle}`}
                            >
                              <Link
                                prefetch
                                href={link.path ?? "#"}
                                onClick={handleLinkClick}
                                className="flex items-center gap-2 text-sm w-full"
                                {...(link.newTab && {
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                })}
                              >
                                {(link.icon ||
                                  matchIcons(item.name, link.name)) && (
                                  <Icon
                                    icon={
                                      link.icon ??
                                      matchIcons(item.name, link.name)
                                    }
                                    className="xl:w-6 w-4 h-4 xl:h-6"
                                  />
                                )}
                                {getTranslatedLabel(
                                  item.name,
                                  link.name,
                                  t,
                                  link.label,
                                )}
                              </Link>
                            </div>
                          ))}
                      </>
                    ) : (
                      <Link
                        prefetch
                        href={item.path ?? "#"}
                        onClick={handleLinkClick}
                        className="w-full text-white hover:text-nav-hover"
                        {...(item.newTab && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        {getTranslatedLabel(
                          item.name,
                          item.label,
                          t,
                          item.label,
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </Dropdown>
        )}
      </div>

      {/* CTA buttons */}
      <div className="hidden md:flex items-center gap-3 ml-7 pl-7 border-l border-slate-400 dark:border-slate-600">
        <Button
          asChild
          variant="default"
          size="default"
          className="zebra-hover bg-brand hover:bg-brand-hover text-white font-medium shadow-sm"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
            e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty("--mouse-x", "50%");
            e.currentTarget.style.setProperty("--mouse-y", "50%");
          }}
        >
          <Link
            prefetch
            href="https://bounties.zechub.wiki/"
            target="_blank"
            onClick={handleLinkClick}
          >
            {t.navigation?.bounties || "Bounties"}
          </Link>
        </Button>

        <Button
          asChild
          variant="default"
          size="default"
          className="zebra-hover bg-brand hover:bg-brand-hover text-white font-medium shadow-sm"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
            e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty("--mouse-x", "50%");
            e.currentTarget.style.setProperty("--mouse-y", "50%");
          }}
        >
          <Link prefetch href="/dashboard" onClick={handleLinkClick}>
            {t.navigation?.dashboard || "Dashboard"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

// ─── "More" dropdown (overflowing nav items on large screens) ─────────────────
const MoreDropdown = ({
  items,
  t,
  onLinkClick,
}: {
  items: typeof navigations;
  t: any;
  onLinkClick: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center gap-1 text-nav-foreground hover:text-nav-hover transition-colors duration-200 cursor-pointer py-2">
        {t.navigation?.more || "More"}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 bg-slate-100 dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 min-w-[200px] mt-0 p-1.5 rounded-sm">
          {items.map((item, i) => (
            <MoreMenuItem
              key={`${item.name}-${i}`}
              item={item}
              t={t}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Mobile nav ───────────────────────────────────────────────────────────────
const MobileNavLinks = ({ closeMenu }: { closeMenu: () => void }) => {
  const { t } = useLanguage();
  const { dark } = useDarkModeContext();
  const folder = dark ? "dark" : "light";
  const handleLinkClick = () => closeMenu();

  const iconMap: Record<string, string> = {
    "Use Zcash": `/explore/${folder}/using-zcash.png`,
    Ecosystem: `/explore/${folder}/zcash-tech.png`,
    Guides: `/explore/${folder}/guides.png`,
    Organizations: `/explore/${folder}/zcash-organizations.png`,
    DAO: `/explore/${folder}/contribute.png`,
    Governance: `/explore/${folder}/contribute.png`,
    Tutorials: `/explore/${folder}/tutorials.png`,
    Developers: `/explore/${folder}/contribute.png`,
    Contribute: `/explore/${folder}/contribute.png`,
    Visualizer: `/explore/${folder}/zcash-tech.png`,
    Sitemap: `/explore/${folder}/start-here.png`,
    Bounties: `/explore/${folder}/contribute.png`,
  };

  const getExploreIcon = (name: string) =>
    iconMap[name] || `/explore/${folder}/start-here.png`;

  return (
    <div className="flex flex-col space-y-1 font-normal">
      <div className="grid grid-cols-2 gap-3 mb-8 px-1">
        <Link
          prefetch
          href="https://bounties.zechub.wiki/"
          target="_blank"
          onClick={handleLinkClick}
          className="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white/5 dark:bg-white/5 border border-amber-200 dark:border-amber-800 hover:bg-yellow-300 dark:hover:bg-yellow-500 hover:border-amber-400 transition-all duration-200 group font-semibold text-base"
        >
          <Icon
            icon={Trophy}
            className="w-5 h-5 text-amber-500 dark:text-amber-400 group-active:scale-110 transition-transform"
          />
          {t.navigation?.bounties || "Bounties"}
        </Link>
        <Link
          prefetch
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white/5 dark:bg-white/5 border border-amber-200 dark:border-amber-800 hover:bg-yellow-300 dark:hover:bg-yellow-500 hover:border-amber-400 transition-all duration-200 group font-semibold text-base"
        >
          <Icon
            icon={LayoutDashboard}
            className="w-5 h-5 text-amber-500 dark:text-amber-400 group-active:scale-110 transition-transform"
          />
          {t.navigation?.dashboard || "Dashboard"}
        </Link>
      </div>

      {navigations.map((item, i) => {
        const iconSrc = getExploreIcon(item.name || item.label || "");
        return item.links ? (
          <DropdownMobile
            label={getTranslatedLabel(item.name, item.label, t, item.label)}
            key={`${item.name}-${i}`}
          >
            {item.links.map((link, idx) => (
              <div key={`${link.name}-${idx}`}>
                {/* If this link has children, show it as an expandable group */}
                {link.links && link.links.length > 0 ? (
                  <DropdownMobile
                    label={getTranslatedLabel(
                      item.name,
                      link.name,
                      t,
                      link.label,
                    )}
                  >
                    {/* Overview link */}
                    {link.path && (
                      <Link
                        prefetch
                        href={link.path}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-nav-foreground hover:bg-nav-hover-bg transition-colors duration-200 text-sm font-medium ${liStyle} text-slate-700`}
                        {...(link.newTab && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        {getTranslatedLabel(
                          item.name,
                          link.name,
                          t,
                          link.label,
                        )}{" "}
                        — Overview
                      </Link>
                    )}
                    {link.links.map((child, cidx) => (
                      <Link
                        prefetch
                        key={`${child.name}-${cidx}`}
                        href={child.path ?? "#"}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-nav-foreground hover:bg-nav-hover-bg transition-colors duration-200 text-sm ${liStyle} text-slate-700`}
                        {...(child.newTab && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        {(child.icon || matchIcons(item.name, child.name)) && (
                          <Icon
                            icon={
                              child.icon ?? matchIcons(item.name, child.name)
                            }
                            className="xl:w-6 w-4 h-4 xl:h-6"
                          />
                        )}
                        {getTranslatedLabel(
                          item.name,
                          child.name,
                          t,
                          child.label,
                        )}
                      </Link>
                    ))}
                  </DropdownMobile>
                ) : (
                  <Link
                    prefetch
                    href={link.path ?? "#"}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-nav-foreground hover:bg-nav-hover-bg transition-colors duration-200 text-sm ${liStyle} text-slate-700`}
                    {...(link.newTab && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    {(link.icon || matchIcons(item.name, link.name)) && (
                      <Icon
                        icon={link.icon ?? matchIcons(item.name, link.name)}
                        className="xl:w-6 w-4 h-4 xl:h-6"
                      />
                    )}
                    {getTranslatedLabel(item.name, link.name, t, link.label)}
                  </Link>
                )}
              </div>
            ))}
          </DropdownMobile>
        ) : (
          <Link
            prefetch
            key={`${item.name}-${i}`}
            href={item.path ?? "#"}
            onClick={handleLinkClick}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all hover:bg-yellow-400 hover:text-black dark:hover:bg-amber-600 font-medium"
          >
            <Image
              src={iconSrc}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain flex-shrink-0"
              quality={85}
            />
            {getTranslatedLabel(item.name, item.label, t, item.label)}
          </Link>
        );
      })}

      <div className="flex flex-col space-y-3 my-8 border-t border-slate-400 dark:border-slate-50"></div>
      <div className="py-12">
        <DonationBtn />
      </div>
    </div>
  );
};

const MobileNav = ({ closeMenu }: { closeMenu: () => void }) => (
  <div className="flex flex-col h-[90%]">
    <div className="flex-1">
      <MobileNavLinks closeMenu={closeMenu} />
    </div>
    <SocialIcons newTab={true} />
  </div>
);

const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const [openSearch, setOpenSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 w-full border-b border-slate-300 dark:border-slate-600 backdrop-blur supports-[backdrop-filter]:bg-nav-background/95 z-200">
      <div className="mx-auto w-full max-w-372 px-2 md:px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          <Link prefetch href="/" className="shrink-0 hover:cursor-pointer">
            <Logo theme={mounted && isDark} />
          </Link>

          <nav className="hidden xl:flex flex-1 justify-center max-w-4xl mx-8">
            <NavLinks
              classes="w-full justify-start"
              closeMenu={() => setIsOpen(false)}
            />
          </nav>

          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenSearch(true)}
              className="p-2 hover:bg-nav-hover-bg cursor-pointer hover:text-black dark:hover:text-white"
            >
              <Search className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(!isDark ? "dark" : "light")}
              className="p-2 hover:bg-nav-hover-bg cursor-pointer hover:text-black dark:hover:text-white"
            >
              {mounted && isDark ? (
                <Sun className="h-5 w-5 md:h-6 md:w-6" />
              ) : (
                <Moon className="h-5 w-5 md:h-6 md:w-6" />
              )}
            </Button>

            <div
              className="hidden xl:flex relative"
              onMouseEnter={() => setShowShop(true)}
              onMouseLeave={() => setShowShop(false)}
            >
              <DonationBtn />
              {showShop && (
                <div
                  className="absolute top-8.5 left-0 w-full z-50"
                  style={{ marginTop: "-2px" }}
                >
                  <Link
                    prefetch
                    href="https://zechub.store/"
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold px-4 py-2 bg-slate-100 text-slate-600 dark:bg-slate-900 rounded-md shadow-md shadow-black/20 border-t border-yellow-600/30 transition-all duration-150 hover:brightness-110 animate-[slideDown_0.12s_ease-out]"
                    style={{ transformOrigin: "top center" }}
                  >
                    <ShoppingBag className="h-4 w-4" /> Shop
                  </Link>
                </div>
              )}
            </div>

            {mounted ? (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="xl:hidden" asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-nav-hover-bg cursor-pointer hover:text-black dark:hover:text-white"
                  >
                    <Menu className="h-10 w-10" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-nav-background border-nav-border min-h-screen w-[300px] sm:w-[350px] bg-slate-50 dark:bg-slate-900 z-201"
                >
                  <MobileNav closeMenu={() => setIsOpen(false)} />
                </SheetContent>
              </Sheet>
            ) : (
              <div className="xl:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-nav-hover-bg cursor-pointer hover:text-black dark:hover:text-white"
                  aria-label="Open menu"
                >
                  <Menu className="h-10 w-10" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
