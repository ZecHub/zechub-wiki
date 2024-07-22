// components/Cards.tsx

import React from 'react';
import styles from './Cards.module.css';

interface CardsProps {
  title: string;
  imageSrc: string;
  link: string;
  children?: React.ReactNode;
}

const Cards: React.FC<CardsProps> = ({ title, imageSrc, link, children }) => {
  return (
    <div className={styles.card}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={imageSrc} alt={title} className={styles.image} />
        <h2 className={styles.title}>{title}</h2>
      </a>
      {children}
    </div>
  );
};


export default Cards;
