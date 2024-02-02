import { BsDiscord as Discord } from 'react-icons/bs'
import { RiTwitterXFill as Twitter, RiGithubFill as Github } from "react-icons/ri";

export const navigations = [
  {
    name: 'Use ZEC',
    links: [
      { 
        subName: 'Using ZEC',
        path: '/using-zcash/transactions'
      },
      {
        subName: 'Wallets',
        path: '/using-zcash/wallets'
      },
      {
        subName: 'Non-Custodial Exchanges',
        path: '/using-zcash/non-custodial-exchanges'
      }
    ]
  },
  {
    name: 'Ecosystem',
    links: [
      {
        subName: 'Arborist Calls',
        path: '/zcash-community/arborist-calls'
      },
      {
        subName: 'Community Links',
        path: '/zcash-community/community-links'
      },
      {
        subName: 'Zcash Global Ambassadors',
        path: '/zcash-community/zcash-global-ambassadors'
      },
    ],
  },
  {
    name: 'Organizations',
    links: [
      {
        subName: 'Electric Coin Company',
        path: '/zcash-organizations/electric-coin-company'
      },
      {
        subName: 'Zcash Foundation',
        path: '/zcash-organizations/zcash-foundation'
      },
      {
        subName: 'Zcash Commnuity Grants',
        path: '/zcash-organizations/zcash-community-grants'
      }
    ]
  },
  {
    name: 'Guides',
    links: [
      {
        subName: 'Zgo Payment Processor',
        path: '/guides/zgo-payment-processor'
      },
      {
        subName: 'Free2z',
        path: '/guides/free2z-live'
      },
      {
        subName: 'Full Nodes',
        path: '/guides/full-nodes'
      }
    ]
  },
  {
    name: "Glossary & FAQ's",
    links: [
      {
        subName: "FAQ's",
        path: '/glossary-and-faqs/faq'
      },
      {
        subName: 'Zcash Library',
        path: '/glossary-and-faqs/zcash-library'
      }
    ]
    
  },
];

export const socialNav = [
  {
    name: 'Discord',
    url: 'https://discord.gg/zcash',
    icon: Discord
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/zechub',
    icon: Twitter
  },
  {
    name: 'Github',
    url: 'https://github.com/ZecHub/zechub',
    icon: Github
  }
]
export const socialMedia = [
  {
    name: 'Youtube',
    link: 'https://youtube.com/@zechub'
  },
  {
    name: 'Newsletter',
    link: 'https://zechub.substack.com/'
  },
  {
    name: 'Podcast',
    link: 'https://www.youtube.com/watch?v=ILdMTGtVOD4&list=PL6_epn0lASLHlNCMtUErX8UfaJK6N9K5O'
  },
  {
    name: 'Extras',
    link: 'https://extras.zechub.xyz/'
  },
  {
    name: 'DAO',
    link: 'https://vote.zechub.xyz/'
  },
  {
    name: 'Store',
    link: 'https://zechub.store/'
  }
]

