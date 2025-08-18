"use client";

import "../../styles/special-gradient-outline-simple.css";
import Image from "next/image";
import React, { useState, useRef, useEffect, memo, Suspense, useMemo } from "react";
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
  switch (icon) {
    case "after-effects":
      return (
        <div className="relative w-6 h-6">
          <Image
            src="/Adobe_After_Effects_CC_Icon.png"
            alt="After Effects Icon"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
      );
    case "fx3-camera":
      return (
        <div className="relative w-6 h-6">
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
    return /(?:^|\.)utfs\.io$/i.test(u.hostname) || /(?:^|\.)ufs\.sh$/i.test(u.hostname);
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
  onCategoryChange
}: {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}) {
  // Memoize safeCategories to ensure stable reference for downstream hooks
  const safeCategories = useMemo(() => (
    Array.isArray(categories)
      ? categories.filter(isValidCategory)
      : []
  ), [categories]);

  // Precompute reversed projects for all categories to avoid calling useMemo inside a callback
  const reversedProjectsByCategory = useMemo(() => {
    const mapping: Record<string, typeof safeCategories[0]['projects']> = {};
    safeCategories.forEach((cat) => {
      mapping[cat.name] = cat.projects.slice().reverse();
    });
    return mapping;
  }, [safeCategories]);

  // Local state for category selection (for fallback if parent doesn't update)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialActiveCategory || (safeCategories[0]?.name ?? ""));

  // Always use the parent value if provided
  const activeCategory = initialActiveCategory || selectedCategory;

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(name);
    if (onCategoryChange) onCategoryChange(name);
  };

  const MemoizedProjectCard = memo(ProjectCard);

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-white p-4 mt-20">
      {/* Category Tabs */}
      <div className="flex gap-4 mb-8 flex-wrap justify-center">
        {/* Everything Button */}
        <button
          key="Everything"
          className={`flex items-center gap-2 px-6 py-2 rounded-full border text-lg font-semibold transition-colors ${activeCategory === "Everything" ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand hover:bg-brand-light'}`}
          onClick={() => handleCategoryClick("Everything")}
        >
          <span className="flex items-center text-lg">Everything</span>
        </button>
        {safeCategories.map((category: Category) => (
          <button
            key={category.name}
            className={`flex items-center gap-2 px-6 py-2 rounded-full border text-lg font-semibold transition-colors ${activeCategory === category.name ? 'bg-brand text-white border-brand' : 'bg-white text-brand border-brand hover:bg-brand-light'}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <span className="flex items-center text-lg">{renderCategoryIcon(category.icon)}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      {/* Projects Display */}
      <div className="flex flex-col items-center w-full">
        {activeCategory === "Everything"
          ? safeCategories.map((cat) => {
              const reversedProjects = reversedProjectsByCategory[cat.name];
              return (
                <div key={cat.name} className="mb-20 w-full max-w-screen-lg px-4">
                  <div className="flex items-center gap-2 mb-4">
                    {renderCategoryIcon(cat.icon)}
                    <span className="text-xl font-semibold">{cat.name}</span>
                  </div>
                  <Masonry
                    breakpointCols={{ default: 2, 768: 1 }}
                    className="flex gap-8 w-full"
                    columnClassName="masonry-column w-1/2 space-y-8 md:space-y-10"
                  >
                    {reversedProjects && reversedProjects.length > 0 ? (
                      reversedProjects.map((project, idx) => (
                        <MemoizedProjectCard
                          key={project.title + '-' + idx}
                          project={project}
                          categoryName={cat.name}
                          aspect={project.aspect}
                        />
                      ))
                    ) : (
                      <div className="text-gray-400 italic">No projects yet.</div>
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
                  <div key={cat.name} className="mb-20 w-full max-w-screen-lg px-4">
                    <div className="flex items-center gap-2 mb-4">
                      {renderCategoryIcon(cat.icon)}
                      <span className="text-xl font-semibold">{cat.name}</span>
                    </div>
                    <Masonry
                      breakpointCols={{ default: 2, 768: 1 }}
                      className="flex gap-8 w-full"
                      columnClassName="masonry-column w-1/2 space-y-8 md:space-y-10"
                    >
                      {reversedProjects && reversedProjects.length > 0 ? (
                        reversedProjects.map((project, idx) => (
                          <MemoizedProjectCard
                            key={project.title + '-' + idx}
                            project={project}
                            categoryName={cat.name}
                            aspect={project.aspect}
                          />
                        ))
                      ) : (
                        <div className="text-gray-400 italic">No projects yet.</div>
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
const LazyVideoPlayer = memo(function VideoPlayerWrapper(props: { src: string; poster: string; autoPlay?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.volume = 0.42;
      
      const handleError = (e: Event) => {
        const target = e.target as HTMLVideoElement;
        const errorMessage = target.error ? 
          `Video error (${target.error.code}): ${target.error.message}` : 
          'Unknown video error';
        console.error('Video playback error:', errorMessage);
        setVideoError(errorMessage);
      };

      const handleCanPlay = () => {
        setVideoError(null);
        if (props.autoPlay) {
          video.play().catch(err => {
            console.error('Auto-play failed:', err);
            setVideoError('Auto-play failed: ' + err.message);
          });
        }
      };

      video.addEventListener('error', handleError);
      video.addEventListener('canplay', handleCanPlay);

      return () => {
        video.removeEventListener('error', handleError);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [props.autoPlay]);

  if (videoError) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">Video Error</div>
          <div className="text-sm text-gray-600">{videoError}</div>
          <button 
            onClick={() => {
              setVideoError(null);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full object-contain rounded-lg" style={{ borderRadius: 'inherit' }}>
      <video
        ref={videoRef}
        src={props.src}
        controls={true}
        poster={props.poster}
        className="w-full h-full object-contain rounded-lg"
        style={{ borderRadius: 'inherit' }}
        preload="metadata"
        playsInline
        webkit-playsinline={true}
        muted={false}
        onError={(e) => {
          const target = e.currentTarget;
          const errorMessage = target.error ? 
            `Video error (${target.error.code}): ${target.error.message}` : 
            'Unknown video error';
          console.error('Video element error:', errorMessage);
          setVideoError(errorMessage);
        }}
        onLoadStart={() => console.log('Video load started:', props.src)}
        onCanPlay={() => console.log('Video can play:', props.src)}
        onLoadedData={() => console.log('Video loaded data:', props.src)}
      />
    </div>
  );
});

export const ProjectCard = memo(function ProjectCard({
  project,
  categoryName,
  aspect
}: {
  project: Project;
  categoryName: string;
  aspect?: "16:9" | "4:3" | "3:4";
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
  const motionTransition = useMemo(() => ({
    duration: 0.2,
    delay: 0.1,
    layout: {
      duration: 0.2,
      ease: "easeOut"
    }
  }), []);

  const card = (
    <motion.div
      key={project.title}
      layout
      initial={motionInitial}
      animate={motionAnimate}
      exit={motionExit}
      transition={motionTransition}
      className={`rounded-xl shadow-lg overflow-hidden flex flex-col ${isSpecial ? 'min-w-[500px] max-w-[500px]' : 'w-full'} bg-white transition-all duration-200`}
    >
      <div className={`relative w-full ${aspectClass} overflow-hidden`}>
        {/* Video thumbnail and play button overlay */}
        {project.media?.src && isLikelyVideoUrl(project.media.src) ? (
          <>
            {!isPlaying && (
              <button
                className="absolute inset-0 w-full h-full z-20 cursor-pointer group"
                style={{ padding: 0, border: 'none' }}
                onClick={() => setIsPlaying(true)}
                aria-label="Play video"
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <Image
                    src={project.media?.thumbnail ?? "/dd8ushtKAafNiPreGQQfuOm10U.jpg"}
                    alt={project.title}
                    fill
                    className="object-cover w-full h-full absolute inset-0 z-10 rounded-xl"
                    // Avoid Next/Image optimizer for UploadThing hosts to prevent upstream timeouts
                    unoptimized={isExternalUrl(project.media?.thumbnail) && isUploadThingHost(project.media?.thumbnail)}
                    priority={false}
                    sizes="100vw"
                    style={{objectFit: 'cover', background: '#fff', border: 'none', boxShadow: 'none', transform: 'scale(1.01)'}}
                    loading="lazy"
                  />
                </Suspense>
                <span className="absolute inset-0 flex items-center justify-center z-20">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    style={{ opacity: 0.8, transition: 'opacity 0.2s', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.45))' }}
                    className="group-hover:opacity-100"
                  >
                    <polygon 
                      points="20,14 44,28 20,42" 
                      fill="white"
                    />
                  </svg>
                </span>
              </button>
            )}
            {isPlaying && (
              <LazyVideoPlayer
                src={project.media.src}
                poster={project.media?.thumbnail ?? "/dd8ushtKAafNiPreGQQfuOm10U.jpg"}
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
              className="object-cover w-full h-full"
              // Bypass optimizer for UploadThing/UTFS to prevent 500 timeouts on /_next/image proxy
              unoptimized={isExternalUrl(project.media?.src) && isUploadThingHost(project.media?.src)}
              priority={false}
              sizes="100vw"
              style={{objectFit: 'cover'}}
              loading="lazy"
            />
          </Suspense>
        )}
      </div>
      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 justify-end">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold">
            {project.link ? (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </span>
          <span className="ml-auto px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold flex items-center gap-1">{categoryName}</span>
        </div>
        <p className="text-gray-600 text-base">{project.description}</p>
      </div>
    </motion.div>
  );

  return isSpecial ? (
    <div className="special-gradient-outline-simple-wrapper">
      <div className="special-gradient-outline-simple-inner">
        {card}
      </div>
    </div>
  ) : card;
});
