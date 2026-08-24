import styles from "../../miizu-landing.module.css";

export function ContactFieldFeedback({
  error,
  id,
}: {
  error: string | null;
  id: string;
}) {
  return (
    <div className={styles.fieldFeedback}>
      {error && (
        <small className={styles.fieldError} id={id} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
