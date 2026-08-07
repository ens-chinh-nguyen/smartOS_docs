"use client";

import React from "react";
import { PreviewCard } from "./preview-card";

interface PdfPreviewProps {
  href: string;
  title?: string;
  children?: React.ReactNode;
}

export function PdfPreview({ href, title, children }: PdfPreviewProps) {
  const fileName =
    title ||
    (typeof children === "string" ? children : "") ||
    href.split("/").pop()?.split("?")[0].split("#")[0] ||
    "document.pdf";

  return (
    <PreviewCard
      href={href}
      title={title}
      badge="PDF"
      iconType="pdf"
      content={
        <iframe
          src={href}
          className="w-full h-[550px] md:h-[650px] border-0"
          title={fileName}
        />
      }
      fullscreenContent={
        <iframe
          src={href}
          className="w-full h-full border-0 bg-white"
          title={fileName}
        />
      }
    >
      {children}
    </PreviewCard>
  );
}
