import React from "react";
import { Section } from "../Section/Section";
import { JsonTable } from "../JsonTable/JsonTable";
import { usePath } from "../../hooks/usePath";
import { useRerumObject } from "../../hooks/useRerumObject";

export const MainContent = () => {
  const { path: rerumId } = usePath();
  const { data, loading } = useRerumObject(rerumId);

  const clone = { ...data };
  delete clone.__rerum;
  delete clone["@id"];

  if (loading) return <Section>Loading...</Section>;

  if (!rerumId || rerumId === "/")
    return (
      <Section>
        <p>
          You have not provided a rerum ID. Enter the ID (not URI) of the rerum
          object you want to view in the URL bar.
        </p>
        <br />
        <p>
          Example:{" "}
          <a href="https://rerum-reader.jackcrane.rocks/68a544f51f6e00240eb36b31">
            https://rerum-reader.jackcrane.rocks/68a544f51f6e00240eb36b31
          </a>
        </p>
      </Section>
    );

  if (!data)
    return (
      <Section>
        <p>There is no data affiliated with this rerum ID.</p>
      </Section>
    );

  return (
    <Section>
      <h3 style={{ marginBottom: "1rem" }}>Object Data</h3>
      <JsonTable data={clone} />
    </Section>
  );
};
