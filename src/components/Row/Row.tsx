// components/ProjectRow.tsx
import React from "react";
import BrandCards from "../BrandCards/BrandCards";
import ecc from "../../assets/brand/ECC/JPG/ECCBlack.jpg";
import wallet from "../../assets/brand/Wallets/Zashi/JPG/ZashiIconBlack.jpg";
import zcash from "../../assets/brand/Zcash/JPG/Primary Brandmark/Brandmark Yellow.jpg";
import zcashBrasil from "../../assets/brand/ZcashBrasil/JPG/ZcashBRBlack.jpg";
import zechub from "../../assets/brand/ZecHub/JPG/ZecHubBlue.jpg";
import styles from "./Row.module.css";

const projects = [
  {
    title: "ECC",
    description: "Electric Coin Co. (ECC) created and launched the Zcash digital currency in 2016.",
    link: "/downloads/brand/ECC.zip",
    imageUrl: ecc,
    size: 200,
  },
  {
    title: "Wallets",
    description: "Brand Assets for all Zcash Shielded Wallets",
    link: "/downloads/brand/Wallets.zip",
    imageUrl: wallet,
    size: 150,
  },
  {
    title: "Zcash",
    description: "Zcash is a digital currency providing censorship resistant, secure & private payments",
    link: "/downloads/brand/Zcash.zip",
    imageUrl: zcash,
    size: 240,
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
    description: "ZecHub is the community driven education hub for the Zcash cryptocurrency (ZEC)." 
    link: "/downloads/brand/ZecHub.zip",
    imageUrl: zechub,
    size: 200,
  },
];

const Row: React.FC = () => {
  return (
    <div className={styles.project_row}>
      {projects.map((project, index) => (
        <BrandCards
          key={index}
          title={project.title}
          description={project.description}
          link={project.link}
          imageSrc={project.imageUrl}
          size={project.size}
        />
      ))}
    </div>
  );
};

export default Row;
