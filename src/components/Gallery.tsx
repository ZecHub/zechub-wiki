import React, { useState, useEffect } from "react";
import styles from './Gallery.module.css'; 

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    
    const importAll = (r) => r.keys().map(r);
    const images = importAll(
      require.context("/public/gallery", false, /\.(png|jpe?g|svg|gif)$/)
    );
    setImages(images);
  }, []);

  return (
    <div className={styles.galleryContainer}>
      {images.map((image, index) => (
        <div key={index} className={styles.imageContainer}>
          <img src={image.default.src} alt={`Gallery Image ${index}`} className={styles.image} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
