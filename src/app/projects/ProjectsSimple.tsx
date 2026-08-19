"use client";

import "../../styles/special-gradient-outline-simple.css";
import Image from "next/image";
import React, {
  useState,
  useRef,
  useEffect,
  memo,
  Suspense,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";

// Types copied from page.tsx for self-containment
export type Media = {
  src: string;
  thumbnail?: string;
};

export type Project = {
  title: string;
  description: string;
  media?: Media;
  aspect?: "16:9" | "4:3" | "3:4";
  link?: string;
  categoryName?: string;
  categoryIcon?: string;
  isNew?: boolean;
};

export interface Category {
  name: string;
  icon: string;
  description?: string;
  projects: Project[];
}

function isValidCategory(category: unknown): category is Category {
  return (
    typeof category === "object" &&
    category !== null &&
    Array.isArray((category as Category).projects)
  );
}

// Helper to render icons from string IDs
function renderCategoryIcon(icon: string) {
  // Check if icon is a path (starts with /) or has image extension
  if (icon.startsWith("/") || /\.(png|jpg|jpeg|svg|webp)$/i.test(icon)) {
    return (
      <div className="relative h-6 w-6">
        <Image
          src={icon}
          alt="Category Icon"
          fill
          className="object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  switch (icon) {
    case "fx3-camera":
      return (
        <div className="relative h-6 w-6">
          <Image
            src="/fx3_square.png"
            alt="FX3 Camera Icon"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
      );
    default:
      return icon;
  }
}

// Helpers for UploadThing/UTFS URLs and media type inference
function isExternalUrl(url?: string): boolean {
  return !!url && /^https?:\/\//i.test(url);
}

function isUploadThingHost(url?: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return (
      /(?:^|\.)utfs\.io$/i.test(u.hostname) ||
      /(?:^|\.)ufs\.sh$/i.test(u.hostname)
    );
  } catch {
    return false;
  }
}

function hasImageExtension(url?: string): boolean {
  if (!url) return false;
  return /\.(?:avif|webp|png|jpe?g|gif|svg)(?:\?.*)?$/i.test(url);
}

function hasVideoExtension(url?: string): boolean {
  if (!url) return false;
  return /\.(?:mp4|webm|ogg)(?:\?.*)?$/i.test(url);
}

function isLikelyVideoUrl(url?: string): boolean {
  if (!url) return false;
  if (hasVideoExtension(url)) return true;
  // Heuristic: UploadThing/UTFS often omits extensions; treat as video when not image-like
  if (isUploadThingHost(url) && !hasImageExtension(url)) return true;
  return false;
}

export function ProjectsSimple({
  categories,
  activeCategory: initialActiveCategory,
  onCategoryChange,
}: {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}) {
  // Memoize safeCategories to ensure stable reference for downstream hooks
  const safeCategories = useMemo(
    () => (Array.isArray(categories) ? categories.filter(isValidCategory) : []),
    [categories],
  );

  // Precompute reversed projects for all categories to avoid calling useMemo inside a callback
  const reversedProjectsByCategory = useMemo(() => {
    const mapping: Record<string, (typeof safeCategories)[0]["projects"]> = {};
    safeCategories.forEach((cat) => {
      mapping[cat.name] = cat.projects.slice().reverse();
    });
    return mapping;
  }, [safeCategories]);

  // Local state for category selection (for fallback if parent doesn't update)
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialActiveCategory || (safeCategories[0]?.name ?? ""),
  );

  // Always use the parent value if provided
  const activeCategory = initialActiveCategory || selectedCategory;

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(name);
    if (onCategoryChange) onCategoryChange(name);
  };

  const MemoizedProjectCard = memo(ProjectCard);

  return (
    <main className="mt-20 flex min-h-screen w-full flex-col items-center bg-white p-4">
      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {/* Everything Button */}
        <button
          key="Everything"
          className={`flex items-center gap-2 rounded-full border px-6 py-2 text-lg font-semibold transition-colors ${activeCategory === "Everything" ? "border-brand bg-brand text-white" : "border-brand bg-white text-brand hover:bg-brand-light"}`}
          onClick={() => handleCategoryClick("Everything")}
        >
          <span className="flex items-center text-lg">Everything</span>
        </button>
        {safeCategories.map((category: Category) => (
          <button
            key={category.name}
            className={`flex items-center gap-2 rounded-full border px-6 py-2 text-lg font-semibold transition-colors ${activeCategory === category.name ? "border-brand bg-brand text-white" : "border-brand bg-white text-brand hover:bg-brand-light"}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <span className="flex items-center text-lg">
              {renderCategoryIcon(category.icon)}
            </span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      {/* Projects Display */}
      <div className="flex w-full flex-col items-center">
        {activeCategory === "Everything"
          ? safeCategories.map((cat) => {
              const reversedProjects = reversedProjectsByCategory[cat.name];
              return (
                <div
                  key={cat.name}
                  className="mb-20 w-full max-w-screen-lg px-4"
                >
                  <div className="mb-4 flex items-center gap-2">
                    {renderCategoryIcon(cat.icon)}
                    <span className="text-xl font-semibold">{cat.name}</span>
                  </div>
                  <Masonry
                    breakpointCols={{ default: 2, 768: 1 }}
                    className="flex w-full gap-8"
                    columnClassName="masonry-column w-1/2 space-y-8 md:space-y-10"
                  >
                    {reversedProjects && reversedProjects.length > 0 ? (
                      reversedProjects.map((project, idx) => (
                        <MemoizedProjectCard
                          key={project.title + "-" + idx}
                          project={project}
                          categoryName={cat.name}
                          aspect={project.aspect}
                          gold={cat.name === "Special" && idx === 0}
                        />
                      ))
                    ) : (
                      <div className="italic text-gray-400">
                        No projects yet.
                      </div>
                    )}
                  </Masonry>
                </div>
              );
            })
          : safeCategories
              .filter((cat) => cat.name === activeCategory)
              .map((cat) => {
                const reversedProjects = reversedProjectsByCategory[cat.name];
                return (
                  <div
                    key={cat.name}
                    className="mb-20 w-full max-w-screen-lg px-4"
                  >
                    <div className="mb-4 flex items-center gap-2">
                      {renderCategoryIcon(cat.icon)}
                      <span className="text-xl font-semibold">{cat.name}</span>
                    </div>
                    <Masonry
                      breakpointCols={{ default: 2, 768: 1 }}
                      className="flex w-full gap-8"
                      columnClassName="masonry-column w-1/2 space-y-8 md:space-y-10"
                    >
                      {reversedProjects && reversedProjects.length > 0 ? (
                        reversedProjects.map((project, idx) => (
                          <MemoizedProjectCard
                            key={project.title + "-" + idx}
                            project={project}
                            categoryName={cat.name}
                            aspect={project.aspect}
                            gold={cat.name === "Special" && idx === 0}
                          />
                        ))
                      ) : (
                        <div className="italic text-gray-400">
                          No projects yet.
                        </div>
                      )}
                    </Masonry>
                  </div>
                );
              })}
      </div>
    </main>
  );
}

// --- INLINE VideoPlayer ---
const LazyVideoPlayer = memo(function VideoPlayerWrapper(props: {
  src: string;
  poster: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.volume = 0.42;

      const handleError = (e: Event) => {
        const target = e.target as HTMLVideoElement;
        const errorMessage = target.error
          ? `Video error (${target.error.code}): ${target.error.message}`
          : "Unknown video error";
        console.error("Video playback error:", errorMessage);
        setVideoError(errorMessage);
      };

      const handleCanPlay = () => {
        setVideoError(null);
        if (props.autoPlay) {
          video.play().catch((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Auto-play failed:", err);
            setVideoError("Auto-play failed: " + message);
          });
        }
      };

      video.addEventListener("error", handleError);
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("error", handleError);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [props.autoPlay]);

  if (videoError) {
    return (
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
        <div className="p-4 text-center">
          <div className="mb-2 text-red-500">Video Error</div>
          <div className="text-sm text-gray-600">{videoError}</div>
          <button
            onClick={() => {
              setVideoError(null);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="mt-2 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute left-0 top-0 h-full w-full rounded-lg object-contain"
      style={{ borderRadius: "inherit" }}
    >
      <video
        ref={videoRef}
        src={props.src}
        controls={true}
        poster={props.poster}
        className="h-full w-full rounded-lg object-contain"
        style={{ borderRadius: "inherit" }}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        preload="metadata"
        playsInline
        webkit-playsinline="true"
        muted={false}
        onError={(e) => {
          const target = e.currentTarget;
          const errorMessage = target.error
            ? `Video error (${target.error.code}): ${target.error.message}`
            : "Unknown video error";
          console.error("Video element error:", errorMessage);
          setVideoError(errorMessage);
        }}
        onLoadStart={() => console.log("Video load started:", props.src)}
        onCanPlay={() => console.log("Video can play:", props.src)}
        onLoadedData={() => console.log("Video loaded data:", props.src)}
      />
    </div>
  );
});

export const ProjectCard = memo(function ProjectCard({
  project,
  categoryName,
  aspect,
  gold,
}: {
  project: Project;
  categoryName: string;
  aspect?: "16:9" | "4:3" | "3:4";
  gold?: boolean;
}) {
  const cardAspect = project.aspect ?? aspect ?? "16:9";
  let aspectClass = "aspect-video";
  if (cardAspect === "4:3") aspectClass = "aspect-[4/3]";
  if (cardAspect === "3:4") aspectClass = "aspect-[3/4]";
  if (cardAspect === "16:9") aspectClass = "aspect-[16/9]";

  const isSpecial = categoryName === "Special";

  // --- NEW: Track if video is playing ---
  const [isPlaying, setIsPlaying] = useState(false);

  // Memoize motion.div props to avoid new object references on each render
  const motionInitial = useMemo(() => ({ opacity: 0, scale: 0.95 }), []);
  const motionAnimate = useMemo(() => ({ opacity: 1, scale: 1 }), []);
  const motionExit = useMemo(() => ({ opacity: 0, scale: 0.95 }), []);
  const motionTransition = useMemo(
    () => ({
      duration: 0.2,
      delay: 0.1,
      layout: {
        duration: 0.2,
        ease: "easeOut",
      },
    }),
    [],
  );

  const card = (
    <motion.div
      key={project.title}
      layout
      initial={motionInitial}
      animate={motionAnimate}
      exit={motionExit}
      transition={motionTransition}
      className={`relative flex flex-col overflow-hidden rounded-xl shadow-lg ${isSpecial ? "min-w-[500px] max-w-[500px]" : "w-full"} bg-white transition-all duration-200`}
    >
      <div className={`relative w-full ${aspectClass} overflow-hidden`}>
        {/* Video thumbnail and play button overlay */}
        {project.media?.src && isLikelyVideoUrl(project.media.src) ? (
          <>
            {!isPlaying && (
              <button
                className="group absolute inset-0 z-20 h-full w-full cursor-pointer"
                style={{ padding: 0, border: "none" }}
                onClick={() => setIsPlaying(true)}
                aria-label="Play video"
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <Image
                    src={
                      project.media?.thumbnail ??
                      "/dd8ushtKAafNiPreGQQfuOm10U.jpg"
                    }
                    alt={project.title}
                    fill
                    className="absolute inset-0 z-10 h-full w-full rounded-xl object-cover"
                    // Avoid Next/Image optimizer for UploadThing hosts to prevent upstream timeouts
                    unoptimized={
                      isExternalUrl(project.media?.thumbnail) &&
                      isUploadThingHost(project.media?.thumbnail)
                    }
                    priority={false}
                    sizes="100vw"
                    style={{
                      objectFit: "cover",
                      background: "#fff",
                      border: "none",
                      boxShadow: "none",
                      transform: "scale(1.01)",
                    }}
                    loading="lazy"
                  />
                </Suspense>
                <span className="absolute inset-0 z-20 flex items-center justify-center">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    style={{
                      opacity: 0.8,
                      transition: "opacity 0.2s",
                      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45))",
                    }}
                    className="group-hover:opacity-100"
                  >
                    <polygon points="20,14 44,28 20,42" fill="white" />
                  </svg>
                </span>
              </button>
            )}
            {isPlaying && (
              <LazyVideoPlayer
                src={project.media.src}
                poster={
                  project.media?.thumbnail ?? "/dd8ushtKAafNiPreGQQfuOm10U.jpg"
                }
                autoPlay={true}
              />
            )}
          </>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <Image
              src={project.media?.src ?? "/dd8ushtKAafNiPreGQQfuOm10U.jpg"}
              alt={project.title}
              fill
              className="h-full w-full object-cover"
              // Bypass optimizer for UploadThing/UTFS to prevent 500 timeouts on /_next/image proxy
              unoptimized={
                isExternalUrl(project.media?.src) &&
                isUploadThingHost(project.media?.src)
              }
              priority={false}
              sizes="100vw"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </Suspense>
        )}
      </div>
      {/* New Badge */}
      {project.isNew && (
        <div className="absolute right-3 top-3 z-30 rounded-full bg-brand px-2 py-1 text-xs font-bold text-white shadow-md">
          NEW
        </div>
      )}
      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-end p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg font-bold">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </span>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
            {categoryName}
          </span>
        </div>
        <p className="text-base text-gray-600">{project.description}</p>
      </div>
    </motion.div>
  );

  return isSpecial ? (
    <div
      className={`special-gradient-outline-simple-wrapper${gold ? "special-gradient-outline-simple-wrapper--gold" : ""}`}
    >
      <div className="special-gradient-outline-simple-inner">{card}</div>
    </div>
  ) : (
    card
  );
});
