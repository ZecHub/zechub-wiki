// src/components/Row/Row.tsx
import React from "react";
import { Card } from "../Card/Card";

type Project = {
  title: string;
  description: string;
  link: string;
  imageUrl: string; 
  size?: number;
  manual?: {
    url: string;
    ctaLabel: string;
  };
};

const projects: Project[] = [
  {
    title: "Zcash",
    description:
      "Zcash is a digital currency providing censorship resistant, secure & private payments",
    link: "/downloads/brand/Zcash.zip",
    imageUrl: "/images/brand/zcash.jpg",
    size: 240,
  },
  {
    title: "Wallets",
    description: "Brand Assets for all Zcash Shielded Wallets",
    link: "/downloads/brand/All_Wallets.zip",
    imageUrl: "/images/brand/wallets.jpg",
    size: 150,
  },
  {
    title: "Zcash Brasil",
    description: "Brand Assets for the Zcash Brazil Ambassador Program",
    link: "/downloads/brand/ZcashBrasil.zip",
    imageUrl: "/images/brand/zcashbrasil.jpg",
    size: 200,
  },
  {
    title: "ZecHub",
    description:
      "ZecHub is the community-driven education hub for the Zcash cryptocurrency (ZEC).",
    link: "/downloads/brand/ZecHub.zip",
    imageUrl: "/images/brand/zechub.jpg",
    size: 200,
    manual: {
      url: "https://heyzine.com/flip-book/4d4f08fac9.html",
      ctaLabel: "ZecHub Visual Brand",
    },
  },
  {
    title: "ECC",
    description:
      "Electric Coin Co. (ECC) created and launched the Zcash digital currency in 2016.",
    link: "/downloads/brand/ECC.zip",
    imageUrl: "/images/brand/ecc.jpg",
    size: 200,
  },
  {
    title: "Zcash En Español",
    description:
      "Zcash en Español provides Spanish resources, news, guides, and community support for Zcash users.",
    link: "/downloads/brand/ZcashEspanol.zip",
    imageUrl: "/images/brand/zcashespanol.jpg",
    size: 240,
  },
  {
    title: "Zcash Ukraine",
    description:
      "A community-led hub bridging Zcash to Turkey, empowering users with financial privacy through localized education, grassroots activism for global sovereignty.",
    link: "/downloads/brand/zcashUkraine.zip",
    imageUrl: "/images/brand/zcashukraine.jpg",
    size: 200,
  },
  {
    title: "Zcash Nigeria",
    description:
      "Zcash Nigeria promotes financial privacy by educating and onboarding Nigerians to Zcash",
    link: "/downloads/brand/ZcashNigeria.zip",
    imageUrl: "/images/brand/zcashnigeria.jpg",
    size: 190,
  },
];

const Row: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <Card
          key={project.title}
          thumbnailImageHeight={100}
          thumbnailImageWidth={500}
          thumbnailImage={project.imageUrl}
          description={project.description}
          title={project.title}
          url={project.link}
          ctaLabel="Download"
          manual={project.manual}
        />
      ))}
    </div>
  );
};

export default Row;
