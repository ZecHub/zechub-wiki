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
      <img
        src={`https://img.youtube.com/vi/${tutorial.videoId}/hqdefault.jpg`}
        alt={tutorial.title}
        className={styles.thumbnail}
      />

      <div className={styles.body}>
        <span className={styles.category}>{tutorial.category}</span>

        <h3>{tutorial.title}</h3>

        <p>Watch on YouTube →</p>
      </div>
    </a>
  );
}