// useRerumObject.js (ESM, named exports, arrow funcs)
import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {}
  if (!res.ok) {
    const msg =
      (json && (json.message || json.error)) ||
      `${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.statusText = res.statusText;
    err.info = json ?? text;
    throw err;
  }
  return json;
};

const normalizeId = (input) => {
  if (!input) return null;
  // Accept /v1/id/XXXX, XXXX, or full http(s) URL
  let s = String(input).trim();
  s = s.replace(/^https?:\/\/store\.rerum\.io\/v1\/id\//i, "");
  s = s.replace(/^\/+/, ""); // strip leading slashes
  s = s.replace(/^v1\/id\//i, ""); // handle paths like /v1/id/XXXX
  return s || null;
};

export const useRerumObject = (id) => {
  const idToFetch = useMemo(() => normalizeId(id), [id]);

  const key = idToFetch ? `https://store.rerum.io/v1/id/${idToFetch}` : null;
  const { data, error, isLoading } = useSWR(key, fetcher);

  const [ageSeconds, setAgeSeconds] = useState(0);

  useEffect(() => {
    if (data) setAgeSeconds(0);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const t = setInterval(() => setAgeSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [data]);

  return { data, error, loading: isLoading, ageSeconds };
};
