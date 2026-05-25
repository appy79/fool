"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./HeroSection.module.css";

export default function HeroPortraitCard() {
  const [isPinnedRevealed, setIsPinnedRevealed] = useState(false);
  const [isPortraitHovered, setIsPortraitHovered] = useState(false);
  const [hasViewedBack, setHasViewedBack] = useState(false);
  const [suppressHoverFlip, setSuppressHoverFlip] = useState(false);
  const isPortraitRevealed = isPinnedRevealed || (isPortraitHovered && !suppressHoverFlip);

  const handlePortraitClick = () => {
    setHasViewedBack(true);
    setIsPinnedRevealed((revealed) => {
      const nextRevealed = !revealed;
      setSuppressHoverFlip(!nextRevealed);

      return nextRevealed;
    });
  };

  return (
    <figure className="relative overflow-hidden border border-primary/25 bg-card/45 p-2 dark:bg-background/35">
      <button
        type="button"
        className={`${styles.portraitCard} relative block aspect-[4/3] w-full overflow-hidden border border-border/70 text-left`}
        aria-pressed={isPinnedRevealed}
        aria-label={isPinnedRevealed ? "Hide Foundation identity record" : "Reveal Foundation identity record"}
        onClick={handlePortraitClick}
        onMouseEnter={() => {
          setIsPortraitHovered(true);
          setHasViewedBack(true);
        }}
        onMouseLeave={() => {
          setIsPortraitHovered(false);
          setSuppressHoverFlip(false);
        }}
        onFocus={() => {
          setIsPortraitHovered(true);
          setHasViewedBack(true);
        }}
        onBlur={() => {
          setIsPortraitHovered(false);
          setSuppressHoverFlip(false);
        }}
      >
        <div className={`${styles.portraitCardInner} ${isPortraitRevealed ? styles.portraitCardFlipped : ""}`}>
          <div className={`${styles.portraitCardFace} absolute inset-0`}>
            <Image
              src="/profile-photo.jpg"
              alt="Amandeep Yadav portrait"
              width={1200}
              height={900}
              priority
              className={`${styles.portraitImage} h-full w-full object-cover transition`}
            />
            <div className={`${styles.nightOverlay} absolute inset-0 transition`} aria-hidden="true" />
            <div className={`${styles.signalOverlay} absolute inset-0 transition`} aria-hidden="true" />
            <div
              className={`${styles.gridOverlay} absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] transition`}
              aria-hidden="true"
            />
            {!hasViewedBack ? (
              <span className={styles.portraitPrompt}>
                tap to reveal
              </span>
            ) : null}
          </div>

          <div className={`${styles.portraitCardFace} ${styles.portraitCardBack} absolute inset-0`}>
            <div className={styles.accessCard}>
              <div className={styles.accessGrid} aria-hidden="true" />
              <div className={styles.accessHeader}>
                <div className="min-w-0">
                  <p className={styles.accessKicker}>encyclopedia.access</p>
                  <p className={styles.accessTitle}>Terminus Engineer</p>
                </div>
                <span className={styles.accessChip}>granted</span>
              </div>

              <div className={styles.accessMetrics}>
                <p><span>id</span> terminus.engineer</p>
                <p><span>clearance</span> seldon.approved</p>
                <p><span>trace</span> non-random</p>
              </div>

              <div className={styles.accessFooter}>
                <p>Prime Radiant cross-reference located.</p>
                <p>Builder of reliable systems during late-imperial entropy.</p>
                <p>Deviation: practical fixes over prophecy.</p>
              </div>
            </div>
          </div>
        </div>
      </button>
      <figcaption className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
        archive.portrait / identity plate armed
      </figcaption>
    </figure>
  );
}
