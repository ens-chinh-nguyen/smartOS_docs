export { PdfPreview } from "./pdf-preview";
export { TextPreview } from "./text-preview";
export { CsvPreview } from "./csv-preview";
export { FileAttachment } from "./file-attachment";
export { PreviewCard } from "./preview-card";
export { FullscreenModal } from "./fullscreen-modal";

export const isPdfFile = (url?: string) => {
  if (!url) return false;
  const ext = url.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  return ext === "pdf";
};

export const isTextFile = (url?: string) => {
  if (!url) return false;
  const ext = url.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  return ext === "txt" || ext === "md";
};

export const isCsvFile = (url?: string) => {
  if (!url) return false;
  const ext = url.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  return ext === "csv";
};

export const isFileAttachment = (url?: string) => {
  if (!url) return false;
  if (url.startsWith("/files/") || url.startsWith("/assets/")) return true;
  const fileExtensions = [
    "pdf",
    "zip",
    "csv",
    "txt",
    "docx",
    "xlsx",
    "pptx",
    "tar",
    "gz",
    "7z",
    "rar",
  ];
  const ext = url.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  return ext ? fileExtensions.includes(ext) : false;
};
