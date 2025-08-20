import React from "react";
import { useRerumObject } from "../../hooks/useRerumObject";
import { usePath } from "../../hooks/usePath";
import styles from "./timeline.module.css";

const HistoryItem = ({ item }) => {
  return (
    <div className={styles.historyItem}>
      {item === "No previous versions" ? (
        <p style={{ fontStyle: "italic" }}>No previous versions</p>
      ) : item === "root" ? (
        <p style={{ fontStyle: "italic" }}>root</p>
      ) : item === "No next versions" ? (
        <p style={{ fontStyle: "italic" }}>No next versions</p>
      ) : (
        <a href={item.split("/").pop()} className={styles.mono}>
          <span>{item.split("/").pop()}</span>
        </a>
      )}
    </div>
  );
};

export const Timeline = () => {
  const { path: rerumId } = usePath();
  const { data, loading } = useRerumObject(rerumId);

  if (loading) return <div>Loading...</div>;

  if (!data)
    return (
      <div>
        <p>There is no data affiliated with this rerum ID.</p>
      </div>
    );

  return (
    <div className={styles.timeline}>
      <div className={styles.historySection}>
        <p>Prime</p>
      </div>
      <HistoryItem item={data.__rerum.history.prime} />
      <div className={styles.historySection}>
        <p>Previous</p>
      </div>
      {data.__rerum.history.previous.length > 0 ? (
        <>
          <HistoryItem item={data.__rerum.history.previous} />
        </>
      ) : (
        <HistoryItem item={"No previous versions"} />
      )}
      <div className={styles.historySection}>
        <p>Next</p>
      </div>
      {data.__rerum.history.next.map((i) => (
        <HistoryItem item={i} />
      ))}
      {data.__rerum.history.next.length === 0 && (
        <HistoryItem item={"No next versions"} />
      )}
      <div
        style={{
          height: "90vh",
          backgroundColor: "var(--color-surface-light)",
        }}
      ></div>
    </div>
  );
};
