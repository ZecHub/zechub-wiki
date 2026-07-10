// pages/tutorials.tsx

import React from 'react';
import Cards from '@/components/Cards/Cards';
import LiteYouTube from '@/components/LiteYouTube';
import styles from './Tutorials.module.css';

// Extract a YouTube id from either an /embed/<id> or a watch?v=<id> URL.
const youTubeId = (url: string): string =>
  url.match(/(?:embed\/|[?&]v=)([\w-]+)/)?.[1] ?? '';

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
            <LiteYouTube
              videoId={youTubeId(tutorial.videoSrc)}
              title={tutorial.title}
              style={{ width: 560, height: 315, maxWidth: '100%' }}
            />
          </Cards>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
