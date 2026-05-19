// pages/tutorials.tsx

import React from 'react';
import Cards from '../../components/Cards/Cards';
import styles from './Tutorials.module.css';

const Tutorials: React.FC = () => {
  const exchangeTutorials = [
    {
      title: 'Buy ZEC in Gemini Exchange',
      imageSrc: 'https://img.shields.io/badge/Edit-blue',
      videoSrc: 'https://www.youtube.com/embed/REUbkLzK7J4?si=_IwaZ-h7pNzyFCik',
      link: 'https://github.com/zechub/zechub/edit/main/site/tutorials/Exchanges.md',
    },
    {
      title: 'Using Atomix DEX',
      imageSrc: 'https://img.shields.io/badge/Edit-blue',
      videoSrc: 'https://www.youtube.com/watch?v=TwKQE8X7McA',
      link: 'https://github.com/zechub/zechub/edit/main/site/tutorials/Exchanges.md',
    },
    {
      title: 'Buying Zcash on Coinbase to Shield',
      imageSrc: 'https://img.shields.io/badge/Edit-blue',
      videoSrc: 'https://www.youtube.com/watch?v=3xyKKer1Qvk',
      link: 'https://github.com/zechub/zechub/edit/main/site/tutorials/Exchanges.md',
    },
    {
      title: 'Sideshift Exchange Shielded Zcash',
      imageSrc: 'https://img.shields.io/badge/Edit-blue',
      videoSrc: 'https://www.youtube.com/watch?v=joQtS8QUpdg',
      link: 'https://github.com/zechub/zechub/edit/main/site/tutorials/Exchanges.md',
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Explore Zcash</h1>
      <div className={styles.cardContainer}>
        {exchangeTutorials.map((tutorial) => (
          <Cards
            key={tutorial.title}
            title={tutorial.title}
            imageSrc={tutorial.imageSrc}
            link={tutorial.link}
          >
            <iframe
              width="560"
              height="315"
              src={tutorial.videoSrc}
              title={tutorial.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Cards>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
