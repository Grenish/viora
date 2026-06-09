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

// Types
interface GalleryContextValue {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  count: number;
}

interface InteractiveGalleryProps {
  children: React.ReactNode;
  className?: string;
}

interface InteractiveGalleryGroupProps {
  children: React.ReactNode;
  className?: string;
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

// Contexts
const GalleryContext = createContext<GalleryContextValue | null>(null);

function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);
  if (!ctx)
    throw new Error(
      "InteractiveGallery compound components must be used within <InteractiveGallery>",
    );
  return ctx;
}

// Spring presets (fine-tuned for buttery-smooth fluid transitions)
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

// Wrap Card with motion
const MotionCard = motion.create(Card);

// InteractiveGallery (root)
function InteractiveGallery({ children, className }: InteractiveGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const childArray = React.Children.toArray(children);
  const count = childArray.length;

  const ctx = useMemo<GalleryContextValue>(
    () => ({ activeId, setActiveId, count }),
    [activeId, count],
  );

  return (
    <GalleryContext.Provider value={ctx}>
      <div
        className={cn(
          "flex flex-col md:flex-row gap-3 w-full h-auto md:h-120",
          className,
        )}
        onMouseLeave={() => setActiveId(null)}
      >
        {children}
      </div>
    </GalleryContext.Provider>
  );
}

// InteractiveGalleryGroup
function InteractiveGalleryGroup({
  children,
  className,
}: InteractiveGalleryGroupProps) {
  const id = useId();
  const { activeId, setActiveId, count } = useGallery();
  const isActive = activeId === id;
  const hasActive = activeId !== null;

  // Separate media and content children based on their props, ensuring full compatibility with Server Component rendering
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
      {/* ── Desktop card ── */}
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
        {/* Image area */}
        <motion.div
          className="relative w-full overflow-hidden shrink-0"
          transition={springLayout}
          animate={{
            height: isActive ? 320 : 480,
          }}
        >
          {mediaChild}
        </motion.div>

        {/* Overlay gradient for inactive cards */}
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

        {/* Content area — only visible when active */}
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

        {/* Title preview in strip mode (inactive, with an active card present) */}
        <AnimatePresence>
          {hasActive && !isActive && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Pulls first heading from content for the strip label */}
              <StripLabel>{contentChild}</StripLabel>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionCard>

      {/* ── Mobile card ── */}
      <MobileCard
        isActive={isActive}
        onToggle={() => setActiveId(isActive ? null : id)}
        mediaChild={mediaChild}
        contentChild={contentChild}
        className={className}
      />
    </>
  );
}

// StripLabel — extracts the first heading text for inactive strip preview
function StripLabel({ children }: { children: React.ReactNode }) {
  if (!React.isValidElement(children)) return null;
  const element = children as React.ReactElement<{ children: React.ReactNode }>;

  // InteractiveGalleryContent wraps user children
  const inner = element.props.children;
  const childArray = React.Children.toArray(inner);

  // Find the first heading-like element
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

// MobileCard — accordion-style expansion for small screens
function MobileCard({
  isActive,
  onToggle,
  mediaChild,
  contentChild,
  className,
}: {
  isActive: boolean;
  onToggle: () => void;
  mediaChild: React.ReactNode;
  contentChild: React.ReactNode;
  className?: string;
}) {
  return (
    <MotionCard
      className={cn(
        "md:hidden flex flex-col relative cursor-pointer p-0 gap-0 select-none",
        isActive && "shadow-lg ring-foreground/10",
        className,
      )}
      transition={springLayout}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
    >
      {/* Image — shorter when collapsed, taller when active */}
      <motion.div
        className="relative w-full overflow-hidden"
        transition={springLayout}
        animate={{ height: isActive ? 240 : 160 }}
      >
        {mediaChild}

        {/* Gradient overlay when collapsed */}
        <AnimatePresence>
          {!isActive && (
            <motion.div
              className="absolute inset-0 bg-linear-to-t from-background/50 via-transparent to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Collapsed label */}
        <AnimatePresence>
          {!isActive && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <StripLabel>{contentChild}</StripLabel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Content — accordion expand */}
      <AnimatePresence>
        {isActive && contentChild && (
          <motion.div
            key="mobile-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={springContent}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 py-3">{contentChild}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionCard>
  );
}

// InteractiveGalleryMedia
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

// InteractiveGalleryContent
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
        "[&>p]:text-sm [&>p]:text-muted-foreground [&>p]:leading-relaxed",
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
