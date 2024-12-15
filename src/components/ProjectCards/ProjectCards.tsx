// components/Cards.tsx

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
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={imageSrc} alt={title} className={styles.image} />
        <h2 className={styles.title}>{title}</h2>
      </a>
      <p className={styles.description}>
        {description}
        <a
          className={styles.para}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
        </a>
      </p>
      {children}
    </div>
  );
};

export default ProjectCards;
