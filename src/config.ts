import { BsDiscord as Discord } from 'react-icons/bs'
import { RiTwitterXFill as Twitter, RiGithubFill as Github } from "react-icons/ri";

export const navigations = [
  {
    name: "Use ZEC",
    links: [
      {
        subName: 'Using Zec',
        path: "site/usingzcash/usingzec"
      },
      {
        subName: 'Wallets',
        path: "site/usingzcash/wallets"
      },
      {
        subName: 'Non Custodials',
        path: "site/usingzcash/noncustodial"
      }
    ]
  },
  {
    name: "Ecosystem",
    links: [
      {
        subName: 'Zcash Comunity',
        path: "site/zcashcommunity/zcashcomunity"
      },
      {
        subName: 'Zcash Security',
        path: "site/zcashcommunity/zcashecosystemsecurity"
      },
      {
        subName: 'Development Fund',
        path: "site/zcashcommunity/developmentfund"
      }
    ],
  },
  {
    name: "Organizations",
    links: [
      {
        subName: 'ECC',
        path: "site/shieldedlabs"
      },
      {
        subName: 'Zcash Fundation',
        path: "site/zcashfundation"
      },
      {
        subName: 'ZCG',
        path: "site/zcashcomunitygrants"
      }
    ]
  },
  {
    name: "Guides",
    links: [
      {
        subName: 'Zgo Payment',
        path: "site/guides/zgopayments",
      },
      {
        subName: 'Namada Protocol',
        path: "site/guides/namadaProtocol"
      },
      {
        subName: 'Full Nodes',
        path: "site/guides/fullnodes"
      }
    ]
  },
  {
    name: "Glossary & FAQs",
    links: [
      {
        subName: 'Faqs',
        path: "site/glossaryandzcashfaqs/faqs",
      },
      {
        subName: 'Zcash Library',
        path: "site/guides/zcashlibrary"
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

export const cardsConfig = [
  {
    title: 'Zechub Wiki',
    content: 'ZEC is a digital currency that is based on the Zcash blockchain.',
    url: 'site/usingzcash/usingzec.md'
  },
  {
    title: 'Intro to Zcash Wallets',
    content: 'Wallets allow you to receive and spend Zcash. Some also support encrypted memos. Only you should have access to your wallet.',
    url: 'site/usingzcash/wallets.md'
  },
  {
    title: 'Zcash Resources',
    content: 'There are a number of resources that help users understand Zcash.',
    url: 'site/starthere/zcashresources.md'
  }
]
