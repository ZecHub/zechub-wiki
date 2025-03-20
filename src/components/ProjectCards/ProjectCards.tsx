import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./ProjectCards.module.css";

interface CardsProps {
  title: string;
  imageSrc: string;
  link: string;
  description: string;
  children?: React.ReactNode;
}

const ProjectCards: React.FC<CardsProps> = ({
  title,
  imageSrc,
  link,
  description,
  children,
}) => {
  return (
    <div className={`${styles.card } dark:bg-slate-800`}>
      <div className={styles.header}>
        <Image src={imageSrc} alt={title} className={styles.image} />
        <h2 className={`dark:text-slate-300 ${styles.title}`}>{title}</h2>
      </div>
      <div className={styles.body}>
        <p className={`${styles.description} dark:text-slate-400`}>
          {description}
        </p>
        {children}
      </div>
      <div className={styles.footer}>
        <Link className={`${styles.link}  dark:text-[#83cbf8] mb-6`} href={link} target="_blank" rel="noopener noreferrer">
          Read more
        </Link>
      </div>
    </div>

  );
};

export default ProjectCards;
 