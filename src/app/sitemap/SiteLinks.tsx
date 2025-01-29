// components/ProjectRow.tsx
import React from "react";
import styles from "./SiteLinks.module.css";

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
              <a href="/">Homepage</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-22">
              <a href="/dashboard">Dashboard</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-9">
              <a href="/donation">Donation</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-9">
              <a href="/contribute/help-build-zechub">Contribute</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-3">
              <a href="/dao">Dao</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5668">
              <a href="/brand/">Brand</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5470">
              <a href="/wallets">Wallets</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-122">
              <a href="/sitemap/">Sitemap</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-15">
              <a target="_blank" href="https://youtube.com/@zechub">
                Tutorials
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.elementor_sitemap_section}>
          <h2 className="elementor_sitemap_title elementor-sitemap-question-title">
            Guides
          </h2>
          <ul className="elementor-sitemap-list elementor-sitemap-question-list">
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6014">
              <a href="/guides/zgo-payment-processor">Zgo Payment Processor</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6016">
              <a href="/guides/free2z-live">Free2z Livestreaming</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5992">
              <a href="/guides/raspberry-pi-4-full-node">
                Raspberry Pi Zcashd Node
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6010">
              <a
                target="_blank"
                href="https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5"
              >
                Raspberry Pi Zebra Node
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5989">
              <a href="/guides/akash-network">Akash Network</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5987">
              <a href="/guides/visualizing-zcash-addresses">
                Visualizing Zcash Addresses
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5969">
              <a href="/guides/zero-knowledge-vs-decoys">
                Zero Knowledge vs Decoy Systems
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5321">
              <a href="#">Use Zcash</a>
              <ul className="children">
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5482">
                  <a href="/using-zcash/buying-zec">Buying ZEC</a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5450">
                  <a href="/using-zcash/non-custodial-exchanges">Exchanges</a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5434">
                  <a href="/using-zcash/blockchain-explorers">
                    Block Explorers
                  </a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5373">
                  <a href="/using-zcash/shielded-pools">Shielded Pools</a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <a href="/using-zcash/transparent-exchange-addresses">
                    Transparent Exchange Addresses
                  </a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <a href="/using-zcash/transactions/">Transactions</a>
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
              <a href="/zcash-community/arborist-calls">Aborist Calls</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6169">
              <a href="/zcash-community/community-links">Community Links</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6142">
              <a target="_blank" href="https://forum.zcashcommunity.com/">
                Community Forum
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6037">
              <a href="/zcash-community/community-projects">
                Community Projects
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5908">
              <a href="/zcash-community/zcash-global-ambassadors">
                Zcash Global Ambassadors
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5612">
              <a href="/zcash-community/zcap">ZCAP</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5620">
              <a href="/zcash-community/zcash-podcasts">Zcash Podcasts</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5628">
              <a href="/zcash-community/zcon-archive">Zcon Archive</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5321">
              <a href="#">Organizations</a>
              <ul className="children">
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5482">
                  <a href="/zcash-organizations/electric-coin-company">
                    Electric Coin Company
                  </a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5450">
                  <a href="/zcash-organizations/zcash-foundation">
                    Zcash Foundation
                  </a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5434">
                  <a href="/zcash-organizations/zcash-community-grants">
                    Zcash Community Grants
                  </a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5373">
                  <a href="/zcash-organizations/zcash-community-grants">
                    Financial Privacy Foundation
                  </a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <a href="/zcash-organizations/shielded-labs">Shielded Labs</a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <a href="/zcash-organizations/zingo-labs">Zingo Labs</a>
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
