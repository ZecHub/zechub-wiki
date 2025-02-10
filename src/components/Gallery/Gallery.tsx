'use client';
import Image from "next/image";
import React, { useState, useEffect } from "react";
import styles from './Gallery.module.css'; 

const Gallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    
    const importAll = (r: any) => r.keys().map(r);
    const images = importAll(
      (require as any).context("/public/gallery", false, /\.(png|jpe?g|svg|gif)$/)
    );
    setImages(images.map((image: any) => image.default.src));
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <div className={styles.galleryContainer}>
        {images.map((src, index) => (
          <div key={index} className={styles.imageContainer}>
            <Image src={src} alt={`Gallery Image ${index}`} className={styles.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
