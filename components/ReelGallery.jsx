import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/theme.module.css";

// Each YouTube iframe costs roughly a megabyte before anyone presses play, so
// the grid renders lazy thumbnails from YouTube's image CDN and the real player
// is only created inside the lightbox, for the one reel being watched.
const THUMB = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const EMBED = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;

function ReelLightbox({ reels, index, labels, onClose, onStep }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const reel = reels[index];
  const name = reel.title || `${labels.reel} ${index + 1}`;

  useEffect(() => {
    // Escape closes, arrows move between reels, Tab stays inside the dialog.
    function onKey(event) {
      if (event.key === "Escape") return onClose();
      if (event.key === "ArrowRight") return onStep(1);
      if (event.key === "ArrowLeft") return onStep(-1);
      if (event.key !== "Tab") return;

      // aria-modal only tells assistive tech the rest of the page is inert; it
      // does not stop Tab walking out of the dialog. This does.
      const focusable = dialogRef.current
        ? dialogRef.current.querySelectorAll("button, iframe, [href]")
        : [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);

    // Stop the page behind the overlay from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onStep]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return createPortal(
    <div
      ref={dialogRef}
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={name}
      data-lightbox
      onClick={onClose}
    >
      <button
        type="button"
        ref={closeRef}
        className={styles.lightboxClose}
        onClick={onClose}
        aria-label={labels.close}
      >
        ✕
      </button>

      {reels.length > 1 && (
        <button
          type="button"
          className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
          onClick={(e) => {
            e.stopPropagation();
            onStep(-1);
          }}
          aria-label={labels.prev}
        >
          ‹
        </button>
      )}

      {/* Clicking the backdrop closes; clicking the player itself must not. */}
      <div
        className={styles.lightboxInner}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          key={reel.id}
          className={styles.lightboxFrame}
          src={EMBED(reel.id)}
          title={name}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>

      {reels.length > 1 && (
        <button
          type="button"
          className={`${styles.lightboxNav} ${styles.lightboxNext}`}
          onClick={(e) => {
            e.stopPropagation();
            onStep(1);
          }}
          aria-label={labels.next}
        >
          ›
        </button>
      )}
    </div>,
    document.body
  );
}

const ReelGallery = ({ reels, heading, labels = {} }) => {
  const [active, setActive] = useState(null);
  const triggers = useRef([]);

  const close = useCallback(() => {
    setActive((current) => {
      // Send focus back to the thumbnail that opened the lightbox.
      if (current !== null) triggers.current[current]?.focus();
      return null;
    });
  }, []);

  const step = useCallback(
    (delta) => {
      setActive((current) =>
        current === null
          ? current
          : (current + delta + reels.length) % reels.length
      );
    },
    [reels.length]
  );

  // Nothing to show until video ids are added to REELS in lib/content.js.
  if (!reels || reels.length === 0) return null;

  return (
    <div className={styles.reelSection}>
      {heading && <h2 className={styles.description}>{heading}</h2>}

      <div className={styles.reelGrid}>
        {reels.map((reel, i) => (
          <div className={styles.reel} key={reel.id}>
            <button
              type="button"
              data-reel-id={reel.id}
              ref={(el) => (triggers.current[i] = el)}
              className={styles.reelPoster}
              onClick={() => setActive(i)}
              aria-label={`${labels.play || "Play"}: ${
                reel.title || `${labels.reel || "Clip"} ${i + 1}`
              }`}
            >
              {/* Plain <img>: next/image would need remotePatterns config for
                  an external host, and these are small cropped thumbnails that
                  YouTube already serves optimised. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={THUMB(reel.id)}
                alt=""
                loading={i < 2 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
              <span className={styles.reelPlay} aria-hidden="true">
                ▶
              </span>
            </button>
            {reel.title && <p className={styles.reelTitle}>{reel.title}</p>}
          </div>
        ))}
      </div>

      {active !== null && (
        <ReelLightbox
          reels={reels}
          labels={labels}
          index={active}
          onClose={close}
          onStep={step}
        />
      )}
    </div>
  );
};

export default ReelGallery;
