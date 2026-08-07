import React from "react";
import { Download, FileText } from "lucide-react";

interface FileAttachmentProps {
  href: string;
  children?: React.ReactNode;
}

export function FileAttachment({ href, children }: FileAttachmentProps) {
  const ext =
    href.split("?")[0].split("#")[0].split(".").pop()?.toUpperCase() || "FILE";

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-fd-border bg-fd-muted/40 hover:bg-fd-accent text-fd-foreground text-xs font-medium transition-colors my-1 inline-block">
      <FileText className="w-3.5 h-3.5 text-fd-primary shrink-0 inline-block align-middle" />
      <a
        href={href}
        download
        className="hover:underline font-medium text-fd-foreground"
      >
        {children || href.split("/").pop()}
      </a>
      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-fd-primary/10 text-fd-primary font-bold">
        {ext}
      </span>
      <a
        href={href}
        download
        title="Download"
        className="p-0.5 hover:text-fd-primary shrink-0"
      >
        <Download className="w-3.5 h-3.5 text-fd-muted-foreground hover:text-fd-primary inline-block align-middle" />
      </a>
    </span>
  );
}
