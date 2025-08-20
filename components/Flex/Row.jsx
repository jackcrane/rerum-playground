import React from "react";

export const Row = ({ children, gap }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: gap * 8 }}>
      {children}
    </div>
  );
};
