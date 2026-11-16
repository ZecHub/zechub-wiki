"use client";
import { useRef, useState, type MouseEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./TutorialCard.module.css";
import { Tutorial } from "@/data/tutorials";
import { ArrowUpRight, Play } from "lucide-react";

const BTN =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

const BTN_OUTLINE = `${BTN} border-brand/50 text-brand hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white`;

interface Props {
  tutorial: Tutorial;
}

export default function TutorialCard({ tutorial }: Props) {
  const [playing, setPlaying] = useState(false);

  const openerRef = useRef<HTMLButtonElement | null>(null);

  const openVideo = (event: MouseEvent<HTMLButtonElement>) => {
    openerRef.current = event.currentTarget;
    setPlaying(true);
  };

  return (
    <Dialog.Root open={playing} onOpenChange={setPlaying}>
    <article className={styles.card}>
      <button className={styles.thumbnailButton} type="button" onClick={openVideo} aria-label={`Play ${tutorial.title} here`}>
        <div className={styles.thumbnail} role="img" aria-label={tutorial.title}>
          <img src={`https://i.ytimg.com/vi/${tutorial.videoId}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className={styles.playIcon} aria-hidden="true">▶</span>
        </div>
      </button>

      <div className={styles.body}>
        <span className={styles.category}>{tutorial.category}</span>

        <h3>{tutorial.title}</h3>

        <div className={styles.actions}>
          <button className={`${BTN} ${styles.playButton}`} type="button" onClick={openVideo}>
            <Play aria-hidden="true" className="h-4 w-4 fill-current" />
            Play here
          </button>
          <a className={BTN_OUTLINE} href={`https://youtube.com/watch?v=${tutorial.videoId}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${tutorial.title} on YouTube (opens in a new tab)`}>
            YouTube
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalBackdrop}>
          <Dialog.Content
            className={styles.modal}
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              openerRef.current?.focus();
            }}
          >
            <Dialog.Close className={styles.closeButton} aria-label="Close video">×</Dialog.Close>
            <div className={styles.playerFrame}>
              <iframe src={`https://www.youtube-nocookie.com/embed/${tutorial.videoId}?rel=0`} title={tutorial.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            </div>
            <Dialog.Title>{tutorial.title}</Dialog.Title>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </article>
    </Dialog.Root>
  );
}
