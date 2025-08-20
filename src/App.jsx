import React from "react";
import { ThemeProvider } from "styled-components";
import theme from "../data/theme.json";
import { Header } from "../components/Header/Header";
import { Metadata } from "../components/Metadata/Metadata";
import { JsonTable } from "../components/JsonTable/JsonTable";
import { Section } from "../components/Section/Section";
import { MainContent } from "../components/MainContent/MainContent";
import { Row } from "../components/Flex/Row";
import { Timeline } from "../components/History/Timeline";

export default () => (
  <>
    <ThemeProvider theme={theme}>
      <Header />
      <Row>
        <Timeline />
        <div style={{ flex: 1 }}>
          <Metadata />
          <MainContent />
        </div>
      </Row>
    </ThemeProvider>
  </>
);
