import React, { useState, useEffect } from "react";
import styles from '../components/Gallery.module.css'; 

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    
    const importAll = (r: __WebpackModuleApi.RequireContext) =>
      r.keys().map(r);
    const images = importAll(
      require.context("/public/gallery", false, /\.(png|jpe?g|svg|gif)$/)
    );
    setImages(images.map((image: any) => image.default.src));
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <div className={styles.galleryContainer}>
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
