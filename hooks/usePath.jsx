// usePath.js (ESM, named exports, arrow funcs)
import { useState, useEffect, useCallback } from "react";

const LOCATION_EVENT = "locationchange";

// Patch history once so pushState/replaceState both emit a single event
const patchHistory = () => {
  if (window.__historyPatched) return;
  window.__historyPatched = true;

  const { pushState, replaceState } = window.history;

  window.history.pushState = (...args) => {
    const ret = pushState.apply(window.history, args);
    window.dispatchEvent(new Event(LOCATION_EVENT));
    return ret;
  };

  window.history.replaceState = (...args) => {
    const ret = replaceState.apply(window.history, args);
    window.dispatchEvent(new Event(LOCATION_EVENT));
    return ret;
  };

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event(LOCATION_EVENT));
  });
};

export const usePath = () => {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    patchHistory();
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener(LOCATION_EVENT, onChange);
    return () => window.removeEventListener(LOCATION_EVENT, onChange);
  }, []);

  const navigate = useCallback((newPath) => {
    if (newPath !== window.location.pathname) {
      window.history.pushState({}, "", newPath); // emits LOCATION_EVENT via patch
    }
  }, []);

  return { path, navigate };
};
