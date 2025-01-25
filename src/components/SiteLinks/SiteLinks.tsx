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
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5668">
              <a href="https://z.cash/press/">Zcash Media Kit</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5321">
              <a href="https://z.cash/upgrade/">Upgrade</a>
              <ul className="children">
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5482">
                  <a href="https://z.cash/upgrade/network-upgrade-5/">
                    Network Upgrade 5
                  </a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5470">
                  <a href="https://z.cash/upgrade/canopy/">Canopy</a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5450">
                  <a href="https://z.cash/upgrade/heartwood/">Heartwood</a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5434">
                  <a href="https://z.cash/upgrade/blossom/">Blossom</a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5373">
                  <a href="https://z.cash/upgrade/sapling/">Sapling</a>
                </li>
                <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-5323">
                  <a href="https://z.cash/upgrade/overwinter/">Overwinter</a>
                </li>
              </ul>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-122">
              <a href="https://z.cash/sitemap/">Sitemap</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-22">
              <a href="https://z.cash/network/">Network Information</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-9">
              <a href="https://z.cash/community-hub/">Community Hub</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-15">
              <a href="https://z.cash/">Homepage</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-page page_item page-item-3">
              <a href="https://z.cash/privacy-policy/">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className={styles.elementor_sitemap_section}>
          <h2 className="elementor_sitemap_title elementor-sitemap-question-title">
            Learn
          </h2>
          <ul className="elementor-sitemap-list elementor-sitemap-question-list">
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6014">
              <a href="https://z.cash/learn/run-a-zcash-full-node/">
                Run a Zcash full node
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6016">
              <a href="https://z.cash/learn/download-zebra/">Download Zebra</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5992">
              <a href="https://z.cash/learn/how-to-buy-and-use-zcash-orchard/">
                How to buy and use Zcash Orchard
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-6010">
              <a href="https://z.cash/learn/how-to-run-a-zcash-full-node/">
                How to run a Zcash Full Node
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5989">
              <a href="https://z.cash/learn/how-to-spend-your-zcash-on-everyday-items/">
                How to spend your Zcash on everyday items
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5987">
              <a href="https://z.cash/learn/comparing-on-chain-privacy-technologies/">
                Comparing on-chain Privacy Technologies
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5969">
              <a href="https://z.cash/learn/useful-tips-when-using-zcash/">
                Useful Tips when using Zcash
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5559">
              <a href="https://z.cash/learn/does-zcash-contain-a-backdoor/">
                Does Zcash contain a backdoor?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-5163">
              <a href="https://z.cash/learn/what-are-zk-snarks/">
                What are zk-SNARKs?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-2758">
              <a href="https://z.cash/learn/who-funds-zcash/">
                Who funds Zcash?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-4918">
              <a href="https://z.cash/learn/how-to-use-zcash/">
                How to use Zcash
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-2772">
              <a href="https://z.cash/learn/whats-the-best-zcash-wallet/">
                What’s the best Zcash wallet?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-2769">
              <a href="https://z.cash/learn/what-is-halo-for-zcash/">
                What is Halo for Zcash?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-2766">
              <a href="https://z.cash/learn/does-zcash-have-a-max-supply/">
                Does Zcash have a max supply?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-2762">
              <a href="https://z.cash/learn/whats-the-best-zcash-exchange/">
                What’s the best Zcash exchange?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-2755">
              <a href="https://z.cash/learn/what-are-zero-knowledge-proofs/">
                What are zero-knowledge proofs?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-2729">
              <a href="https://z.cash/learn/what-is-the-difference-between-zcash-and-zec/">
                What is the difference between Zcash and ZEC?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-417">
              <a href="https://z.cash/learn/who-created-zcash/">
                Who created Zcash?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-2751">
              <a href="https://z.cash/learn/what-is-the-difference-between-shielded-and-transparent-zcash/">
                What is the difference between shielded and transparent Zcash?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-3421">
              <a href="https://z.cash/learn/is-bitcoin-private/">
                Is Bitcoin private?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-424">
              <a href="https://z.cash/learn/can-i-make-money-mining-zcash/">
                Can I make money mining Zcash?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-414">
              <a href="https://z.cash/learn/where-can-i-use-or-spend-zcash/">
                Where can I use or spend Zcash?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-411">
              <a href="https://z.cash/learn/what-are-zcash-unified-addresses/">
                What are Zcash unified addresses?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-407">
              <a href="https://z.cash/learn/is-zcash-traceable/">
                Is Zcash traceable?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-403">
              <a href="https://z.cash/learn/why-is-privacy-so-important/">
                Why is privacy so important?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-388">
              <a href="https://z.cash/learn/what-are-the-economics-of-zcash/">
                What are the economics of Zcash?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-385">
              <a href="https://z.cash/learn/how-is-zcash-different-than-bitcoin/">
                How is Zcash different than Bitcoin?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-3417">
              <a href="https://z.cash/learn/whats-the-point-of-zcash/">
                What’s the point of Zcash?
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-question page_item page-item-382">
              <a href="https://z.cash/learn/what-is-zcash/">What is Zcash?</a>
            </li>
          </ul>
        </div>
        <div className={styles.elementor_sitemap_section}>
          <h2 className="elementor_sitemap_title elementor-sitemap-partner-title">
            Ecosystem
          </h2>
          <ul className="elementor-sitemap-list elementor-sitemap-partner-list">
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6280">
              <a href="https://z.cash/ecosystem/shielded-labs/">
                Shielded Labs
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6169">
              <a href="https://z.cash/ecosystem/kucoin/">Kucoin</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6142">
              <a href="https://z.cash/ecosystem/stealthex/">StealthEx</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-6037">
              <a href="https://z.cash/ecosystem/zashi-wallet/">
                Zashi mobile wallet
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5908">
              <a href="https://z.cash/ecosystem/zcash-media-kit/">
                Zcash Media Kit
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5612">
              <a href="https://z.cash/ecosystem/zf-a-v-club/">ZF A/V Club</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5620">
              <a href="https://z.cash/ecosystem/bootstrap/">Bootstrap</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-5628">
              <a href="https://z.cash/ecosystem/zcash-global/">Zcash Global</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-4785">
              <a href="https://z.cash/ecosystem/filecoin-ecc-grants/">
                Filecoin + ECC Grants
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-4780">
              <a href="https://z.cash/ecosystem/zingo/">Zingo!</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-4775">
              <a href="https://z.cash/ecosystem/unstoppable/">Unstoppable</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-3093">
              <a href="https://z.cash/ecosystem/zechub/">ZecHub</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-3089">
              <a href="https://z.cash/ecosystem/zcash-media/">Zcash Media</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-3084">
              <a href="https://z.cash/ecosystem/read-the-docs/">
                Read the Docs
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-3080">
              <a href="https://z.cash/ecosystem/github/">Github</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2317">
              <a href="https://z.cash/ecosystem/zgo/">ZGo</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2314">
              <a href="https://z.cash/ecosystem/official-zcash-wallet-sdks/">
                Official Zcash Wallet SDKs
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2307">
              <a href="https://z.cash/ecosystem/messari/">Messari</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2301">
              <a href="https://z.cash/ecosystem/flyp-me/">Flyp.me</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2289">
              <a href="https://z.cash/ecosystem/poloniex/">Poloniex</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2283">
              <a href="https://z.cash/ecosystem/bitfinex/">Bitfinex</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2278">
              <a href="https://z.cash/ecosystem/airtm/">Airtm</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2273">
              <a href="https://z.cash/ecosystem/zcash-community-grants/">
                Zcash Community Grants
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2269">
              <a href="https://z.cash/ecosystem/electric-coin-company/">
                Electric Coin Company
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2265">
              <a href="https://z.cash/ecosystem/zcash-foundation/">
                Zcash Foundation
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2255">
              <a href="https://z.cash/ecosystem/zec-block-explorer/">
                ZEC Block Explorer
              </a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2251">
              <a href="https://z.cash/ecosystem/bitquery/">Bitquery</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2244">
              <a href="https://z.cash/ecosystem/blockchair/">Blockchair</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2240">
              <a href="https://z.cash/ecosystem/bitgo/">BitGo</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2236">
              <a href="https://z.cash/ecosystem/fireblocks/">Fireblocks</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2230">
              <a href="https://z.cash/ecosystem/giving-block/">Giving Block</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2213">
              <a href="https://z.cash/ecosystem/coindcx/">CoinDCX</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2208">
              <a href="https://z.cash/ecosystem/changenow/">ChangeNOW</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2203">
              <a href="https://z.cash/ecosystem/flexa/">Flexa</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2185">
              <a href="https://z.cash/ecosystem/kraken/">Kraken</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2150">
              <a href="https://z.cash/ecosystem/binance/">Binance</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2087">
              <a href="https://z.cash/ecosystem/zcashd/">Zcashd</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2082">
              <a href="https://z.cash/ecosystem/zebrad/">Zebrad</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-2034">
              <a href="https://z.cash/ecosystem/trezor/">Trezor</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-1988">
              <a href="https://z.cash/ecosystem/qedit/">QEDIT</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-1961">
              <a href="https://z.cash/ecosystem/free2z/">Free2z</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-1778">
              <a href="https://z.cash/ecosystem/coinbase/">Coinbase</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-1114">
              <a href="https://z.cash/ecosystem/nighthawk/">Nighthawk</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-831">
              <a href="https://z.cash/ecosystem/edge-wallet/">Edge Wallet</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-222">
              <a href="https://z.cash/ecosystem/ywallet/">Ywallet</a>
            </li>
            <li className="elementor-sitemap-item elementor-sitemap-item-partner page_item page-item-207">
              <a href="https://z.cash/ecosystem/gemini/">Gemini</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SiteLinks;
