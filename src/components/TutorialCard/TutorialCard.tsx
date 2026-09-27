"use client";
import { useEffect, useState } from "react";
import styles from "./TutorialCard.module.css";
import { Tutorial } from "@/data/tutorials";

interface Props {
  tutorial: Tutorial;
}

export default function TutorialCard({ tutorial }: Props) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setPlaying(false);
    document.addEventListener("keydown", closeOnEscape);
    document.documentElement.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.documentElement.style.scrollbarGutter = "";
      document.body.style.overflow = "";
    };
  }, [playing]);

  return (
    <article className={styles.card}>
      <button className={styles.thumbnailButton} type="button" onClick={() => setPlaying(true)} aria-label={`Play ${tutorial.title} here`}>
        <div className={styles.thumbnail} role="img" aria-label={tutorial.title}>
          <img src={`https://i.ytimg.com/vi/${tutorial.videoId}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className={styles.playIcon} aria-hidden="true">▶</span>
        </div>
      </button>

      <div className={styles.body}>
        <span className={styles.category}>{tutorial.category}</span>

        <h3>{tutorial.title}</h3>

        <div className={styles.actions}>
          <button className={styles.playLink} type="button" onClick={() => setPlaying(true)}>Play here <span aria-hidden="true">▶</span></button>
          <a href={`https://youtube.com/watch?v=${tutorial.videoId}`} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
        </div>
      </div>
      {playing && <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPlaying(false)}>
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={tutorial.title}>
          <button className={styles.closeButton} type="button" onClick={() => setPlaying(false)} aria-label="Close video">×</button>
          <div className={styles.playerFrame}>
            <iframe src={`https://www.youtube-nocookie.com/embed/${tutorial.videoId}?rel=0`} title={tutorial.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
          <h2>{tutorial.title}</h2>
        </div>
      </div>}
    </article>
  );
}
