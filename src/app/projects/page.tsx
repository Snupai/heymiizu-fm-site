"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, memo, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Masonry from "react-masonry-css";
import { getDeviceType } from "../../utils/deviceType";
import { ProjectsSimple, ProjectCard } from "./ProjectsSimple";
import type { Category } from "./ProjectsSimple";
import { supabase } from "@/lib/supabase/client";
import { Suspense } from "react";

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

function renderCategoryIcon(icon: string) {
  // Check if icon is a path (starts with /) or has image extension
  if (icon.startsWith("/") || /\.(png|jpg|jpeg|svg|webp)$/i.test(icon)) {
    return (
      <div className="relative w-6 h-6">
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

// MemoizedHeader
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

// MemoizedProjectCard
const MemoizedProjectCard = memo(ProjectCard);

// Animation variants
const categoryMotionInitial = { opacity: 0, y: 20 };
const categoryMotionAnimate = { opacity: 1, y: 0 };
const categoryMotionExit = { opacity: 0, y: -20 };

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [deviceType, setDeviceType] = useState("desktop");

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("order_index");

      if (categoriesError) throw categoriesError;

      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

      if (projectsError) throw projectsError;

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const categoriesWithProjects: Category[] = categoriesData.map((category) => ({
        name: category.name,
        icon: category.icon ?? "",
        description: category.description ?? undefined,
        projects: projectsData
          .filter((p) => p.category_id === category.id)
          .map((p) => ({
            title: p.title,
            description: p.description ?? "",
            media: {
              src: p.video_url,
              thumbnail: p.thumbnail_url,
            },
            link: p.external_link ?? undefined,
            isNew: new Date(p.created_at) > oneWeekAgo,
            aspect: p.aspect_ratio ?? undefined,
          })),
      }));

      setCategories(categoriesWithProjects);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

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
      let categoryName = "Everything";
      if (categoryParam === "after-effects") {
        categoryName = "Animations";
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
    let categoryParam = "everything";
    if (categoryName === "Animations") {
      categoryParam = "after-effects";
    } else if (categoryName === "Special") {
      categoryParam = "special";
    } else if (categoryName === "Commissions") {
      categoryParam = "commissions";
    }
    const url = new URL(window.location.href);
    url.searchParams.set('category', categoryParam);
    window.history.pushState({}, '', url.toString());
  };

  const reversedProjectsMap = useMemo(() => {
    const mapping: Record<string, Project[]> = {};
    categories.forEach((cat) => {
      mapping[cat.name] = cat.projects.slice().reverse();
    });
    return mapping;
  }, [categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  const isSimpleVersion = deviceType === "small" || deviceType === "mobile";
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

        {isSimpleVersion ? (
          <ProjectsSimple
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        ) : (
          <div className="w-full">
            <motion.div
              className="flex justify-center gap-8 mb-12 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <button
                key="Everything"
                onClick={() => handleCategoryChange("Everything")}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeCategory === "Everything"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <span className="flex items-center text-lg">&#9733;</span>
                Everything
              </button>
              {categories.map((category: Category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeCategory === category.name
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <span className="flex items-center text-lg">{renderCategoryIcon(category.icon)}</span>
                  {category.name}
                </button>
              ))}
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
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
                  <div className="mb-8 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{renderCategoryIcon(category.icon)}</span>
                      <h3 className="text-3xl font-bold">{category.name}</h3>
                    </div>
                    <p className="text-gray-600 text-lg">{category.description}</p>
                  </div>
                  {category.projects.length === 1 && category.projects[0] ? (
                    <MemoizedProjectCard
                      key={`single-project-${category.name}-0`}
                      project={category.projects[0]}
                      categoryName={category.name}
                      gold={category.name === "Special"}
                    />
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
                              gold={category.name === "Special" && idx === 0}
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
        )}
      </div>
    </motion.div>
  );
}