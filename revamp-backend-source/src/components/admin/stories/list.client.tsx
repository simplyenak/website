"use client";

import { Button, DefaultListView, Gutter } from "@payloadcms/ui";
import { useState } from "react";
import { ListViewClientProps } from "payload";
import { Kanban, KanbanProps } from "./kanban";

type Mode = "kanban" | "table";

export default function StoriesListClient({
  initialColumns,
  ...props
}: ListViewClientProps & KanbanProps) {
  const [mode, setMode] = useState<Mode>("kanban");

  const tabStyle = (active: boolean) => ({
    padding: "4px 12px",
    fontSize: "13px",
    fontWeight: active ? 600 : 400,
    background: active ? "var(--theme-elevation-150)" : "transparent",
    border: "1px solid var(--theme-elevation-150)",
    borderRadius: "4px",
    cursor: "pointer",
    color: "var(--theme-elevation-800)",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: "4px", alignSelf: "flex-end", marginRight: "24px", marginTop: "16px" }}>
        <button style={tabStyle(mode === "kanban")} onClick={() => setMode("kanban")}>
          Kanban
        </button>
        <button style={tabStyle(mode === "table")} onClick={() => setMode("table")}>
          Table
        </button>
      </div>

      {mode === "kanban" ? (
        <Gutter>
          <header style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--theme-elevation-1000)", margin: 0 }}>
              Stories
            </h1>
            <Button
              el="link"
              buttonStyle="pill"
              size="small"
              to={props.newDocumentURL}
            >
              Create New
            </Button>
          </header>

          <Kanban initialColumns={initialColumns} />
        </Gutter>
      ) : (
        <DefaultListView {...(props as any)} />
      )}
    </div>
  );
}
