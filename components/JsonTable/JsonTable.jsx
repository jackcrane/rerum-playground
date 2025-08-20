// JsonTable.jsx
import React, { useMemo, useState, useCallback } from "react";
import classNames from "classnames";
import styles from "./jsonTable.module.css";

export const JsonTable = ({ data, className }) => {
  const [open, setOpen] = useState(() => new Set());
  const isOpen = useCallback((path) => open.has(path), [open]);
  const toggle = useCallback((path) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);
  const root = useMemo(() => normalizeData(data), [data]);

  return (
    <div className={classNames(styles.wrapper, className)}>
      <KVTable node={root} path="$" isOpen={isOpen} toggle={toggle} level={0} />
    </div>
  );
};

/** Helpers **/
const isPlainObject = (v) =>
  Object.prototype.toString.call(v) === "[object Object]";
const normalizeData = (value) => {
  if (Array.isArray(value)) return { type: "array", value };
  if (isPlainObject(value)) return { type: "object", value };
  return { type: "primitive", value };
};
const renderPrimitive = (v) => {
  if (v === null) return <span className={styles.null}>null</span>;
  switch (typeof v) {
    case "string":
      return <code className={styles.string}>"{v}"</code>;
    case "number":
      return <code className={styles.number}>{String(v)}</code>;
    case "boolean":
      return <code className={styles.boolean}>{String(v)}</code>;
    default:
      return <code className={styles.unknown}>{String(v)}</code>;
  }
};
const pathKey = (base, key) =>
  `${base}${typeof key === "number" ? `[${key}]` : `.${key}`}`;
const labelFor = (node) =>
  node.type === "array"
    ? `Array(${node.value.length})`
    : node.type === "object"
    ? "Object"
    : "Value";

/** Table renderers **/
const KVTable = ({ node, path, isOpen, toggle, level }) => {
  if (node.type === "primitive") {
    return (
      <div className={styles.primitiveRow}>{renderPrimitive(node.value)}</div>
    );
  }

  if (node.type === "array") {
    return (
      <div className={styles.arrayBlock}>
        <table
          className={styles.table}
          role="table"
          aria-label={`Array at ${path}`}
        >
          <thead>
            <tr>
              <th className={styles.thIndex}>#</th>
              <th className={styles.thValue}>Value</th>
            </tr>
          </thead>
          <tbody>
            {node.value.map((item, idx) => {
              const child = normalizeData(item);
              const childPath = pathKey(path, idx);
              const complex = child.type !== "primitive";
              const open = isOpen(childPath);

              return (
                <React.Fragment key={childPath}>
                  <tr className={styles.tr}>
                    <td className={styles.tdIndex}>{idx}</td>
                    <td className={styles.tdValue}>
                      {complex ? (
                        <button
                          type="button"
                          className={styles.toggle}
                          onClick={() => toggle(childPath)}
                          aria-expanded={open}
                          aria-controls={`${childPath}-panel`}
                        >
                          {open ? "▾" : "▸"} {labelFor(child)}
                        </button>
                      ) : (
                        renderPrimitive(child.value)
                      )}
                    </td>
                  </tr>

                  {complex && open && (
                    <tr className={styles.expandedRow}>
                      {/* One cell spanning both columns; inner grid handles the vertical key + full-width panel */}
                      <td className={styles.expandedCell} colSpan={2}>
                        <div className={styles.expandedGrid}>
                          <div className={styles.verticalKeyCell}>
                            <span
                              className={styles.verticalKey}
                              title={`#${idx}`}
                            >
                              #{idx}
                            </span>
                          </div>
                          <div
                            id={`${childPath}-panel`}
                            className={styles.expandedPanel}
                            role="region"
                            aria-label={`Expanded ${childPath}`}
                          >
                            <KVTable
                              node={child}
                              path={childPath}
                              isOpen={isOpen}
                              toggle={toggle}
                              level={level + 1}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // object
  const entries = Object.entries(node.value);
  return (
    <div className={styles.objectBlock}>
      <table
        className={styles.table}
        role="table"
        aria-label={`Object at ${path}`}
      >
        <thead>
          <tr>
            <th className={styles.thKey}>Key</th>
            <th className={styles.thValue}>Value</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([k, v]) => {
            const child = normalizeData(v);
            const rowPath = pathKey(path, k);
            const complex = child.type !== "primitive";
            const open = isOpen(rowPath);

            return (
              <React.Fragment key={rowPath}>
                <tr className={styles.tr}>
                  <td className={styles.tdKey}>{k}</td>
                  <td className={styles.tdValue}>
                    {complex ? (
                      <button
                        type="button"
                        className={styles.toggle}
                        onClick={() => toggle(rowPath)}
                        aria-expanded={open}
                        aria-controls={`${rowPath}-panel`}
                      >
                        {open ? "▾" : "▸"} {labelFor(child)}
                      </button>
                    ) : (
                      renderPrimitive(child.value)
                    )}
                  </td>
                </tr>

                {complex && open && (
                  <tr className={styles.expandedRow}>
                    {/* Span both columns so this row doesn’t affect normal column widths */}
                    <td className={styles.expandedCell} colSpan={2}>
                      <div className={styles.expandedGrid}>
                        <div className={styles.verticalKeyCell}>
                          <span className={styles.verticalKey} title={k}>
                            {k}
                          </span>
                        </div>
                        <div
                          id={`${rowPath}-panel`}
                          className={styles.expandedPanel}
                          role="region"
                          aria-label={`Expanded ${rowPath}`}
                        >
                          <KVTable
                            node={child}
                            path={rowPath}
                            isOpen={isOpen}
                            toggle={toggle}
                            level={level + 1}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
