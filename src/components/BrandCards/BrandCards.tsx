import React from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./BrandCards.module.css";

interface CardsProps {
  title: string;
  imageSrc: string | any;
  link: string;
  description: string;
  size: number;
  children?: React.ReactNode;
}

const BrandCards: React.FC<CardsProps> = ({
  title,
  imageSrc,
  link,
  description,
  size,
  children,
}) => {
  return (
    <div className={`${styles.card} dark:bg-slate-800`}>
      <div className={styles.header}>
        <Image
          src={imageSrc}
          alt={title}
          className={styles.image}
          width={size}
          height={size}
          style={{ height: size }}
        />
      </div>
      <div className={styles.body}>
        <h2 className={`dark:text-slate-300 ${styles.title}`}>{title}</h2>
        <p className={`${styles.description} dark:text-slate-400`}>
          {description}
        </p>
        {children}
      </div>
      <div className={styles.footer}>
        <a
          className={`${styles.link}  dark:text-[#83cbf8] mb-6`}
          href={link}
          download={`${title}.zip`}
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default BrandCards;
