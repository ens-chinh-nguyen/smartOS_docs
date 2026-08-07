import React from "react";
import {
  PdfPreview,
  TextPreview,
  CsvPreview,
  FileAttachment,
  isPdfFile,
  isTextFile,
  isCsvFile,
  isFileAttachment,
} from "./file-preview";

export { isPdfFile, isTextFile, isCsvFile, isFileAttachment };

export function createCustomLink(DefaultAComponent?: any) {
  return function CustomLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    if (href && isPdfFile(href)) {
      return <PdfPreview href={href}>{children}</PdfPreview>;
    }

    if (href && isTextFile(href)) {
      return <TextPreview href={href}>{children}</TextPreview>;
    }

    if (href && isCsvFile(href)) {
      return <CsvPreview href={href}>{children}</CsvPreview>;
    }

    if (href && isFileAttachment(href)) {
      return <FileAttachment href={href}>{children}</FileAttachment>;
    }

    const Comp = DefaultAComponent || "a";
    return (
      <Comp href={href} {...props}>
        {children}
      </Comp>
    );
  };
}
