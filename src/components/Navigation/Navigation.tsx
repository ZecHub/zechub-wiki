"use client";
import DonationBtn from "@/components/UI/DonationBtn";
import { navigations } from "@/constants/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import DropdownMobile from "../DropdownMobile/DropdownMobile";
import SearchBar from "../SearchBar";
import Logo from "../UI/Logo";
import { Sheet, SheetContent, SheetTrigger } from "../UI/Sheet";
import SocialIcons from "../UI/SocialIcons";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

import { matchIcons } from "@/constants/Icons";
import { ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
import { Button } from "../UI/button";
import { Icon } from "../UI/Icon";
import { useDarkModeContext } from "@/hooks/useDarkModeContext";

const liStyle = `hover:bg-yellow-300 dark:hover:bg-yellow-500 rounded-sm dark:text-slate-300 hover:text-slate-900 dark:hover:text-white`;

// Translation helper function
const getTranslatedLabel = (
  itemName: string,
  linkName: string | undefined,
  t: any,
  originalLabel?: string,
): string => {
  // if (originalLabel && originalLabel !== itemName) {
  //   return originalLabel;
  // }

  // Main navigation items
  const mainNavMap: Record<string, string> = {
    DAO: t.navigation?.dao || "DAO",
    Governance: t.navigation?.governance || "Governance",
    Tutorials: t.navigation?.tutorials || "Tutorials",
    Developers: t.navigation?.developers || "Developers",
    Contribute: t.navigation?.contribute || "Contribute",
    Visualizer: t.navigation?.visualizer || "Visualizer",
  };

  // Using Zcash submenu
  const usingZcashMap: Record<string, string> = {
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
  };

  // Community submenu
  const communityMap: Record<string, string> = {
    "Arborist Calls":
      t.navigation?.zcashCommunity?.arboristCalls || "Arborist Calls",
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

  // Organizations submenu
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

  // Guides submenu
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

  // Parent menu labels
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

  const searchName = linkName || itemName;

  return (
    mainNavMap[searchName] ||
    usingZcashMap[searchName] ||
    communityMap[searchName] ||
    organizationsMap[searchName] ||
    guidesMap[searchName] ||
    parentLabels[searchName] ||
    searchName
  );
};

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
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 
             bg-slate-100 text-slate-700 dark:bg-slate-900 
             shadow-lg min-w-[600px] mt-0 
             grid grid-cols-2 gap-2 p-2"
        >
          {children}
        </div>
      )}
    </div>
  );
};

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
      {/* Navigation links with responsive behavior */}
      <div className="hidden lg:flex items-center space-x-10">
        {/* Show first 4 links normally on desktop */}
        {navigations.slice(0, 4).map((item, i) =>
          item.links ? (
            <Dropdown
              label={getTranslatedLabel(item.name, item.label, t, item.label)}
              key={`${item.name}-${i}`}
            >
              {item.links.map((link, i) => (
                <div
                  key={`${link.name}-${i}`}
                  className={`hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200 ${liStyle}`}
                >
                  <Link
                    prefetch
                    href={link.path ?? "#"}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 text-sm w-full text-nav-foreground hover:text-nav-hover"
                    {...(link.newTab && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    {(link.icon || matchIcons(item.name, link.name)) && (
                      <Icon
                        icon={link.icon ?? matchIcons(item.name, link.name)}
                        size={link.name === "Wallets" ? 24 : "small"}
                        className="xl:w-6 w-4 h-4 xl:h-6"
                      />
                    )}
                    {getTranslatedLabel(item.name, link.name, t, link.label)}
                  </Link>
                </div>
              ))}
            </Dropdown>
          ) : (
            <Link
              prefetch
              key={`${item.name}-${i}`}
              href={item.path ?? "#"}
              onClick={handleLinkClick}
              className={`text-nav-foreground hover:text-nav-hover transition-colors duration-200 whitespace-nowrap`}
              {...(item.newTab && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {getTranslatedLabel(item.name, item.label, t, item.label)}
            </Link>
          ),
        )}

        {/* Overflow nav in a More dropdown for desktop */}
        {navigations.length > 4 && (
          <Dropdown label={t.navigation?.more || "More"}>
            {navigations.slice(4).map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className={`hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200 ${liStyle}`}
              >
                <Link
                  prefetch
                  href={item.path ?? "#"}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-2 text-sm w-full text-nav-foreground `}
                  {...(item.newTab && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                >
                  {(item.icon || matchIcons(item.name, item.name)) && (
                    <Icon
                      icon={item.icon ?? matchIcons(item.name, item.name)}
                      className="xl:w-6 w-4 h-4 xl:h-6"
                    />
                  )}
                  {getTranslatedLabel(item.name, item.label, t, item.label)}
                </Link>
              </div>
            ))}
          </Dropdown>
        )}
      </div>

      {/* Medium screens - show fewer links */}
      <div className="hidden md:flex lg:hidden items-center space-x-12">
        {navigations.slice(0, 3).map((item, i) => (
          <Dropdown
            label={getTranslatedLabel(item.name, item.label, t, item.label)}
            key={`${item.name}-${i}`}
          >
            {item.links?.map((link, i) => (
              <div
                key={`${link.name}-${i}`}
                className={`hover:bg-nav-hover-bg py-2 px-3 transition-colors duration-200 ${liStyle}`}
              >
                <Link
                  prefetch
                  href={link.path ?? "#"}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 text-sm w-full text-nav-foreground hover:text-nav-hover"
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
              </div>
            ))}
          </Dropdown>
        ))}

        {navigations.length > 2 && (
          <Dropdown label={t.navigation?.more || "More"}>
            <div onMouseLeave={() => setOpenIndex(null)}>
              {navigations.slice(3).map((item, i) => {
                const isOpen = openIndex === i; // check if current item is open

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
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
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

      {/* CTA buttons - responsive */}
      <div className="hidden md:flex items-center space-x-8 ml-6">
        <Link
          prefetch
          href="/dashboard"
          onClick={handleLinkClick}
          className="text-cta-primary hover:bg-cta-primary dark:hover:text-white transition-colors duration-200"
        >
          {t.navigation?.dashboard || "Dashboard"}
        </Link>
      </div>
    </div>
  );
};

const MobileNavLinks = ({ closeMenu }: { closeMenu: () => void }) => {
  const { t } = useLanguage();
  const handleLinkClick = () => closeMenu();
  return (
    <div className="flex flex-col space-y-1 font-normal">
      {navigations.map((item, i) =>
        item.links ? (
          <DropdownMobile
            label={getTranslatedLabel(item.name, item.label, t, item.label)}
            key={`${item.name}-${i}`}
          >
            {item.links.map((link, i) => {
              return (
                <Link
                  prefetch
                  key={`${link.name}-${i}`}
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
              );
            })}
          </DropdownMobile>
        ) : (
          <Link
            prefetch
            key={`${item.name}-${i}`}
            href={item.path ?? "#"}
            onClick={handleLinkClick}
            className={`px-3 py-2 rounded-md text-nav-foreground hover:bg-nav-hover-bg transition-colors duration-200 ${liStyle} dark:text-white`}
            {...(item.newTab && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
          >
            {getTranslatedLabel(item.name, item.label, t, item.label)}
          </Link>
        ),
      )}

      {/* Mobile CTA buttons */}
      <div className="flex flex-col">
        <div className="flex flex-col space-y-3 my-8 border-t border-slate-400 dark:border-slate-50 "></div>
        <Link
          prefetch
          href="/dashboard"
          onClick={handleLinkClick}
          className={`hover:text-white transition-colors duration-200 p-2 w-full justify-start ${liStyle}`}
        >
          {t.navigation?.dashboard || "Dashboard"}
        </Link>
      </div>
      <div className="py-12">
        <DonationBtn />
      </div>
    </div>
  );
};

const MobileNav = ({ closeMenu }: { closeMenu: () => void }) => {
  return (
    <div className="flex flex-col h-[90%] ">
      <div className="flex-1">
        <MobileNavLinks closeMenu={closeMenu} />
      </div>

      <SocialIcons newTab={true} />
    </div>
  );
};

const Navigation = () => {
  const { dark, setDark } = useDarkModeContext();
  const [openSearch, setOpenSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(prefersDark.matches);

    const listener = (e: MediaQueryListEvent) => setDark(e.matches);
    prefersDark.addEventListener("change", listener);

    return () => prefersDark.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    const html: HTMLElement = document.querySelector("html")!;
    const body: HTMLBodyElement = document.querySelector("body")!;
    if (dark) {
      html.classList.add("dark");
      body.classList.add(
        "bg-slate-900",
        "text-white",
        "transition",
        "duration-500",
      );
    } else {
      html.classList.remove("dark");
      body.classList.remove(
        "bg-slate-900",
        "text-white",
        "transition",
        "duration-500",
      );
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-300 dark:border-slate-600 backdrop-blur supports-[backdrop-filter]:bg-nav-background/95 z-[200]">
      <div className="mx-auto w-full max-w-7xl px-2 md:px-4">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link prefetch href="/" className="shrink-0 hover:cursor-pointer">
            <Logo theme={dark} />
          </Link>

          {/* Desktop & Tablet Nav */}
          <nav className="hidden xl:flex flex-1 justify-center max-w-4xl mx-8">
            <NavLinks
              classes="w-full justify-start"
              closeMenu={() => setIsOpen(false)}
            />
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenSearch(true)}
              className="p-2 hover:bg-nav-hover-bg cursor-pointer hover:text-black dark:hover:text-white"
            >
              <Search className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <SearchBar openSearch={openSearch} setOpenSearch={setOpenSearch} />

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDark(!dark)}
              className="p-2 hover:bg-nav-hover-bg cursor-pointer hover:text-black dark:hover:text-white"
            >
              {dark ? (
                <Sun className="h-5 w-5 md:h-6 md:w-6" />
              ) : (
                <Moon className="h-5 w-5 md:h-6 md:w-6" />
              )}
            </Button>

            {/* Desktop donation button */}
            <div className="hidden xl:flex">
              <DonationBtn />
            </div>

            {/* Mobile menu */}
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
                className="bg-nav-background border-nav-border min-h-screen w-[300px] sm:w-[350px] bg-slate-50 dark:bg-slate-900"
              >
                <MobileNav closeMenu={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
