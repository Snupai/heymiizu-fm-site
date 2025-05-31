"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef, memo, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Masonry from "react-masonry-css";
import { getDeviceType } from "../../utils/deviceType";
import { ProjectsSimple } from "./ProjectsSimple";
import type { Category } from "./ProjectsSimple";
import projectsData from "~/app/projects/projectsData";


interface MessageBubble {
  src: string;
  position: { x: number; y: number };
  side: "left" | "right";
  rotate: number;
  scale: number;
  pattern: {
    y: number;
    x: number;
    rotate: number;
    duration: number;
  };
}

interface Media {
  src: string;
  thumbnail?: string;
}

interface Project {
  title: string;
  description: string;
  media?: Media;
  aspect?: "16:9" | "4:3" | "3:4";
  link?: string;
}

// Create more natural, random-looking patterns
const createRandomPattern = () => {
  const baseAmplitude = 0.8;
  const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;
  
  return {
    y: randomRange(-baseAmplitude, baseAmplitude),
    x: randomRange(-0.4, 0.4),
    rotate: randomRange(-2, 2),
    duration: randomRange(4, 6)
  };
};

const messageBubbles: MessageBubble[] = [
  { 
    src: "/message_bubbles/nice_work.png", 
    position: { x: -42, y: -5 }, 
    side: "left", 
    rotate: -7, 
    scale: 0.9,
    pattern: createRandomPattern()
  },
  { 
    src: "/message_bubbles/the_climb.png", 
    position: { x: 42, y: 3 }, 
    side: "right", 
    rotate: 9, 
    scale: 0.8,
    pattern: createRandomPattern()
  },
];

// --- INLINE VideoPlayer ---
const LazyVideoPlayer = memo(function VideoPlayerWrapper(props: { src: string; poster: string; autoPlay?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.42;
      if (props.autoPlay) {
        void videoRef.current.play();
      }
    }
  }, [props.autoPlay]);
  return (
    <div className="absolute top-0 left-0 w-full h-full object-contain rounded-lg" style={{ borderRadius: 'inherit' }}>
      <video
        ref={videoRef}
        src={props.src}
        controls={true}
        poster={props.poster}
        className="w-full h-full object-contain rounded-lg"
        style={{ borderRadius: 'inherit' }}
        autoPlay={props.autoPlay}
        preload="none"
      />
    </div>
  );
});

// Card component supporting 16:9, 4:3 and 3:4 aspect ratios
function ProjectCard({
  project,
  categoryName,
  aspect,
  className,
}: {
  project: Project;
  categoryName: string;
  aspect?: "16:9" | "4:3" | "3:4";
  className?: string;
}) {
  // Use project.aspect if provided, else prop aspect, else default to 16:9
  const cardAspect = project.aspect ?? aspect ?? "16:9";
  // Tailwind aspect class
  let aspectClass = "aspect-video"; // 16:9
  if (cardAspect === "4:3") aspectClass = "aspect-[4/3]";
  if (cardAspect === "3:4") aspectClass = "aspect-[3/4]";
  if (cardAspect === "16:9") aspectClass = "aspect-[16/9]";

  const isSpecial = categoryName === "Special";

  // --- NEW: Track if video is playing ---
  const [isPlaying, setIsPlaying] = useState(false);

  const card = (
    <motion.div
      key={project.title}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.2,
        delay: 0.1,
        layout: {
          duration: 0.2,
          ease: "easeOut"
        }
      }}
      className={`rounded-xl shadow-lg overflow-hidden flex flex-col min-w-[500px] max-w-[500px] bg-white ${className ?? ""}`}
    >
      <div className={`relative w-full ${aspectClass} overflow-hidden`}>
        {/* Video thumbnail and play button overlay */}
        {project.media?.src && /\.(mp4|webm|ogg)(\?.*)?$/i.exec(project.media.src) ? (
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
                    src={project.media.thumbnail ?? "/dd8ushtKAafNiPreGQQfuOm10U.jpg"}
                    alt={project.title}
                    fill
                    className="object-cover w-full h-full absolute inset-0 z-10 rounded-xl"
                    unoptimized={false}
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
                poster={project.media.thumbnail ?? "/dd8ushtKAafNiPreGQQfuOm10U.jpg"}
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
              unoptimized={false}
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
          <span className="ml-auto px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-semibold flex items-center gap-1">
            {categoryName === "Photography" && (
              <span className="inline-block w-4 h-4 mr-1">
                {renderCategoryIcon("fx3-camera")}
              </span>
            )}
            {categoryName}
          </span>
        </div>
        <p className="text-gray-600 text-base">{project.description}</p>
      </div>
    </motion.div>
  );

  return isSpecial ? (
    <div className="special-gradient-outline-wrapper">
      <div className="special-gradient-outline-inner">
        {card}
      </div>
    </div>
  ) : card;
}

// Memoize ProjectCard to avoid unnecessary rerenders
const MemoizedProjectCard = memo(ProjectCard);

// Helper to render icons from string IDs
function renderCategoryIcon(icon: string) {
  switch (icon) {
    case "after-effects":
      return (
        <div className="relative w-6 h-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Image
              src="/Adobe_After_Effects_CC_Icon.png"
              alt="After Effects Icon"
              fill
              className="object-contain"
              loading="lazy"
            />
          </Suspense>
        </div>
      );
    case "fx3-camera":
      return (
        <div className="relative w-6 h-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Image
              src="/fx3_square.png"
              alt="FX3 Camera Icon"
              fill
              className="object-contain"
              loading="lazy"
            />
          </Suspense>
        </div>
      );
    default:
      return icon;
  }
}

// Memoize static header and message bubbles so they do not re-render on category change
const MemoizedHeader = memo(function Header() {
  return (
    <div className="w-full flex flex-col items-center relative mb-16">
      {/* Message bubbles absolutely positioned, stay at top */}
      <div className="absolute inset-0 overflow-visible pointer-events-none z-20">
        {messageBubbles.map((bubble, index) => (
          <motion.div
            key={bubble.src}
            className="absolute z-20 select-none"
            initial={{
              x: `${bubble.position.x}%`,
              y: `${bubble.position.y}%`,
              rotate: bubble.rotate,
              scale: 0,
              opacity: 0
            }}
            animate={{
              opacity: 1,
              scale: bubble.scale,
              y: [
                `${bubble.position.y}%`,
                `${bubble.position.y + 0.3}%`,
                `${bubble.position.y - 0.5}%`,
                `${bubble.position.y + 0.8}%`,
                `${bubble.position.y - 0.2}%`,
                `${bubble.position.y + 1.1}%`,
                `${bubble.position.y}%`
              ],
              x: [
                `${bubble.position.x}%`,
                `${bubble.position.x + 0.8}%`,
                `${bubble.position.x - 0.4}%`,
                `${bubble.position.x + 0.2}%`,
                `${bubble.position.x - 0.9}%`,
                `${bubble.position.x + 0.5}%`,
                `${bubble.position.x - 0.3}%`,
                `${bubble.position.x}%`
              ],
              rotate: [
                bubble.rotate,
                bubble.rotate + 1.5,
                bubble.rotate - 0.5,
                bubble.rotate + 0.8,
                bubble.rotate - 1.2,
                bubble.rotate + 0.3,
                bubble.rotate - 0.8,
                bubble.rotate
              ],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.2 + (index * 0.1) },
              scale: { 
                duration: 0.5,
                delay: 0.2 + (index * 0.1),
                ease: "easeOut"
              },
              y: { 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1]
              },
              x: { 
                duration: 9 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.15, 0.35, 0.5, 0.65, 0.8, 0.9, 1]
              },
              rotate: { 
                duration: 10 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.1, 0.25, 0.4, 0.6, 0.8, 0.9, 1]
              }
            }}
            style={{
              left: 0,
              top: 0,
              transformOrigin: "center",
            }}
          >
            <div className="w-[1000px] h-[440px] relative">
              <Suspense fallback={<div>Loading...</div>}>
                <Image
                  src={bubble.src}
                  alt={"Message bubble: " + bubble.src}
                  fill
                  className="object-contain select-none"
                  draggable={false}
                  unoptimized={true}
                  loading="lazy"
                />
              </Suspense>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Add padding-top to push content down, but not bubbles */}
      <div className="pt-56 w-full flex flex-col items-center">
        <motion.div 
          className="text-7xl font-bold mb-4 text-center relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          My Projects
        </motion.div>
        <motion.div 
          className="text-lg mb-4 text-center relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Here are some of my projects, feel free to browse :D
        </motion.div>
      </div>
    </div>
  );
});

export default function ProjectsPage() {
  const [deviceType, setDeviceType] = useState<null | "mobile" | "small" | "desktop">(null);
  const [activeCategory, setActiveCategory] = useState<string>("Everything");
  const searchParams = useSearchParams();

  const categories = projectsData;

  // Detect device type and automatically use simple version for small/mobile
  const isSimpleVersion = deviceType === "small" || deviceType === "mobile";

  // Memoize animation props for category-level motion.div
  const categoryMotionInitial = useMemo(() => ({ opacity: 0, y: 20 }), []);
  const categoryMotionAnimate = useMemo(() => ({ opacity: 1, y: 0 }), []);
  const categoryMotionExit = useMemo(() => ({ opacity: 0, y: 20 }), []);
  // Precompute reversed projects for all categories at the top level
  const reversedProjectsMap = useMemo(() => {
    const map: Record<string, Project[]> = {};
    categories.forEach((category: Category) => {
      map[category.name] = [...category.projects].reverse();
    });
    return map;
  }, [categories]);

  useEffect(() => {
    setDeviceType(getDeviceType());
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Convert URL parameter to category name format
      let categoryName = "Everything";
      
      if (categoryParam === "after-effects") {
        categoryName = "Animations";
      } else if (categoryParam === "photography") {
        categoryName = "Photography";
      } else if (categoryParam === "special") {
        categoryName = "Special";
      } else if (categoryParam === "commissions") {
        categoryName = "Commissions";
      }
      
      setActiveCategory(categoryName);
    }
  }, [searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      messageBubbles.forEach(bubble => {
        bubble.pattern = createRandomPattern();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    
    // Update URL with category parameter
    let categoryParam = "everything";
    
    if (categoryName === "Animations") {
      categoryParam = "after-effects";
    } else if (categoryName === "Photography") {
      categoryParam = "photography";
    } else if (categoryName === "Special") {
      categoryParam = "special";
    } else if (categoryName === "Commissions") {
      categoryParam = "commissions";
    }
    
    // Use window.history to update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('category', categoryParam);
    window.history.pushState({}, '', url.toString());
  };


  {/*if (deviceType === "mobile") return <MobileFallback />;*/}
  if (deviceType === "small" || deviceType === "mobile") {
    return (
      <ProjectsSimple
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
    );
  }
  const visibleCategories = categories.filter(cat => activeCategory === "Everything" || cat.name === activeCategory);

  return (
    <motion.div 
      className="flex-1 flex flex-col items-center justify-start w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <MemoizedHeader />
        {/* CATEGORY FILTERS & PROJECTS WRAPPER */}
        <div className="w-full">
          {/* Category Filters */}
          <motion.div 
            className="flex justify-center gap-8 mb-12 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Everything Button */}
            <button
              key="Everything"
              onClick={() => handleCategoryChange("Everything")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                activeCategory === "Everything"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center text-lg">&#9733;</span> {/* Star icon for Everything */}
              Everything
            </button>
            {categories.map((category: Category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                  activeCategory === category.name
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="flex items-center text-lg">{renderCategoryIcon(category.icon)}</span>
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Projects Section */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Categories */}
            {visibleCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.name}
                initial={categoryMotionInitial}
                animate={categoryMotionAnimate}
                exit={categoryMotionExit}
                transition={{
                  duration: 0.2,
                  delay: 0.1 + (categoryIndex * 0.05)
                }}
                className="mb-20 flex flex-col items-center w-full"
              >
                {/* Category Header */}
                <div className="mb-8 w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{renderCategoryIcon(category.icon)}</span>
                    <h3 className="text-3xl font-bold">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{category.description}</p>
                </div>
                {/* Category Projects */}
                {category.projects.length === 1 && category.projects[0] ? (
                  <MemoizedProjectCard
                    key={`single-project-${category.name}-0`}
                    project={category.projects[0]}
                    categoryName={category.name}
                    className="w-[750px] max-w-full mx-auto"
                  />
                ) : isSimpleVersion ? (
                  <div className="flex flex-wrap gap-8 w-full">
                    {(reversedProjectsMap[category.name] ?? []).map((project, idx) => {
                      const aspect = project.aspect;
                      if (
                        typeof project.title === "string" &&
                        typeof project.description === "string" &&
                        (
                          aspect === undefined ||
                          aspect === "16:9" ||
                          aspect === "4:3" ||
                          aspect === "3:4"
                        )
                      ) {
                        return (
                          <MemoizedProjectCard
                            key={`${category.name}-${idx}`}
                            project={project}
                            categoryName={category.name}
                          />
                        );
                      }
                      return null;
                    })}
                    {category.projects.length === 1 && (
                      <div key="placeholder" className="invisible" aria-hidden="true" />
                    )}
                  </div>
                ) : (
                  <Masonry
                    breakpointCols={{ default: 2, 768: 1 }}
                    className="flex gap-8 w-full"
                    columnClassName="masonry-column w-1/2 space-y-8 md:space-y-10"
                  >
                    {(reversedProjectsMap[category.name] ?? []).map((project, idx) => {
                      const aspect = project.aspect;
                      if (
                        typeof project.title === "string" &&
                        typeof project.description === "string" &&
                        (
                          aspect === undefined ||
                          aspect === "16:9" ||
                          aspect === "4:3" ||
                          aspect === "3:4"
                        )
                      ) {
                        return (
                          <MemoizedProjectCard
                            key={`${category.name}-${idx}`}
                            project={project}
                            categoryName={category.name}
                          />
                        );
                      }
                      return null;
                    })}
                    {category.projects.length === 1 && (
                      <div key="placeholder" className="invisible" aria-hidden="true" />
                    )}
                  </Masonry>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}