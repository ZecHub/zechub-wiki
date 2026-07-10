import styles from "./TutorialCard.module.css";
import { Tutorial } from "@/data/tutorials";

interface Props {
  tutorial: Tutorial;
}

export default function TutorialCard({ tutorial }: Props) {
  return (
    <a
      href={`https://youtube.com/watch?v=${tutorial.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      {/* Branded placeholder instead of hotlinking img.youtube.com (which would
          contact Google on page load). The card still links out to YouTube. */}
      <div
        className={styles.thumbnail}
        role="img"
        aria-label={tutorial.title}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 120% at 50% 0%, #241633 0%, #0d1117 70%)",
        }}
      >
        <svg width="48" height="48" viewBox="0 0 68 48" aria-hidden="true">
          <path
            d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55 0 34 0 34 0S13 0 7.5 1.6a8.6 8.6 0 0 0-6 6A90 90 0 0 0 0 24a90 90 0 0 0 1.5 16.3 8.6 8.6 0 0 0 6 6C13 48 34 48 34 48s21 0 26.5-1.6a8.6 8.6 0 0 0 6-6A90 90 0 0 0 68 24a90 90 0 0 0-1.5-16.3z"
            fill="#f4b728"
          />
          <path d="M27 34V14l18 10-18 10z" fill="#0d1117" />
        </svg>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{tutorial.category}</span>

        <h3>{tutorial.title}</h3>

        <p>Watch on YouTube →</p>
      </div>
    </a>
  );
}