"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../components/Logo";
import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Animation variants for staggered fade-in
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
    position: { x: -42, y: 5 }, 
    side: "left", 
    rotate: -7, 
    scale: 0.9,
    pattern: createRandomPattern()
  },
  { 
    src: "/message_bubbles/the_climb.png", 
    position: { x: 55, y: 23 }, 
    side: "right", 
    rotate: 9, 
    scale: 0.8,
    pattern: createRandomPattern()
  },
];

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// Create a separate component for the main content
function ProjectsContent() {
  const [activeCategory, setActiveCategory] = useState("Everything");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Define categories
  const categories = [
    { name: "Everything", icon: "•" },
    { 
      name: "Animations", 
      icon: (
        <div className="relative w-6 h-6">
          <Image
            src="/Adobe_After_Effects_CC_Icon.png"
            alt="After Effects Icon"
            fill
            className="object-contain"
          />
        </div>
      )
    },
    { name: "VFX", icon: "✨" },
    { 
      name: "Photography", 
      icon: (
        <div className="relative w-6 h-6">
          <Image
            src="/fx3_square.png"
            alt="FX3 Camera Icon"
            fill
            className="object-contain"
          />
        </div>
      )
    },
    { 
      name: "Commissions", 
      icon: "💼"
    },
  ];
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update active category based on URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Convert URL parameter to category name format
      let categoryName = "Everything";
      
      if (categoryParam === "after-effects") {
        categoryName = "Animations";
      } else if (categoryParam === "photography") {
        categoryName = "Photography";
      } else if (categoryParam === "vfx") {
        categoryName = "VFX";
      } else if (categoryParam === "commissions") {
        categoryName = "Commissions";
      }
      
      setActiveCategory(categoryName);
    }
  }, [searchParams]);

  // Update time for continuous animation
  useEffect(() => {
    const interval = setInterval(() => {
      messageBubbles.forEach(bubble => {
        bubble.pattern = createRandomPattern();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle link click for navigation
  const handleLinkClick = (_e: React.MouseEvent, _href: string) => {
    // Disable transition animation for navigation
    // No need to set isTransitioning or nextPage
  };

  // Handle category change
  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    
    // Update URL with category parameter
    let categoryParam = "everything";
    
    if (categoryName === "Animations") {
      categoryParam = "after-effects";
    } else if (categoryName === "Photography") {
      categoryParam = "photography";
    } else if (categoryName === "VFX") {
      categoryParam = "vfx";
    } else if (categoryName === "Commissions") {
      categoryParam = "commissions";
    }
    
    // Use window.history to update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('category', categoryParam);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden">
      {/* Logo */}
      <motion.div 
        className="fixed top-8 left-[20%] z-30"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Logo />
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-20"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Base layer: Full height, no blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-white/60" />
        
        {/* Middle blur layer: Overlapping gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-white/70" style={{
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          maskImage: 'linear-gradient(to top, transparent, white 50%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent, white 50%)'
        }} />
        
        {/* Top blur layer: Maximum blur with fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/60 to-white/80" style={{
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          maskImage: 'linear-gradient(to top, transparent 30%, white)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 30%, white)'
        }} />

        <div className="container mx-auto px-12 py-8 relative">
          <ul className="flex gap-12 text-lg justify-end">
            <li>
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group hover:scale-105"
              >
                <Link href="/" className="relative block" onClick={(e) => handleLinkClick(e, "/")}>
                  <span className={`relative z-10 ${pathname === "/" ? "text-[#fc87f0]" : ""}`}>Home</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                        backdropFilter: "blur(2px)",
                      }}
                      variants={{
                        initial: {
                          opacity: 0,
                          scale: 0,
                          x: 0,
                          y: 0,
                        },
                        hover: {
                          opacity: [0, 1, 1, 1, 0],
                          scale: [0, 1, 1, 1, 0],
                          x: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.cos(angle) * 40;
                          }),
                          y: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.sin(angle) * 40;
                          }),
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.1, 0.5, 0.9, 1]
                          }
                        }
                      }}
                    />
                  ))}
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group hover:scale-105"
              >
                <Link href="/projects" className="relative block" onClick={(e) => handleLinkClick(e, "/projects")}>
                  <span className={`relative z-10 ${pathname === "/projects" ? "text-[#fc87f0]" : ""}`}>Projects</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                        backdropFilter: "blur(2px)",
                      }}
                      variants={{
                        initial: {
                          opacity: 0,
                          scale: 0,
                          x: 0,
                          y: 0,
                        },
                        hover: {
                          opacity: [0, 1, 1, 1, 0],
                          scale: [0, 1, 1, 1, 0],
                          x: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.cos(angle) * 40;
                          }),
                          y: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.sin(angle) * 40;
                          }),
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.1, 0.5, 0.9, 1]
                          }
                        }
                      }}
                    />
                  ))}
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group hover:scale-105"
              >
                <Link href="/contact" className="relative block" onClick={(e) => handleLinkClick(e, "/contact")}>
                  <span className={`relative z-10 ${pathname === "/contact" ? "text-[#fc87f0]" : ""}`}>Contact Me</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#319aef]"
                    initial={{ width: "0%" }}
                    variants={{
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                        backdropFilter: "blur(2px)",
                      }}
                      variants={{
                        initial: {
                          opacity: 0,
                          scale: 0,
                          x: 0,
                          y: 0,
                        },
                        hover: {
                          opacity: [0, 1, 1, 1, 0],
                          scale: [0, 1, 1, 1, 0],
                          x: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.cos(angle) * 40;
                          }),
                          y: Array(60).fill(0).map((_, i) => {
                            const angle = (i / 60) * Math.PI * 2 + (index * (2 * Math.PI / 3));
                            return Math.sin(angle) * 40;
                          }),
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.1, 0.5, 0.9, 1]
                          }
                        }
                      }}
                    />
                  ))}
                </Link>
              </motion.div>
            </li>
          </ul>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.div 
        className="relative flex flex-col items-center justify-start min-h-screen max-w-7xl mx-auto pt-32 px-4"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        transition={{ duration: 0.8 }}
      >
        {/* Floating Message Bubbles */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
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
                  `${bubble.position.y - 1.2}%`,
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
                <Image
                  src={bubble.src}
                  alt="Message Bubble"
                  fill
                  className="object-contain pointer-events-none"
                  priority
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.h1 
          className="text-7xl font-bold mb-4 text-center z-50 relative mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          My Projects
        </motion.h1>
        
        <motion.p 
          className="text-lg mb-12 text-center z-50 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Here are some of my projects, feel free to browse :D
        </motion.p>

        {/* Category Filters */}
        <motion.div 
          className="flex gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryChange(category.name)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                activeCategory === category.name
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center text-lg">{category.icon}</span>
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
          {[
            {
              name: "Animations",
              description: "Animations made with After Effects, Premiere Pro, Photoshop, FIGMA and Blender",
              icon: (
                <div className="relative w-6 h-6">
                  <Image
                    src="/Adobe_After_Effects_CC_Icon.png"
                    alt="After Effects Icon"
                    fill
                    className="object-contain"
                  />
                </div>
              ),
              projects: [
                { title: "Animation Project 1", description: "A placeholder animation project showcasing various techniques." },
                { title: "Animation Project 2", description: "A placeholder animation project showcasing various techniques." }
              ]
            },
            {
              name: "VFX",
              description: "Visual effects and motion graphics created for various projects",
              icon: "✨",
              projects: [
                { title: "VFX Project 1", description: "A placeholder VFX project with stunning visual effects." },
                { title: "VFX Project 2", description: "A placeholder VFX project with stunning visual effects." }
              ]
            },
            {
              name: "Photography",
              description: "Photos and cinematic video projects I made",
              icon: (
                <div className="relative w-6 h-6">
                  <Image
                    src="/fx3_square.png"
                    alt="FX3 Camera Icon"
                    fill
                    className="object-contain"
                  />
                </div>
              ),
              projects: [
                { title: "Photography Project 1", description: "A placeholder photography project capturing beautiful moments." },
                { title: "Photography Project 2", description: "A placeholder photography project capturing beautiful moments." }
              ]
            },
            {
              name: "Commissions",
              description: "Custom projects created for clients",
              icon: "💼",
              projects: [
                { title: "Commission Project 1", description: "A custom project created for a client." },
                { title: "Commission Project 2", description: "A custom project created for a client." }
              ]
            }
          ]
            .filter(category => activeCategory === "Everything" || category.name === activeCategory)
            .map((category, categoryIndex) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ 
                  duration: 0.2,
                  delay: 0.1 + (categoryIndex * 0.05)
                }}
                className="mb-20"
              >
                {/* Category Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-3xl font-bold">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{category.description}</p>
                </div>

                {/* Category Projects */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  layout
                >
                  {category.projects.map((project, index) => (
                    <motion.div 
                      key={project.title}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ 
                        duration: 0.2,
                        delay: 0.1 + (index * 0.05),
                        layout: {
                          duration: 0.2,
                          ease: "easeOut"
                        }
                      }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="relative h-64">
                        <Image
                          src="/dd8ushtKAafNiPreGQQfuOm10U.jpg"
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 relative">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold">{project.title}</h3>
                          {/* Category Badge */}
                          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            category.name === "Animations" 
                              ? "bg-purple-100 text-purple-700"
                              : category.name === "VFX"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-pink-100 text-pink-700"
                          }`}>
                            <span className="flex items-center gap-1.5">
                              {category.name === "Animations" && (
                                <div className="relative w-5 h-5">
                                  <Image
                                    src="/Adobe_After_Effects_CC_Icon.png"
                                    alt="After Effects Icon"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              {category.name === "VFX" && "✨ "}
                              {category.name === "Photography" && (
                                <div className="relative w-5 h-5">
                                  <Image
                                    src="/fx3_square.png"
                                    alt="FX3 Camera Icon"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              {category.name}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600">{project.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>

      {/* Footer Section */}
      <div className="w-screen bg-[#520066] relative left-[50%] right-[50%] mr-[-50vw] ml-[-50vw]">
        <div className="py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col">
              {/* Main Footer Content */}
              <div className="flex items-center justify-between mb-4">
                {/* Left Side: Logo and Email */}
                <div className="flex items-center space-x-6">
                  <Link href="/" className="w-12 h-12 relative">
                    <Image
                      src="/Sentimental_Icon_white.png"
                      alt="Miizu Logo"
                      fill
                      className="object-contain"
                    />
                  </Link>
                  <a 
                    href="mailto:hey@miizumelon.de"
                    className="text-white text-base hover:text-[#fc87f0] transition-colors duration-300"
                  >
                    hey@miizumelon.de
                  </a>
                </div>

                {/* Right Side: Social Links */}
                <div className="flex space-x-6">
                  <a 
                    href="https://x.com/heymiizu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white text-base hover:text-[#fc87f0] transition-colors duration-300"
                  >
                    Twitter
                  </a>
                  <a 
                    href="https://www.instagram.com/miizumelon/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white text-base hover:text-[#fc87f0] transition-colors duration-300"
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://www.youtube.com/@Miizumelon" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white text-base hover:text-[#fc87f0] transition-colors duration-300"
                  >
                    YouTube
                  </a>
                </div>
              </div>

              {/* Made with Heart - Centered at Bottom */}
              <div className="flex justify-center border-t border-white/10 pt-3">
                <div className="text-white text-xs flex items-center space-x-1 opacity-70">
                  <span>Made with</span>
                  <motion.span
                    className="text-[#fc87f0]"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    ❤️
                  </motion.span>
                  <span>by</span>
                    <a 
                      href="https://snupai.me" 
                      target="_blank" 
                      className="hover:text-white transition-colors duration-300"
                    >
                      Snupai
                    </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Main component with Suspense boundary
export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold">Loading projects...</div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
} 