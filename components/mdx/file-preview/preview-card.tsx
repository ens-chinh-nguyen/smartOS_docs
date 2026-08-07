"use client";

import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Fullscreen } from "lucide-react";
import { FullscreenModal } from "./fullscreen-modal";

export interface PreviewCardProps {
  href: string;
  badge: string;
  iconType?: "text" | "csv" | "pdf";
  title?: string;
  children?: React.ReactNode;
  content: React.ReactNode;
  fullscreenContent?: React.ReactNode;
}

export function PreviewCard({
  href,
  badge,
  iconType = "text",
  title,
  children,
  content,
  fullscreenContent,
}: PreviewCardProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const fileName =
    title ||
    (typeof children === "string" ? children : "") ||
    href.split("/").pop()?.split("?")[0].split("#")[0] ||
    `document.${badge.toLowerCase()}`;

  const renderIcon = () => {
    if (iconType === "csv") {
      return <FileSpreadsheet className="w-4 h-4 text-fd-primary shrink-0" />;
    }
    return <FileText className="w-4 h-4 text-fd-primary shrink-0" />;
  };

  return (
    <>
      <figure className="my-6 w-full overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-xs">
        <div className="flex items-center justify-between gap-3 border-b border-fd-border/50 bg-fd-muted/30 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {renderIcon()}
            <span className="font-medium text-fd-foreground truncate">
              {children || fileName}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-fd-primary/10 text-fd-primary font-bold shrink-0">
              {badge}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              title="Expand to full screen"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-fd-border bg-fd-muted/40 text-fd-foreground hover:bg-fd-accent transition-colors shrink-0 text-xs font-medium"
            >
              <Fullscreen className="w-3.5 h-3.5" />
            </button>
            <a
              href={href}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-fd-primary text-fd-primary-foreground font-medium hover:opacity-90 transition-opacity shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </div>
        {content}
      </figure>

      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        title={fileName}
        href={href}
        badge={badge}
        icon={iconType}
      >
        {fullscreenContent || content}
      </FullscreenModal>
    </>
  );
}
