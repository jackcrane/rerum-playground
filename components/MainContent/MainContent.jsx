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

  if (!data)
    return (
      <Section>
        <p>There is no data affiliated with this rerum ID.</p>
      </Section>
    );

  return (
    <Section>
      <JsonTable data={clone} />
    </Section>
  );
};
