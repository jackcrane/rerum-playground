import React from "react";
import { useRerumObject } from "../../hooks/useRerumObject";
import moment from "moment/moment";
import styles from "./generatedBy.module.css";

export const GeneratedBy = ({ rerumId }) => {
  const { data, loading } = useRerumObject(rerumId);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      [
      <a href={rerumId}>
        <span className={styles.mono}>RERUM</span>
      </a>
      ]
      {data.mbox && (
        <>
          {" ["}
          <a href={data.mbox}>
            <span className={styles.mono}>MAILBOX</span>
          </a>
          {"]"}
        </>
      )}{" "}
      {data.label} (Generator created{" "}
      <span className={styles.mono}>
        {moment(data.__rerum.createdAt).format("M/D/YYYY")}
      </span>
      )
    </div>
  );
};
