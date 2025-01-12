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
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={imageSrc} alt={title} className={styles.image} />
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.body}>
        <p className={styles.description}>
          {description}
        </p>
        {children}
      </div>
      <div className={styles.footer}>
        <a className={styles.link} href={link} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </div>
    </div>

  );
};

export default ProjectCards;
