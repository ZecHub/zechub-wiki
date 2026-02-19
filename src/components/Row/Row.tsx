// components/ProjectRow.tsx
import React from "react";
import BrandCards from "../BrandCards/BrandCards";
import zcashNigeria from "../../assets/brand/ZcashNigeria/JPG/ZcashNigeria_White.jpg";
import zcashUkraine from "../../assets/brand/ZcashUkraine/Zcash_Ukraine.jpg";
import zcashEspanol from "../../assets/brand/ZcashEspanol/JPG/ZcashEspanol.jpg";
import ecc from "../../assets/brand/ECC/JPG/ECCBlack.jpg";
import wallet from "../../assets/brand/wallets/All_Wallets/zodl/Zodl_Logo_Black.jpg";
import zcash from "../../assets/brand/Zcash/JPG/Primary Brandmark/Brandmark Yellow.jpg";
import zcashBrasil from "../../assets/brand/ZcashBrasil/JPG/ZcashBRBlack.jpg";
import zechub from "../../assets/brand/ZecHub/JPG/ZecHubBlue.jpg";
import styles from "./Row.module.css";
import { Card } from "../Card/Card";

const projects = [
  {
    title: "Zcash",
    description:
      "Zcash is a digital currency providing censorship resistant, secure & private payments",
    link: "/downloads/brand/Zcash.zip",
    imageUrl: zcash,
    size: 240,
  },
  {
    title: "Wallets",
    description: "Brand Assets for all Zcash Shielded Wallets",
    link: "/downloads/brand/All_Wallets.zip",
    imageUrl: wallet,
    size: 150,
  },
  {
    title: "Zcash Brasil",
    description: "Brand Assets for the Zcash Brazil Ambassador Program",
    link: "/downloads/brand/ZcashBrasil.zip",
    imageUrl: zcashBrasil,
    size: 200,
  },
  {
    title: "Zechub",
    description:
      "ZecHub is the community-driven education hub for the Zcash cryptocurrency (ZEC).",
    link: "/downloads/brand/ZecHub.zip",
    imageUrl: zechub,
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
    imageUrl: ecc,
    size: 200,
  },
  {
    title: "Zcash En Español",
    description:
      "Zcash en Español provides Spanish resources, news, guides, and community support for Zcash users.",
    link: "downloads/brand/ZcashEspanol.zip",
    imageUrl: zcashEspanol,
    size: 240,
  },
  {
    title: "Zcash Ukraine",
    description:
      "A community-led hub bridging Zcash to Turkey, empowering users with financial privacy through localized education, grassroots activism for global sovereignty.",
    link: "downloads/brand/zcashUkraine.zip",
    imageUrl: zcashUkraine,
    size: 200,
  },
  {
    title: "Zcash Nigeria",
    description:
      "Zcash Nigeria promotes financial privacy by educating and onboarding Nigerians to Zcash",
    link: "downloads/brand/ZcashNigeria.zip",
    imageUrl: zcashNigeria,
    size: 190,
  },
];

const Row: React.FC = () => {
  return (
    <div
      className={
        "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      }
    >
      {projects.map((project, index) => (
        <Card
          thumbnailImageHeight={100}
          thumbnailImageWidth={500}
          thumbnailImage={project.imageUrl}
          description={project.description}
          title={project.title}
          url={project.link}
          key={project.title + "_" + Math.random() / index}
          ctaLabel="Download"
          manual={project.manual}
        />
      ))}
    </div>
  );
};

export default Row;


