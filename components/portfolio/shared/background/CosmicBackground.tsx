import styles from "./cosmicBackground.module.css";

/**
 * Fixed, behind-everything Foundation backdrop: a calm star-chart (CSS/SVG starfield, soft
 * galactic glow, fine grid, edge vignette) that the operations console sits on top of. The
 * dynamic, meaningful motion now lives in the console's system topology, not a background object.
 */
export default function CosmicBackground() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.stars} />
      <div className={styles.spiral} />
      <div className={styles.grid} />
      <div className={styles.glow} />
      <div className={styles.vignette} />
    </div>
  );
}
