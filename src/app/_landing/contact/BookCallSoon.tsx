import styles from "../../miizu-landing.module.css";

export function BookCallSoon() {
  return (
    <div
      aria-label="Book a call, coming soon"
      className={`${styles.bookCall} ${styles.bookCallSoon}`}
    >
      <span className={styles.bookCallText}>book a call</span>
      <span className={styles.comingSoon}>coming soon</span>
    </div>
  );
}
