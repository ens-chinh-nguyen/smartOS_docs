"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { PreviewCard } from "./preview-card";

interface TextPreviewProps {
  href: string;
  title?: string;
  children?: React.ReactNode;
}

export function TextPreview({ href, title, children }: TextPreviewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const ext =
    href.split("?")[0].split("#")[0].split(".").pop()?.toUpperCase() || "TXT";

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
          setContent(text);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load content");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [href]);

  const renderTextContent = (fullscreen = false) => (
    <div
      className={
        fullscreen
          ? "w-full h-full overflow-auto p-6 font-mono text-xs text-fd-foreground whitespace-pre-wrap break-words leading-relaxed"
          : "max-h-[500px] overflow-auto p-4 bg-fd-muted/10 font-mono text-xs text-fd-foreground whitespace-pre-wrap break-words leading-relaxed"
      }
    >
      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-fd-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-fd-primary" />
          <span>Loading preview...</span>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center gap-2 py-8 text-fd-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to load file preview.</span>
        </div>
      )}
      {!loading && !error && (content ?? "")}
    </div>
  );

  return (
    <PreviewCard
      href={href}
      title={title}
      badge={ext}
      iconType="text"
      content={renderTextContent(false)}
      fullscreenContent={renderTextContent(true)}
    >
      {children}
    </PreviewCard>
  );
}
