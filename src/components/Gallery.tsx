import React, { useState, useEffect } from 'react';
import styles from './Gallery.module.css';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    
    const importAll = (r: __WebpackModuleApi.RequireContext): string[] =>
      r.keys().map(r);

    try {
      const images = importAll(
        require.context('/public/gallery', false, /\.(png|jpe?g|svg|gif)$/)
      );
      setImages(images.map((image: any) => image.default.src));
    } catch (error) {
      console.error("Error loading images: ", error);
    }
  }, []);

  return (
    <div className={styles.galleryContainer}>
      {images.map((src, index) => (
        <div key={index} className={styles.imageContainer}>
          <img src={src} alt={`Gallery Image ${index}`} className={styles.image} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
