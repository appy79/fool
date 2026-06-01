"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./HeroSection.module.css";

export default function HeroPortraitCard() {
  const [isPinnedRevealed, setIsPinnedRevealed] = useState(false);
  const [isPortraitHovered, setIsPortraitHovered] = useState(false);
  const [hasViewedBack, setHasViewedBack] = useState(false);
  const [suppressHoverFlip, setSuppressHoverFlip] = useState(false);
  const portraitHintId = "hero-portrait-hint";
  const identityRecordId = "hero-portrait-identity-record";
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
    <figure className="relative overflow-hidden">
      <button
        type="button"
        className={`${styles.portraitCard} relative block aspect-[4/3] w-full overflow-hidden text-left ring-1 ring-border/70 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none`}
        aria-expanded={isPinnedRevealed}
        aria-controls={identityRecordId}
        aria-label={isPinnedRevealed ? "Hide Foundation identity record" : "Reveal Foundation identity record"}
        aria-describedby={portraitHintId}
        onClick={handlePortraitClick}
        onMouseEnter={() => {
          setIsPortraitHovered(true);
          setHasViewedBack(true);
        }}
        onMouseLeave={() => {
          setIsPortraitHovered(false);
          setSuppressHoverFlip(false);
        }}
      >
        <div className={`${styles.portraitCardInner} ${isPortraitRevealed ? styles.portraitCardFlipped : ""}`}>
          <div className={`${styles.portraitCardFace} absolute inset-0`}>
            <span id={portraitHintId} className="sr-only">
              Press to reveal the Foundation identity record. Hover also previews the reverse side for pointer users.
            </span>
            <Image
              src="/profile-photo.jpg"
              alt="Amandeep Yadav portrait"
              width={1200}
              height={900}
              sizes="(min-width: 1024px) 34vw, calc(100vw - 2.5rem)"
              fetchPriority="high"
              loading="eager"
              className={`${styles.portraitImage} h-full w-full object-cover transition`}
            />
            <div className={`${styles.nightOverlay} absolute inset-0 transition`} aria-hidden="true" />
            <div className={`${styles.signalOverlay} absolute inset-0 transition`} aria-hidden="true" />
            <div className={`${styles.gridOverlay} absolute inset-0 transition`} aria-hidden="true" />
            {!hasViewedBack ? (
              <span className={styles.portraitPrompt} aria-hidden="true">
                tap to reveal
              </span>
            ) : null}
          </div>

          <div id={identityRecordId} className={`${styles.portraitCardFace} ${styles.portraitCardBack} absolute inset-0`}>
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
    </figure>
  );
}
