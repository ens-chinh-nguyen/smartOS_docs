"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { PreviewCard } from "./preview-card";

interface CsvPreviewProps {
  href: string;
  title?: string;
  children?: React.ReactNode;
}

function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line) => {
    const row: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    return row;
  });
}

export function CsvPreview({ href, title, children }: CsvPreviewProps) {
  const [rows, setRows] = useState<string[][] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(href)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (isMounted) {
          const parsed = parseCSV(text);
          setRows(parsed);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load CSV content");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [href]);

  const headerRow = rows && rows.length > 0 ? rows[0] : [];
  const bodyRows = rows && rows.length > 1 ? rows.slice(1) : [];

  const renderTableContent = (fullscreen = false) => (
    <div
      className={
        fullscreen
          ? "w-full h-full overflow-auto p-2"
          : "max-h-[500px] overflow-auto"
      }
    >
      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-xs text-fd-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-fd-primary" />
          <span>Loading CSV preview...</span>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center gap-2 py-8 text-xs text-fd-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to load CSV preview.</span>
        </div>
      )}
      {!loading && !error && rows && (
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/40 font-semibold text-fd-foreground">
              {headerRow.map((col, idx) => (
                <th
                  key={idx}
                  className="px-3 py-2 border-r border-fd-border/30 last:border-r-0 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="border-b border-fd-border/30 last:border-b-0 hover:bg-fd-muted/20 transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-3 py-2 border-r border-fd-border/20 last:border-r-0 whitespace-nowrap text-fd-foreground/90"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <PreviewCard
      href={href}
      title={title}
      badge="CSV"
      iconType="csv"
      content={renderTableContent(false)}
      fullscreenContent={renderTableContent(true)}
    >
      {children}
    </PreviewCard>
  );
}
