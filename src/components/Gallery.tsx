import React, { useState, useEffect } from 'react';
import styles from '../../components/Gallery.module.css';

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const importAll = (r: any): string[] => r.keys().map(r);

      try {
        const images = importAll(
          (require as any).context('/public/gallery', false, /\.(png|jpe?g|svg|gif)$/)
        );
        setImages(images.map((image: any) => image.default.src));
      } catch (error) {
        console.error("Error loading images: ", error);
      }
    }
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <div className={styles.galleryContainer}>
        {images.length === 0 && <p>No images found.</p>}
        {images.map((src, index) => (
          <div key={index} className={styles.imageContainer}>
            <img src={src} alt={`Gallery Image ${index}`} className={styles.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
