import { BsDiscord as Discord } from 'react-icons/bs'
import { RiTwitterXFill as Twitter, RiGithubFill as Github } from "react-icons/ri";

export const navigations = [
  {
    name: "Use ZEC",
    links: [
      {
        subName: 'Using ZEC',
        path: "/site/Using_Zcash/Using_ZEC"
      },
      {
        subName: 'Wallets',
        path: "/site/Using_Zcash/Wallets"
      },
      {
        subName: 'Non-Custodial Exchanges',
        path: "/site/Using_Zcash/Non-Custodial_Exchanges"
      }
    ]
  },
  {
    name: "Ecosystem",
    links: [
      {
        subName: 'Zcash Community',
        path: "/site/Zcash_Community/Community_Links"
      },
      {
        subName: 'Zcash Security',
        path: "/site/Zcash_Community/Zcash_Ecosystem_Security"
      },
      {
        subName: 'Development Fund',
        path: "/site/Zcash_Community/Zcon_Archive"
      }
    ],
  },
  {
    name: "Organizations",
    links: [
      {
        subName: 'ECC',
        path: "/site/Zcash_Organizations/Shielded_Labs"
      },
      {
        subName: 'Zcash Fundation',
        path: "/site/Zcash_Organizations/Zcash_Foundation"
      },
      {
        subName: 'ZCG',
        path: "/site/Zcash_Organizations/Zcash_Community_Grants"
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
        path: "/site/Glossary_&_FAQ's/Faqs",
      },
      {
        subName: 'Zcash Library',
        path: "/site/Glossary_&_FAQ's/Zcash_Library"
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

