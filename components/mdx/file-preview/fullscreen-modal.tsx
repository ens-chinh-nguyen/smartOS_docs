"use client";

import React, { useEffect } from "react";
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";

export interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  href?: string;
  badge?: string;
  icon?: "pdf" | "text" | "csv" | "image" | React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function FullscreenModal({
  isOpen,
  onClose,
  title,
  href,
  badge,
  icon = "text",
  headerActions,
  children,
}: FullscreenModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (icon === "csv") {
      return <FileSpreadsheet className="w-5 h-5 text-fd-primary shrink-0" />;
    }
    if (icon === "image") {
      return <ImageIcon className="w-5 h-5 text-fd-primary shrink-0" />;
    }
    return <FileText className="w-5 h-5 text-fd-primary shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-fd-background/95 backdrop-blur-md p-2 animate-in fade-in duration-200">
      {/* Container with 8px (p-2) outer margin */}
      <div className="flex flex-col w-full h-full rounded-xl border border-fd-border bg-fd-card shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 px-4 py-1.5 bg-fd-muted/30 border-b border-fd-border shrink-0 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            {renderIcon()}
            <span className="font-semibold text-fd-foreground text-sm truncate max-w-[200px] md:max-w-[500px]">
              {title}
            </span>
            {badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-fd-primary/10 text-fd-primary font-bold shrink-0">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {headerActions}
            {href && (
              <a
                href={href}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fd-primary text-fd-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              title="Close full screen (Esc)"
              className="p-1.5 rounded-lg border border-fd-border bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area with 8px (p-2) padding */}
        <div className="flex-1 min-h-0 w-full overflow-hidden flex items-center justify-center p-2 bg-fd-card/30">
          {children}
        </div>
      </div>
    </div>
  );
}
