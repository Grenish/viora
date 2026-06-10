"use client";

import React, {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

interface GalleryContextValue {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  count: number;
}

interface InteractiveGalleryProps {
  children: React.ReactNode;
  className?: string;
}

interface InteractiveGalleryGroupProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

interface InteractiveGalleryMediaProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

interface InteractiveGalleryContentProps {
  children: React.ReactNode;
  className?: string;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error(
      "InteractiveGallery compound components must be used within <InteractiveGallery>",
    );
  }
  return ctx;
}

const springLayout = {
  type: "spring" as const,
  stiffness: 180,
  damping: 24,
  mass: 1.0,
};

const springContent = {
  type: "spring" as const,
  stiffness: 220,
  damping: 24,
  mass: 0.8,
};

const MotionCard = motion.create(Card);

function InteractiveGallery({ children, className }: InteractiveGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const childArray = React.Children.toArray(children);
  const count = childArray.length;

  const ctx = useMemo<GalleryContextValue>(
    () => ({ activeId, setActiveId, activeIndex, setActiveIndex, count }),
    [activeId, activeIndex, count],
  );

  const childrenWithIndex = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<InteractiveGalleryGroupProps>, { index });
    }
    return child;
  });

  return (
    <GalleryContext.Provider value={ctx}>
      <div
        className={cn(
          "relative md:flex md:flex-row gap-3 w-full h-105 md:h-120 overflow-x-clip md:overflow-x-visible",
          className,
        )}
        onMouseLeave={() => setActiveId(null)}
      >
        {childrenWithIndex}

        <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1.5 md:hidden">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === activeIndex ? "bg-foreground w-4" : "bg-foreground/25",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </GalleryContext.Provider>
  );
}

function InteractiveGalleryGroup({
  children,
  className,
  index = 0,
}: InteractiveGalleryGroupProps) {
  const id = useId();
  const { activeId, setActiveId } = useGallery();
  const isActive = activeId === id;
  const hasActive = activeId !== null;

  const childArray = React.Children.toArray(children);

  const mediaChild = childArray.find((child) => {
    if (!React.isValidElement(child)) return false;
    const props = child.props as Record<string, unknown>;
    return typeof props.src === "string";
  });

  const contentChild = childArray.find((child) => {
    if (!React.isValidElement(child)) return false;
    const props = child.props as Record<string, unknown>;
    return !props.src && props.children !== undefined;
  });

  return (
    <>
      <MotionCard
        className={cn(
          "hidden md:flex flex-col relative cursor-pointer p-0 gap-0 select-none",
          isActive && "shadow-xl ring-foreground/10",
          className,
        )}
        transition={springLayout}
        animate={{
          flexGrow: isActive ? 4 : hasActive ? 0.4 : 1,
        }}
        style={{
          flexBasis: "0%",
          flexShrink: 1,
          minWidth: 0,
        }}
        onMouseEnter={() => setActiveId(id)}
        onFocus={() => setActiveId(id)}
        tabIndex={0}
        role="button"
        aria-expanded={isActive}
      >
        <motion.div
          className="relative w-full overflow-hidden shrink-0"
          transition={springLayout}
          animate={{
            height: isActive ? 320 : 480,
          }}
        >
          {mediaChild}
        </motion.div>

        <AnimatePresence>
          {!isActive && (
            <motion.div
              className="absolute inset-0 bg-linear-to-t from-background/60 via-background/20 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isActive && contentChild && (
            <motion.div
              key={`content-${id}`}
              className="shrink-0"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={springContent}
              style={{ overflow: "hidden" }}
            >
              <div className="px-5 py-4">{contentChild}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasActive && !isActive && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StripLabel>{contentChild}</StripLabel>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionCard>

      <MobileCard
        index={index}
        mediaChild={mediaChild}
        contentChild={contentChild}
        className={className}
      />
    </>
  );
}

function StripLabel({ children }: { children: React.ReactNode }) {
  if (!React.isValidElement(children)) return null;
  const element = children as React.ReactElement<{ children: React.ReactNode }>;

  const inner = element.props.children;
  const childArray = React.Children.toArray(inner);

  const heading = childArray.find(
    (child) =>
      React.isValidElement(child) &&
      typeof child.type === "string" &&
      /^h[1-6]$/.test(child.type),
  );

  if (!heading || !React.isValidElement(heading)) return null;
  const headingEl = heading as React.ReactElement<{
    children: React.ReactNode;
  }>;

  return (
    <p className="text-xs font-medium text-white truncate drop-shadow-md">
      {headingEl.props.children}
    </p>
  );
}

function MobileCard({
  index,
  mediaChild,
  contentChild,
  className,
}: {
  index: number;
  mediaChild: React.ReactNode;
  contentChild: React.ReactNode;
  className?: string;
}) {
  const { activeIndex, setActiveIndex, count } = useGallery();

  const relativeIndex = (index - activeIndex + count) % count;
  const isTop = relativeIndex === 0;

  const handleCycle = () => {
    if (isTop) {
      setActiveIndex((activeIndex + 1) % count);
    } else {
      setActiveIndex(index);
    }
  };

  const scale = 1 - relativeIndex * 0.05;
  const yOffset = relativeIndex * 16;
  const zIndex = 30 - relativeIndex * 10;
  const opacity = relativeIndex === 0 ? 1 : 0.85 - relativeIndex * 0.15;

  return (
    <motion.div
      style={{ zIndex, touchAction: "pan-y" }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(event, info) => {
        if (info.offset.x > 80) {
          setActiveIndex((activeIndex - 1 + count) % count);
        } else if (info.offset.x < -80) {
          setActiveIndex((activeIndex + 1) % count);
        }
      }}
      animate={{
        scale,
        y: yOffset,
        opacity,
      }}
      transition={springContent}
      onClick={handleCycle}
      className={cn(
        "md:hidden absolute inset-x-0 mx-auto w-[86vw] xs:w-[290px] sm:w-82.5 h-85 xs:h-[360px] sm:h-95 cursor-pointer origin-top select-none rounded-3xl border border-border/50 shadow-md bg-card overflow-hidden flex flex-col",
        className,
      )}
    >
      <div className="relative w-full h-40 xs:h-44 sm:h-48 overflow-hidden shrink-0">
        {mediaChild}
      </div>
      <div className="px-5 py-4 flex-1 flex flex-col justify-start bg-card text-card-foreground overflow-hidden">
        <motion.div
          animate={{ opacity: isTop ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="h-full"
        >
          {contentChild}
        </motion.div>
      </div>
    </motion.div>
  );
}

function InteractiveGalleryMedia({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
}: InteractiveGalleryMediaProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn(
        "w-full h-full object-cover select-none pointer-events-none",
        className,
      )}
      sizes="(max-width: 768px) 100vw, 50vw"
      draggable={false}
    />
  );
}

function InteractiveGalleryContent({
  children,
  className,
}: InteractiveGalleryContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        "[&>h1]:font-heading [&>h1]:text-xl [&>h1]:font-semibold [&>h1]:tracking-tight",
        "[&>h2]:font-heading [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:tracking-tight",
        "[&>h3]:font-heading [&>h3]:text-base [&>h3]:font-semibold [&>h3]:tracking-tight",
        "[&>h4]:font-heading [&>h4]:text-sm [&>h4]:font-semibold",
        "[&>p]:text-xs xs:text-sm [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:line-clamp-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

InteractiveGalleryMedia.displayName = "InteractiveGalleryMedia";
InteractiveGalleryContent.displayName = "InteractiveGalleryContent";

export {
  InteractiveGallery,
  InteractiveGalleryGroup,
  InteractiveGalleryMedia,
  InteractiveGalleryContent,
};
