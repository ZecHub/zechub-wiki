import { BsDiscord as Discord } from 'react-icons/bs'
import { RiTwitterXFill as Twitter, RiGithubFill as Github } from "react-icons/ri";

export const navigations = [
  {
    name: "Use ZEC",
    links: [
      {
        subName: 'Using ZEC',
        path: "/site/usingzcash/Using_ZEC"
      },
      {
        subName: 'Wallets',
        path: "/site/usingzcash/Wallets"
      },
      {
        subName: 'Non-Custodial Exchanges',
        path: "/site/usingzcash/Non-Custodial_Exchanges"
      }
    ]
  },
  {
    name: "Ecosystem",
    links: [
      {
        subName: 'Zcash Community',
        path: "/site/zcashcommunity/Community_Links"
      },
      {
        subName: 'Zcash Security',
        path: "/site/zcashcommunity/Zcash_Ecosystem_Security"
      },
      {
        subName: 'Development Fund',
        path: "/site/zcashcommunity/Zcon_Archive"
      }
    ],
  },
  {
    name: "Organizations",
    links: [
      {
        subName: 'ECC',
        path: "/site/zcashbasics/shieldedlabs"
      },
      {
        subName: 'Zcash Fundation',
        path: "/site/zcashbasics/zcashfoundation"
      },
      {
        subName: 'ZCG',
        path: "/site/zcashbasics/zcashcommunitygrants"
      }
    ]
  },
  {
    name: "Guides",
    links: [
      {
        subName: 'Zgo Payment',
        path: "/site/guides/Zgo_Payment_Processor",
      },
      {
        subName: 'Free2z',
        path: "/site/guides/Free2z_Live"
      },
      {
        subName: 'Full Nodes',
        path: "/site/guides/Full_Nodes"
      }
    ]
  },
  {
    name: `Glossary & FAQ's`,
    links: [
      {
        subName: `FAQ's`,
        path: "/site/glossaryandzcashfaqs/Faqs",
      },
      {
        subName: 'Zcash Library',
        path: "/site/glossaryandzcashfaqs/Zcash_Library"
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

