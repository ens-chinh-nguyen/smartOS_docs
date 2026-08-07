"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Workflow,
  Move,
} from "lucide-react";
import { FullscreenModal } from "@/components/mdx/file-preview/fullscreen-modal";

const DynamicMermaid = dynamic(
  () => import("fumadocs-mermaid/ui").then((m) => m.Mermaid),
  { ssr: false },
);

interface PanZoomOptions {
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
}

function usePanZoom({
  initialScale = 1.25,
  minScale = 0.25,
  maxScale = 4,
}: PanZoomOptions = {}) {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, maxScale));
  }, [maxScale]);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, minScale));
  }, [minScale]);

  const reset = useCallback(() => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
  }, [initialScale]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        dragStartRef.current = {
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        };
      }
    },
    [position],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        setPosition({
          x: e.touches[0].clientX - dragStartRef.current.x,
          y: e.touches[0].clientY - dragStartRef.current.y,
        });
      }
    },
    [isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setScale((prevScale) => {
        const nextScale = prevScale * zoomFactor;
        return Math.min(Math.max(nextScale, minScale), maxScale);
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [minScale, maxScale]);

  return {
    scale,
    position,
    isDragging,
    containerRef,
    zoomIn,
    zoomOut,
    reset,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

export interface MermaidProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  w?: string | number;
  h?: string | number;
  width?: string | number;
  height?: string | number;
  minW?: string | number;
  minWidth?: string | number;
  maxW?: string | number;
  maxWidth?: string | number;
  minH?: string | number;
  minHeight?: string | number;
  maxH?: string | number;
  maxHeight?: string | number;
  aspectRatio?: string | number;
  zoom?: number;
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  showGrid?: boolean;
  [key: string]: any;
}

export function Mermaid({
  title,
  w = "100%",
  h = "500px",
  width,
  height,
  minW,
  minWidth,
  maxW,
  maxWidth,
  minH,
  minHeight = "250px",
  maxH,
  maxHeight = "850px",
  aspectRatio,
  zoom,
  defaultZoom = 2.25,
  minZoom = 0.25,
  maxZoom = 4,
  showGrid = true,
  className,
  style,
  ...props
}: MermaidProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userWidth, setUserWidth] = useState<number | null>(null);
  const [userHeight, setUserHeight] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    x: number;
    y: number;
    startWidth: number;
    startHeight: number;
  }>({
    x: 0,
    y: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const initialZoom = zoom ?? defaultZoom;

  const inlinePanZoom = usePanZoom({
    initialScale: initialZoom,
    minScale: minZoom,
    maxScale: maxZoom,
  });

  const modalPanZoom = usePanZoom({
    initialScale: initialZoom,
    minScale: minZoom,
    maxScale: maxZoom,
  });

  // When modal opens, reset modal zoom/pan state so diagram starts centered & clean
  useEffect(() => {
    if (isFullscreen) {
      modalPanZoom.reset();
    }
  }, [isFullscreen]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inlinePanZoom.containerRef.current) return;

    const rect = inlinePanZoom.containerRef.current.getBoundingClientRect();
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
    };
    setIsResizing(true);
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length !== 1 || !inlinePanZoom.containerRef.current) return;

    const rect = inlinePanZoom.containerRef.current.getBoundingClientRect();
    resizeStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      startWidth: rect.width,
      startHeight: rect.height,
    };
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;
      const newWidth = Math.max(
        250,
        resizeStartRef.current.startWidth + deltaX,
      );
      const newHeight = Math.max(
        150,
        resizeStartRef.current.startHeight + deltaY,
      );
      setUserWidth(newWidth);
      setUserHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - resizeStartRef.current.x;
      const deltaY = e.touches[0].clientY - resizeStartRef.current.y;
      const newWidth = Math.max(
        250,
        resizeStartRef.current.startWidth + deltaX,
      );
      const newHeight = Math.max(
        150,
        resizeStartRef.current.startHeight + deltaY,
      );
      setUserWidth(newWidth);
      setUserHeight(newHeight);
    };

    const handleTouchEnd = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isResizing]);

  const diagramTitle = title || props.title || "Mermaid Diagram";

  const effectiveW = w ?? width ?? "100%";
  const effectiveH = h ?? height ?? "500px";
  const effectiveMinW = minW ?? minWidth;
  const effectiveMaxW = maxW ?? maxWidth;
  const effectiveMinH = minH ?? minHeight;
  const effectiveMaxH = maxH ?? maxHeight;

  const formatDim = (val?: string | number) => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === "number") return `${val}px`;
    switch (val) {
      case "sm":
        return "320px";
      case "md":
        return "450px";
      case "lg":
        return "600px";
      case "xl":
        return "750px";
      case "2xl":
        return "900px";
      case "full":
        return "100%";
      default:
        return val;
    }
  };

  const containerWidth = formatDim(effectiveW);
  const containerHeight = formatDim(effectiveH);
  const containerMinWidth = formatDim(effectiveMinW);
  const containerMaxWidth = formatDim(effectiveMaxW);
  const containerMinHeight = formatDim(effectiveMinH);
  const containerMaxHeight = formatDim(effectiveMaxH);

  const finalWidth = userWidth ? `${userWidth}px` : containerWidth;
  const finalHeight = userHeight ? `${userHeight}px` : containerHeight;

  return (
    <>
      <figure
        style={{
          width: finalWidth,
          minWidth: containerMinWidth,
          maxWidth: userWidth ? undefined : containerMaxWidth,
          aspectRatio,
          ...style,
        }}
        className="relative my-6 w-full overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-xs group"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 border-b border-fd-border/50 bg-fd-muted/30 px-4 py-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Workflow className="w-4 h-4 text-fd-primary shrink-0" />
            <span className="font-medium text-fd-foreground truncate">
              {diagramTitle}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-fd-primary/10 text-fd-primary font-bold shrink-0">
              DIAGRAM
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={inlinePanZoom.zoomOut}
              title="Zoom out (-)"
              className="p-1.5 rounded-md border border-fd-border/60 bg-fd-muted/40 hover:bg-fd-accent text-fd-foreground transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={inlinePanZoom.reset}
              title="Reset zoom"
              className="px-2 py-1 rounded-md border border-fd-border/60 bg-fd-muted/40 hover:bg-fd-accent text-fd-foreground transition-colors font-mono text-[11px] font-medium cursor-pointer"
            >
              {Math.round(inlinePanZoom.scale * 100)}%
            </button>
            <button
              type="button"
              onClick={inlinePanZoom.zoomIn}
              title="Zoom in (+)"
              className="p-1.5 rounded-md border border-fd-border/60 bg-fd-muted/40 hover:bg-fd-accent text-fd-foreground transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={inlinePanZoom.reset}
              title="Reset view"
              className="p-1.5 rounded-md border border-fd-border/60 bg-fd-muted/40 hover:bg-fd-accent text-fd-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-fd-border/60 my-auto mx-0.5" />
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              title="View full screen"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-fd-border bg-fd-primary/10 text-fd-primary hover:bg-fd-primary/20 transition-colors shrink-0 text-xs font-medium cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full screen</span>
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={inlinePanZoom.containerRef}
          onMouseDown={inlinePanZoom.handleMouseDown}
          onMouseMove={inlinePanZoom.handleMouseMove}
          onMouseUp={inlinePanZoom.handleMouseUp}
          onMouseLeave={inlinePanZoom.handleMouseUp}
          onTouchStart={inlinePanZoom.handleTouchStart}
          onTouchMove={inlinePanZoom.handleTouchMove}
          onTouchEnd={inlinePanZoom.handleTouchEnd}
          onDoubleClick={inlinePanZoom.reset}
          style={{
            width: "100%",
            height: finalHeight,
            minHeight: containerMinHeight,
            maxHeight: userHeight ? undefined : containerMaxHeight,
          }}
          className={`relative overflow-hidden flex items-center justify-center p-6 bg-fd-muted/10 cursor-grab active:cursor-grabbing select-none ${
            className || ""
          }`}
        >
          {/* Subtle grid background */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `radial-gradient(var(--fd-muted-foreground) 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />
          )}

          <div
            style={{
              transform: `translate(${inlinePanZoom.position.x}px, ${inlinePanZoom.position.y}px) scale(${inlinePanZoom.scale})`,
              transformOrigin: "center center",
              transition: inlinePanZoom.isDragging
                ? "none"
                : "transform 0.1s ease-out",
              willChange: "transform",
            }}
            className="flex items-center justify-center"
          >
            <DynamicMermaid {...(props as any)} />
          </div>

          {/* Hint overlay */}
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-fd-background/80 backdrop-blur border border-fd-border text-[10px] text-fd-muted-foreground px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
            <Move className="w-3 h-3 text-fd-primary" />
            <span>Drag to pan • Scroll to zoom in/out • Double click to reset</span>
          </div>

          {/* Bottom-right Subtle Resizable Border Handle (Height & Width) */}
          <div
            onMouseDown={handleResizeMouseDown}
            onTouchStart={handleResizeTouchStart}
            title="Kéo để thay đổi kích thước (Resize)"
            className="absolute bottom-1.5 right-1.5 w-5 h-5 cursor-se-resize select-none z-10 opacity-40 hover:opacity-100 transition-opacity group/resize flex items-end justify-end p-1"
          >
            <div className="w-3 h-3 border-r-2 border-b-2 border-fd-muted-foreground group-hover/resize:border-fd-primary rounded-br-md rounded-tl-xs transition-colors" />
          </div>
        </div>
      </figure>

      {/* Fullscreen modal */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        title={diagramTitle}
        badge="DIAGRAM"
        icon={<Workflow className="w-5 h-5 text-fd-primary shrink-0" />}
        headerActions={
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={modalPanZoom.zoomOut}
              title="Zoom out (-)"
              className="p-1.5 rounded-md border border-fd-border/60 bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={modalPanZoom.reset}
              title="Reset zoom"
              className="px-2.5 py-1 rounded-md border border-fd-border/60 bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground transition-colors font-mono text-xs font-medium cursor-pointer"
            >
              {Math.round(modalPanZoom.scale * 100)}%
            </button>
            <button
              type="button"
              onClick={modalPanZoom.zoomIn}
              title="Zoom in (+)"
              className="p-1.5 rounded-md border border-fd-border/60 bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={modalPanZoom.reset}
              title="Reset view"
              className="p-1.5 rounded-md border border-fd-border/60 bg-fd-muted/50 hover:bg-fd-accent text-fd-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        }
      >
        <div
          ref={modalPanZoom.containerRef}
          onMouseDown={modalPanZoom.handleMouseDown}
          onMouseMove={modalPanZoom.handleMouseMove}
          onMouseUp={modalPanZoom.handleMouseUp}
          onMouseLeave={modalPanZoom.handleMouseUp}
          onTouchStart={modalPanZoom.handleTouchStart}
          onTouchMove={modalPanZoom.handleTouchMove}
          onTouchEnd={modalPanZoom.handleTouchEnd}
          onDoubleClick={modalPanZoom.reset}
          className="relative w-full h-full overflow-hidden flex items-center justify-center bg-fd-card/50 cursor-grab active:cursor-grabbing select-none rounded-lg border border-fd-border/30 group"
        >
          {/* Subtle grid background */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `radial-gradient(var(--fd-muted-foreground) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
          )}

          <div
            style={{
              transform: `translate(${modalPanZoom.position.x}px, ${modalPanZoom.position.y}px) scale(${modalPanZoom.scale})`,
              transformOrigin: "center center",
              transition: modalPanZoom.isDragging
                ? "none"
                : "transform 0.1s ease-out",
              willChange: "transform",
            }}
            className="flex items-center justify-center p-8"
          >
            <DynamicMermaid {...(props as any)} />
          </div>

          {/* Hint overlay */}
          <div className="absolute bottom-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-fd-background/90 backdrop-blur border border-fd-border text-xs text-fd-muted-foreground px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-md">
            <Move className="w-4 h-4 text-fd-primary" />
            <span>
              Drag to pan • Scroll to zoom in/out • Double click to reset
            </span>
          </div>
        </div>
      </FullscreenModal>
    </>
  );
}
