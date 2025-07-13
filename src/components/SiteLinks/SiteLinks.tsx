// components/ProjectRow.tsx
import React from "react";
import styles from "./SiteLinks.module.css";
import Link from "next/link";

const SiteLinks: React.FC = () => {
  return (
    <div className={styles.sitemap_container}>
      <div className={styles.elementor_sitemap_wrap}>
        <div className={styles.elementor_sitemap_section}>
          <h2 className="elementor_sitemap_title elementor-sitemap-page-title">
            Pages
          </h2>
          <ul className="elementor-sitemap-list elementor-sitemap-page-list">
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-15">
              <Link href="/">Homepage</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-22">
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-9">
              <Link href="/donation">Donation</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-9">
              <Link href="/contribute/help-build-zechub">Contribute</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-3">
              <Link href="/dao">Dao</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5668">
              <Link href="/brand/">Brand</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5470">
              <Link href="/wallets">Wallets</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-122">
              <Link href="/sitemap/">Sitemap</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-15">
              <Link target="_blank" href="https://youtube.com/@zechub">
                Tutorials
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.elementor_sitemap_section}>
          <h2 className="elementor_sitemap_title elementor-sitemap-question-title">
            Guides
          </h2>
          <ul className="elementor-sitemap-list elementor-sitemap-question-list">
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6014">
              <Link href="/guides/zgo-payment-processor">Zgo Payment Processor</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6016">
              <Link href="/guides/free2z-live">Free2z Livestreaming</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5992">
              <Link href="/guides/raspberry-pi-4-full-node">
                Raspberry Pi Zcashd Node
              </Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6010">
              <Link
                target="_blank"
                href="https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5"
              >
                Raspberry Pi Zebra Node
              </Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5989">
              <Link href="/guides/akash-network">Akash Network</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5987">
              <Link href="/guides/visualizing-zcash-addresses">
                Visualizing Zcash Addresses
              </Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5969">
              <Link href="/guides/zero-knowledge-vs-decoys">
                Zero Knowledge vs Decoy Systems
              </Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5321">
              <Link href="#">Use Zcash</Link>
              <ul className="children">
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5482">
                  <Link href="/using-zcash/buying-zec">Buying ZEC</Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5450">
                  <Link href="/using-zcash/centralizedswaps">Exchanges</Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5434">
                  <Link href="/using-zcash/blockchain-explorers">
                    Block Explorers
                  </Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5373">
                  <Link href="/using-zcash/shielded-pools">Shielded Pools</Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <Link href="/using-zcash/transparent-exchange-addresses">
                    Transparent Exchange Addresses
                  </Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <Link href="/using-zcash/transactions/">Transactions</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className={styles.elementor_sitemap_section}>
          <h2 className="elementor_sitemap_title elementor-sitemap-partner-title">
            Ecosystem
          </h2>
          <ul className="elementor-sitemap-list elementor-sitemap-partner-list">
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6280">
              <Link href="/zcash-community/arborist-calls">Aborist Calls</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6169">
              <Link href="/zcash-community/community-links">Community Links</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6142">
              <Link target="_blank" href="https://forum.zcashcommunity.com/">
                Community Forum
              </Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6037">
              <Link href="/zcash-community/community-projects">
                Community Projects
              </Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5908">
              <Link href="/zcash-community/zcash-global-ambassadors">
                Zcash Global Ambassadors
              </Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5612">
              <Link href="/zcash-community/zcap">ZCAP</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5620">
              <Link href="/zcash-community/zcash-podcasts">Zcash Podcasts</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5628">
              <Link href="/zcash-community/zcon-archive">Zcon Archive</Link>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5321">
              <Link href="#">Organizations</Link>
              <ul className="children">
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5482">
                  <Link href="/zcash-organizations/electric-coin-company">
                    Electric Coin Company
                  </Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5450">
                  <Link href="/zcash-organizations/zcash-foundation">
                    Zcash Foundation
                  </Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5434">
                  <Link href="/zcash-organizations/zcash-community-grants">
                    Zcash Community Grants
                  </Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5373">
                  <Link href="/zcash-organizations/zcash-community-grants">
                    Financial Privacy Foundation
                  </Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <Link href="/zcash-organizations/shielded-labs">Shielded Labs</Link>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <Link href="/zcash-organizations/zingo-labs">Zingo Labs</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SiteLinks;
