"use client";

import React, { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";
import { FullscreenModal } from "./file-preview";

export function CustomImg({
  src,
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  if (!src) return null;
  const imageSrc = typeof src === "string" ? src : "";

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlipH = () => {
    setFlipH((prev) => !prev);
  };

  const handleFlipV = () => {
    setFlipV((prev) => !prev);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const handleOpen = () => {
    handleReset();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    handleReset();
  };

  const transformStyle = `scale(${zoom}) rotate(${rotation}deg) scaleX(${
    flipH ? -1 : 1
  }) scaleY(${flipV ? -1 : 1})`;

  return (
    <>
      <figure className="my-6 inline-block w-full overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-xs group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={alt || ""}
          className={`w-full max-h-[550px] object-contain cursor-zoom-in transition-opacity hover:opacity-95 ${
            className || ""
          }`}
          loading="lazy"
          onClick={handleOpen}
          {...props}
        />
      </figure>

      <FullscreenModal
        isOpen={isOpen}
        onClose={handleClose}
        title={alt || "Image Preview"}
        icon="image"
        headerActions={
          <>
            {/* Rotate button */}
            <button
              type="button"
              onClick={handleRotate}
              title="Rotate 90° (R)"
              className={`rounded-lg border border-fd-border transition-colors flex items-center gap-1 cursor-pointer text-xs font-mono font-medium ${
                rotation > 0
                  ? "px-2 py-1 bg-fd-primary/20 text-fd-primary border-fd-primary/50"
                  : "p-1.5 bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground"
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              {rotation > 0 && <span>{rotation}°</span>}
            </button>

            {/* Flip Horizontal button */}
            <button
              type="button"
              onClick={handleFlipH}
              title="Flip Horizontally"
              className={`p-1.5 rounded-lg border border-fd-border transition-colors cursor-pointer ${
                flipH
                  ? "bg-fd-primary/20 text-fd-primary border-fd-primary/50"
                  : "bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground"
              }`}
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>

            {/* Flip Vertical button */}
            <button
              type="button"
              onClick={handleFlipV}
              title="Flip Vertically"
              className={`p-1.5 rounded-lg border border-fd-border transition-colors cursor-pointer ${
                flipV
                  ? "bg-fd-primary/20 text-fd-primary border-fd-primary/50"
                  : "bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground"
              }`}
            >
              <FlipVertical className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-fd-border mx-0.5" />

            {/* Zoom controls */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom Out (-)"
              className="p-1.5 rounded-lg border border-fd-border bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset All Transforms"
              className="px-2.5 py-1 rounded-lg border border-fd-border bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground text-xs font-mono font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{Math.round(zoom * 100)}%</span>
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title="Zoom In (+)"
              className="p-1.5 rounded-lg border border-fd-border bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-fd-border mx-0.5" />
          </>
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={alt || ""}
          style={{ transform: transformStyle }}
          className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out origin-center"
        />
      </FullscreenModal>
    </>
  );
}
