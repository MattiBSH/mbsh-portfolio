import { useState } from "react";
import styles from "../styles/theme.module.css";

// Each YouTube iframe costs roughly a megabyte before anyone presses play, so
// these render as a thumbnail first and only swap in the real player on click.
// Thumbnails come straight from YouTube's image CDN, no API key needed.
const Reel = ({ id, title }) => {
  const [playing, setPlaying] = useState(false);
  const label = title || "Nature clip";

  if (playing) {
    return (
      <div className={styles.reel}>
        <iframe
          className={styles.reelFrame}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        {title && <p className={styles.reelTitle}>{title}</p>}
      </div>
    );
  }

  return (
    <div className={styles.reel}>
      <button
        type="button"
        data-reel-id={id}
        className={styles.reelPoster}
        onClick={() => setPlaying(true)}
        aria-label={`Play: ${label}`}
      >
        {/* Plain <img>: next/image would need remotePatterns config for an
            external host, and these are already small, cropped thumbnails. */}
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
        />
        <span className={styles.reelPlay} aria-hidden="true">
          ▶
        </span>
      </button>
      {title && <p className={styles.reelTitle}>{title}</p>}
    </div>
  );
};

const ReelGallery = ({ reels, heading }) => {
  // Nothing to show until video ids are added to REELS in lib/content.js.
  if (!reels || reels.length === 0) return null;

  return (
    <div className={styles.reelSection}>
      {heading && <h4 className={styles.description}>{heading}</h4>}
      <div className={styles.reelGrid}>
        {reels.map((reel) => (
          <Reel key={reel.id} id={reel.id} title={reel.title} />
        ))}
      </div>
    </div>
  );
};

export default ReelGallery;
