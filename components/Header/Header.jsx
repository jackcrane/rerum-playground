import React from "react";
import styles from "./header.module.css";
import logo from "../../assets/logo.png";
import { usePath } from "../../hooks/usePath";

export const Header = () => {
  const { path: rerumId, navigate } = usePath();

  return (
    <header className={styles.header}>
      <img src={logo} alt="logo" className={styles.logo} />
      <h1>rerum Playground</h1>
      <div style={{ flex: 1 }}></div>
    </header>
  );
};
