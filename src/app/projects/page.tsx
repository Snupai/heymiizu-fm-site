"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Masonry from "react-masonry-css";

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

type Media = {
  src: string;
  thumbnail?: string;
};

type Project = {
  title: string;
  description: string;
  media?: Media;
  aspect?: "16:9" | "4:3" | "3:4";
  link?: string; // Optional hyperlink for the project title
};

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
    position: { x: 55, y: 3 }, 
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

function VideoPlayer({ src, poster }: { src: string; poster: string }) {
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setShowControls(true);
    void videoRef.current?.play();
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full object-contain rounded-lg bg-black" style={{ borderRadius: 'inherit', background: '#000' }}>
      {!showControls && (
        <button
          className="absolute inset-0 flex items-center justify-center w-full h-full z-10 cursor-pointer hover:cursor-pointer"
          onClick={handlePlay}
          style={{ background: "rgba(0,0,0,0.3)" }}
          aria-label="Play video"
        >
          <svg width="64" height="64" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
      )}
      <video
        ref={videoRef}
        src={src}
        controls={showControls}
        poster={poster}
        className="w-full h-full object-contain rounded-lg"
        style={{ borderRadius: 'inherit', background: '#000' }}
        onPlay={() => setShowControls(true)}
      />
    </div>
  );
}

// Card component supporting 16:9, 4:3 and 3:4 aspect ratios
function ProjectCard({
  project,
  categoryName,
  aspect
}: {
  project: Project;
  categoryName: string;
  aspect?: "16:9" | "4:3" | "3:4";
}) {
  // Use project.aspect if provided, else prop aspect, else default to 16:9
  const cardAspect = project.aspect ?? aspect ?? "16:9";
  // Tailwind aspect class
  let aspectClass = "aspect-video"; // 16:9
  if (cardAspect === "4:3") aspectClass = "aspect-[4/3]";
  if (cardAspect === "3:4") aspectClass = "aspect-[3/4]";
  if (cardAspect === "16:9") aspectClass = "aspect-[16/9]";
  return (
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
      className="break-inside-avoid mb-8 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col min-w-[500px] max-w-[500px]"
    >
      <div className={`relative w-full ${aspectClass}`}>
        {project.media?.src && /\.(mp4|webm|ogg)(\?.*)?$/i.exec(project.media.src) ? (
          <VideoPlayer
            src={project.media.src}
            poster={project.media?.thumbnail ?? "/dd8ushtKAafNiPreGQQfuOm10U.jpg"}
          />
        ) : (
          <Image
            src={project.media?.src ?? "/dd8ushtKAafNiPreGQQfuOm10U.jpg"}
            alt={project.title}
            fill
            className="object-contain bg-[#f3caed]"
            unoptimized={false}
            priority={true}
          />
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
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5a1 1 0 01.993.883L13 3v1h2.382a1 1 0 01.894.553l.724 1.447 1.447.724A1 1 0 0120 7.618V10h1a1 1 0 01.993.883L22 11v2a1 1 0 01-.883.993L21 14h-1v2.382a1 1 0 01-.553.894l-1.447.724-.724 1.447A1 1 0 0116.382 20H14v1a1 1 0 01-.883.993L13 22h-2a1 1 0 01-.993-.883L10 21v-1H7.618a1 1 0 01-.894-.553l-.724-1.447-1.447-.724A1 1 0 014 16.382V14H3a1 1 0 01-.993-.883L2 13v-2a1 1 0 01.883-.993L3 10h1V7.618a1 1 0 01.553-.894l1.447-.724.724-1.447A1 1 0 017.618 4H10V3a1 1 0 01.883-.993L11 2h2z" /></svg>
              </span>
            )}
            {categoryName}
          </span>
        </div>
        <p className="text-gray-600 text-base">{project.description}</p>
      </div>
    </motion.div>
  );
}

// Create a separate component for the main content
export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("Everything");
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
    <motion.main 
      className="relative flex flex-col items-center justify-start min-h-screen max-w-7xl mx-auto pt-48 px-4"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-7xl font-bold mb-4 text-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        My Projects
      </motion.h1>
      
      <motion.p 
        className="text-lg mb-12 text-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Here are some of my projects, feel free to browse :D
      </motion.p>

      {/* Floating Message Bubbles */}
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
            description: "Animations made with After Effects, Premiere Pro and Photoshop",
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
              { 
                title: "Basic Animation", 
                description: "Part of a Youtube Video",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/Pz8mQY9e-xa/rend/Pz8mQY9e-xa_576.mp4?hdnts=st%3D1745006750%7Eexp%3D1745265950%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FPz8mQY9e-xa%2Frend%2F*%21%2Fi%2FPz8mQY9e-xa%2Frend%2F*%21%2FPz8mQY9e-xa%2Frend%2F*%21%2FPz8mQY9e-xa%2Fimage%2F*%21%2FPz8mQY9e-xa%2Fcaptions%2F*%7Ehmac%3D883615180a7423e9560218f250675dad0c85a54d218fdc06d7c849bd2fc9ef12",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/Pz8mQY9e-xa/image/Pz8mQY9e-xa_poster.jpg?hdnts=st%3D1745007847%7Eexp%3D1745267047%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FPz8mQY9e-xa%2Frend%2F*%21%2Fi%2FPz8mQY9e-xa%2Frend%2F*%21%2FPz8mQY9e-xa%2Frend%2F*%21%2FPz8mQY9e-xa%2Fimage%2F*%21%2FPz8mQY9e-xa%2Fcaptions%2F*%7Ehmac%3Dbec82535c122bb6fbfb3ff23aeb706da31b60152f0dfad1e8469e3d8ef28dfd0"
                }
              },
              { 
                title: "Basic Animation", 
                description: "Part of a Youtube Video",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/7erYwGASLhh/rend/7erYwGASLhh_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F7erYwGASLhh%2Frend%2F*%21%2Fi%2F7erYwGASLhh%2Frend%2F*%21%2F7erYwGASLhh%2Frend%2F*%21%2F7erYwGASLhh%2Fimage%2F*%21%2F7erYwGASLhh%2Fcaptions%2F*%7Ehmac%3Dd76c6c00b0043a9c0a6fa249ff3bf25504a5cf8a337ac015a45cda9447159b7d",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/7erYwGASLhh/image/7erYwGASLhh_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F7erYwGASLhh%2Frend%2F*%21%2Fi%2F7erYwGASLhh%2Frend%2F*%21%2F7erYwGASLhh%2Frend%2F*%21%2F7erYwGASLhh%2Fimage%2F*%21%2F7erYwGASLhh%2Fcaptions%2F*%7Ehmac%3Dd76c6c00b0043a9c0a6fa249ff3bf25504a5cf8a337ac015a45cda9447159b7d"
                }
              },
              {
                title: "Basic Animation", 
                description: "Part of a Youtube Video",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/I2wM4_I6vda/rend/I2wM4_I6vda_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FI2wM4_I6vda%2Frend%2F*%21%2Fi%2FI2wM4_I6vda%2Frend%2F*%21%2FI2wM4_I6vda%2Frend%2F*%21%2FI2wM4_I6vda%2Fimage%2F*%21%2FI2wM4_I6vda%2Fcaptions%2F*%7Ehmac%3D7c528dc5cd722ba6f19b087c210d17fbca326de113d1b8503c2b62e231e52ab3",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/I2wM4_I6vda/image/I2wM4_I6vda_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FI2wM4_I6vda%2Frend%2F*%21%2Fi%2FI2wM4_I6vda%2Frend%2F*%21%2FI2wM4_I6vda%2Frend%2F*%21%2FI2wM4_I6vda%2Fimage%2F*%21%2FI2wM4_I6vda%2Fcaptions%2F*%7Ehmac%3D7c528dc5cd722ba6f19b087c210d17fbca326de113d1b8503c2b62e231e52ab3"
                }
              },
              {
                title: "Youtube Outro", 
                description: "My Youtube Outro :>",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/MLEbpIMFmgE/rend/MLEbpIMFmgE_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FMLEbpIMFmgE%2Frend%2F*%21%2Fi%2FMLEbpIMFmgE%2Frend%2F*%21%2FMLEbpIMFmgE%2Frend%2F*%21%2FMLEbpIMFmgE%2Fimage%2F*%21%2FMLEbpIMFmgE%2Fcaptions%2F*%7Ehmac%3De2ae256e4457d000bdd8a3f04ffbe92dbce5362619a67e975e8ae084481934f0",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/MLEbpIMFmgE/image/MLEbpIMFmgE_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FMLEbpIMFmgE%2Frend%2F*%21%2Fi%2FMLEbpIMFmgE%2Frend%2F*%21%2FMLEbpIMFmgE%2Frend%2F*%21%2FMLEbpIMFmgE%2Fimage%2F*%21%2FMLEbpIMFmgE%2Fcaptions%2F*%7Ehmac%3De2ae256e4457d000bdd8a3f04ffbe92dbce5362619a67e975e8ae084481934f0"
                }
              },
              {
                title: "Stream Donation", 
                description: "Stream alert for Twitch",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/LtWHS7kxZLB/rend/LtWHS7kxZLB_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FLtWHS7kxZLB%2Frend%2F*%21%2Fi%2FLtWHS7kxZLB%2Frend%2F*%21%2FLtWHS7kxZLB%2Frend%2F*%21%2FLtWHS7kxZLB%2Fimage%2F*%21%2FLtWHS7kxZLB%2Fcaptions%2F*%7Ehmac%3D2f77f99e9f08fec95fe596a204f47a664ea78da029ef69a5ee2cdda50d605ddd",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/LtWHS7kxZLB/image/LtWHS7kxZLB_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FLtWHS7kxZLB%2Frend%2F*%21%2Fi%2FLtWHS7kxZLB%2Frend%2F*%21%2FLtWHS7kxZLB%2Frend%2F*%21%2FLtWHS7kxZLB%2Fimage%2F*%21%2FLtWHS7kxZLB%2Fcaptions%2F*%7Ehmac%3D2f77f99e9f08fec95fe596a204f47a664ea78da029ef69a5ee2cdda50d605ddd"  
                }
              },
              {
                title: "Joyride Animation", 
                description: "Ryan liked it",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/NBfN3uLIRcB/rend/NBfN3uLIRcB_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FNBfN3uLIRcB%2Frend%2F*%21%2Fi%2FNBfN3uLIRcB%2Frend%2F*%21%2FNBfN3uLIRcB%2Frend%2F*%21%2FNBfN3uLIRcB%2Fimage%2F*%21%2FNBfN3uLIRcB%2Fcaptions%2F*%7Ehmac%3D1871cdc92ba484b9794d2d0a4080c1bdf123d5c50e7a511326ac2e0051f56d9b",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/NBfN3uLIRcB/image/NBfN3uLIRcB_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FNBfN3uLIRcB%2Frend%2F*%21%2Fi%2FNBfN3uLIRcB%2Frend%2F*%21%2FNBfN3uLIRcB%2Frend%2F*%21%2FNBfN3uLIRcB%2Fimage%2F*%21%2FNBfN3uLIRcB%2Fcaptions%2F*%7Ehmac%3D1871cdc92ba484b9794d2d0a4080c1bdf123d5c50e7a511326ac2e0051f56d9b"
                }
              },
              {
                title: "Zorro Edit", 
                description: "Proof of concept",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/Krb68pt3Lxm/rend/Krb68pt3Lxm_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FKrb68pt3Lxm%2Frend%2F*%21%2Fi%2FKrb68pt3Lxm%2Frend%2F*%21%2FKrb68pt3Lxm%2Frend%2F*%21%2FKrb68pt3Lxm%2Fimage%2F*%21%2FKrb68pt3Lxm%2Fcaptions%2F*%7Ehmac%3D83e7cabe16838ee8df8f70404aafbb19da16d6314479b89da03bc67e1ffe84ac",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/Krb68pt3Lxm/image/Krb68pt3Lxm_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FKrb68pt3Lxm%2Frend%2F*%21%2Fi%2FKrb68pt3Lxm%2Frend%2F*%21%2FKrb68pt3Lxm%2Frend%2F*%21%2FKrb68pt3Lxm%2Fimage%2F*%21%2FKrb68pt3Lxm%2Fcaptions%2F*%7Ehmac%3D83e7cabe16838ee8df8f70404aafbb19da16d6314479b89da03bc67e1ffe84ac"  
                }
              },
              {
                title: "VRCU Intro", 
                description: "Part of the intro of a Youtube Series",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/UHEC9WibFXQ/rend/UHEC9WibFXQ_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FUHEC9WibFXQ%2Frend%2F*%21%2Fi%2FUHEC9WibFXQ%2Frend%2F*%21%2FUHEC9WibFXQ%2Frend%2F*%21%2FUHEC9WibFXQ%2Fimage%2F*%21%2FUHEC9WibFXQ%2Fcaptions%2F*%7Ehmac%3D48e49a585af32dae6709884ca14d69eeee1633ff20ff01a569d23d57bf175fef",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/UHEC9WibFXQ/image/UHEC9WibFXQ_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FUHEC9WibFXQ%2Frend%2F*%21%2Fi%2FUHEC9WibFXQ%2Frend%2F*%21%2FUHEC9WibFXQ%2Frend%2F*%21%2FUHEC9WibFXQ%2Fimage%2F*%21%2FUHEC9WibFXQ%2Fcaptions%2F*%7Ehmac%3D48e49a585af32dae6709884ca14d69eeee1633ff20ff01a569d23d57bf175fef"
                }
              },
              {
                title: "Carrd.co Animation", 
                description: "Animated carrd.co startup",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/-XpV93qw-Dh/rend/-XpV93qw-Dh_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F-XpV93qw-Dh%2Frend%2F*%21%2Fi%2F-XpV93qw-Dh%2Frend%2F*%21%2F-XpV93qw-Dh%2Frend%2F*%21%2F-XpV93qw-Dh%2Fimage%2F*%21%2F-XpV93qw-Dh%2Fcaptions%2F*%7Ehmac%3Db8c5a23303f93e9328e15a663c477fa70fffa84b1fefe82aba335ff4d94a527b",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/-XpV93qw-Dh/image/-XpV93qw-Dh_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F-XpV93qw-Dh%2Frend%2F*%21%2Fi%2F-XpV93qw-Dh%2Frend%2F*%21%2F-XpV93qw-Dh%2Frend%2F*%21%2F-XpV93qw-Dh%2Fimage%2F*%21%2F-XpV93qw-Dh%2Fcaptions%2F*%7Ehmac%3Db8c5a23303f93e9328e15a663c477fa70fffa84b1fefe82aba335ff4d94a527b"
                }
              },
              {
                title: "Cuttingweek NOV24", 
                description: "Framelab Cuttingweek preintro contest",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/CXvU6bUvVp8/rend/CXvU6bUvVp8_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FCXvU6bUvVp8%2Frend%2F*%21%2Fi%2FCXvU6bUvVp8%2Frend%2F*%21%2FCXvU6bUvVp8%2Frend%2F*%21%2FCXvU6bUvVp8%2Fimage%2F*%21%2FCXvU6bUvVp8%2Fcaptions%2F*%7Ehmac%3D41a0da38596a94c6c6e45c1f0fbfebf2e7405e45f970888aed5efa8aff12dab2",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/CXvU6bUvVp8/image/CXvU6bUvVp8_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FCXvU6bUvVp8%2Frend%2F*%21%2Fi%2FCXvU6bUvVp8%2Frend%2F*%21%2FCXvU6bUvVp8%2Frend%2F*%21%2FCXvU6bUvVp8%2Fimage%2F*%21%2FCXvU6bUvVp8%2Fcaptions%2F*%7Ehmac%3D41a0da38596a94c6c6e45c1f0fbfebf2e7405e45f970888aed5efa8aff12dab2"
                }
              },
              {
                title: "Take me back to Mexico Edit", 
                description: "A short motion design edit",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/HXLiRAQ-aAg/rend/HXLiRAQ-aAg_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FHXLiRAQ-aAg%2Frend%2F*%21%2Fi%2FHXLiRAQ-aAg%2Frend%2F*%21%2FHXLiRAQ-aAg%2Frend%2F*%21%2FHXLiRAQ-aAg%2Fimage%2F*%21%2FHXLiRAQ-aAg%2Fcaptions%2F*%7Ehmac%3Dd61cbe27214062448f09a9215898b2450e08342f7904f5e708ac309a64245ba6",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/HXLiRAQ-aAg/image/HXLiRAQ-aAg_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FHXLiRAQ-aAg%2Frend%2F*%21%2Fi%2FHXLiRAQ-aAg%2Frend%2F*%21%2FHXLiRAQ-aAg%2Frend%2F*%21%2FHXLiRAQ-aAg%2Fimage%2F*%21%2FHXLiRAQ-aAg%2Fcaptions%2F*%7Ehmac%3Dd61cbe27214062448f09a9215898b2450e08342f7904f5e708ac309a64245ba6"
                }
              },
              {
                title: "Showreel 2024", 
                description: "The Motion Design Showreel of 2024",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/7XVYiHErCru/rend/7XVYiHErCru_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F7XVYiHErCru%2Frend%2F*%21%2Fi%2F7XVYiHErCru%2Frend%2F*%21%2F7XVYiHErCru%2Frend%2F*%21%2F7XVYiHErCru%2Fimage%2F*%21%2F7XVYiHErCru%2Fcaptions%2F*%7Ehmac%3D447f6c5a9c10f881f21a82c0e01bb33857848b3deb7faf5135d2239c01d844ca",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/7XVYiHErCru/image/7XVYiHErCru_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F7XVYiHErCru%2Frend%2F*%21%2Fi%2F7XVYiHErCru%2Frend%2F*%21%2F7XVYiHErCru%2Frend%2F*%21%2F7XVYiHErCru%2Fimage%2F*%21%2F7XVYiHErCru%2Fcaptions%2F*%7Ehmac%3D447f6c5a9c10f881f21a82c0e01bb33857848b3deb7faf5135d2239c01d844ca"
                }
              }
            ]
          },
          {
            name: "VFX",
            description: "Visual effects and motion graphics created for various projects",
            icon: "✨",
            projects: [
              { 
                title: "Basic VFX", 
                description: "Part of a Youtube Video",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/KtvmmAq5UVD/rend/KtvmmAq5UVD_576.mp4?hdnts=st%3D1745010471%7Eexp%3D1745269671%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FKtvmmAq5UVD%2Frend%2F*%21%2Fi%2FKtvmmAq5UVD%2Frend%2F*%21%2FKtvmmAq5UVD%2Frend%2F*%21%2FKtvmmAq5UVD%2Fimage%2F*%21%2FKtvmmAq5UVD%2Fcaptions%2F*%7Ehmac%3D9a903b0fcd26dd4a861c8af6ef3006065782323e6e4d749f2f39f73984496f2e",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/KtvmmAq5UVD/image/KtvmmAq5UVD_poster.jpg?hdnts=st%3D1745010471%7Eexp%3D1745269671%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FKtvmmAq5UVD%2Frend%2F*%21%2Fi%2FKtvmmAq5UVD%2Frend%2F*%21%2FKtvmmAq5UVD%2Frend%2F*%21%2FKtvmmAq5UVD%2Fimage%2F*%21%2FKtvmmAq5UVD%2Fcaptions%2F*%7Ehmac%3D9a903b0fcd26dd4a861c8af6ef3006065782323e6e4d749f2f39f73984496f2e"
                }
              },
              { 
                title: "Basic VFX", 
                description: "Part of a Youtube Video",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/CuJxJ3Urd8W/rend/CuJxJ3Urd8W_576.mp4?hdnts=st%3D1745010471%7Eexp%3D1745269671%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FCuJxJ3Urd8W%2Frend%2F*%21%2Fi%2FCuJxJ3Urd8W%2Frend%2F*%21%2FCuJxJ3Urd8W%2Frend%2F*%21%2FCuJxJ3Urd8W%2Fimage%2F*%21%2FCuJxJ3Urd8W%2Fcaptions%2F*%7Ehmac%3D901ba3fc9537bba214f749fa08fee13671a7547b21fd24c4efbd30dca3aa2f5d",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/CuJxJ3Urd8W/image/CuJxJ3Urd8W_poster.jpg?hdnts=st%3D1745010471%7Eexp%3D1745269671%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FCuJxJ3Urd8W%2Frend%2F*%21%2Fi%2FCuJxJ3Urd8W%2Frend%2F*%21%2FCuJxJ3Urd8W%2Frend%2F*%21%2FCuJxJ3Urd8W%2Fimage%2F*%21%2FCuJxJ3Urd8W%2Fcaptions%2F*%7Ehmac%3D901ba3fc9537bba214f749fa08fee13671a7547b21fd24c4efbd30dca3aa2f5d"
                }
              },
              {
                title: "Basic VFX",
                description: "Part of a Youtube Video",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/Srm_tW5QJGc/rend/Srm_tW5QJGc_576.mp4?hdnts=st%3D1745010471%7Eexp%3D1745269671%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FSrm_tW5QJGc%2Frend%2F*%21%2Fi%2FSrm_tW5QJGc%2Frend%2F*%21%2FSrm_tW5QJGc%2Frend%2F*%21%2FSrm_tW5QJGc%2Fimage%2F*%21%2FSrm_tW5QJGc%2Fcaptions%2F*%7Ehmac%3D986d995967608c35d3b41746edca2fa1c558a80300a27d5e1609ce1cd7d34f34",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/Srm_tW5QJGc/image/Srm_tW5QJGc_poster.jpg?hdnts=st%3D1745010471%7Eexp%3D1745269671%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FSrm_tW5QJGc%2Frend%2F*%21%2Fi%2FSrm_tW5QJGc%2Frend%2F*%21%2FSrm_tW5QJGc%2Frend%2F*%21%2FSrm_tW5QJGc%2Fimage%2F*%21%2FSrm_tW5QJGc%2Fcaptions%2F*%7Ehmac%3D986d995967608c35d3b41746edca2fa1c558a80300a27d5e1609ce1cd7d34f34"
                }
              },
              {
                title: "Basic VFX",
                description: "Part of a Youtube Video",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/GjZsHjGMijY/rend/GjZsHjGMijY_576.mp4?hdnts=st%3D1745010471%7Eexp%3D1745269671%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FGjZsHjGMijY%2Frend%2F*%21%2Fi%2FGjZsHjGMijY%2Frend%2F*%21%2FGjZsHjGMijY%2Frend%2F*%21%2FGjZsHjGMijY%2Fimage%2F*%21%2FGjZsHjGMijY%2Fcaptions%2F*%7Ehmac%3D45b7d4037ffe1c90e7cdad27b883507c3adec35b259569d1ea02093812048552",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/GjZsHjGMijY/image/GjZsHjGMijY_poster.jpg?hdnts=st%3D1745010471%7Eexp%3D1745269671%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FGjZsHjGMijY%2Frend%2F*%21%2Fi%2FGjZsHjGMijY%2Frend%2F*%21%2FGjZsHjGMijY%2Frend%2F*%21%2FGjZsHjGMijY%2Fimage%2F*%21%2FGjZsHjGMijY%2Fcaptions%2F*%7Ehmac%3D45b7d4037ffe1c90e7cdad27b883507c3adec35b259569d1ea02093812048552"
                }
              }
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
              { 
                title: "Photography Project 1", 
                description: "A placeholder photography project capturing beautiful moments.",
                media: { src: "/projects/photography/superior.jpg" },
                aspect: "3:4"
              },
              { 
                title: "Photography Project 2", 
                description: "A placeholder photography project capturing beautiful moments.",
                media: { src: "/projects/photography/Ski_.jpg" },
                aspect: "3:4"
              },
              {
                title: "Photography Project 3", 
                description: "A placeholder photography project capturing beautiful moments.",
                media: { src: "/projects/photography/Mountain.jpg" },
                aspect: "3:4"
              },
              {
                title: "Photography Project 4", 
                description: "A placeholder photography project capturing beautiful moments.",
                media: { src: "/projects/photography/house_at_night.jpg" },
                aspect: "3:4"
              }
            ]
          },
          {
            name: "Commissions",
            description: "Commissioned projects",
            icon: "💼",
            projects: [
              { 
                title: "@Seltix", 
                description: "I-CLIP ad-segment",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/93wWQRnnS75/rend/93wWQRnnS75_576.mp4?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F93wWQRnnS75%2Frend%2F*%21%2Fi%2F93wWQRnnS75%2Frend%2F*%21%2F93wWQRnnS75%2Frend%2F*%21%2F93wWQRnnS75%2Fimage%2F*%21%2F93wWQRnnS75%2Fcaptions%2F*%7Ehmac%3D7e98e21a512959a8675e3eab9f63557807e614ccd13acf4420e5ed1cd7f23cb6",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/93wWQRnnS75/image/93wWQRnnS75_poster.jpg?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F93wWQRnnS75%2Frend%2F*%21%2Fi%2F93wWQRnnS75%2Frend%2F*%21%2F93wWQRnnS75%2Frend%2F*%21%2F93wWQRnnS75%2Fimage%2F*%21%2F93wWQRnnS75%2Fcaptions%2F*%7Ehmac%3D7e98e21a512959a8675e3eab9f63557807e614ccd13acf4420e5ed1cd7f23cb6"
                },
                link: "https://youtube.com/@SELTIXX"
              },
              { 
                title: "@Nils Schlieper", 
                description: "Youtube Preintro 2 (7 Tage mit Elotrix)",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/Asr26Wrp6ps/rend/Asr26Wrp6ps_576.mp4?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FAsr26Wrp6ps%2Frend%2F*%21%2Fi%2FAsr26Wrp6ps%2Frend%2F*%21%2FAsr26Wrp6ps%2Frend%2F*%21%2FAsr26Wrp6ps%2Fimage%2F*%21%2FAsr26Wrp6ps%2Fcaptions%2F*%7Ehmac%3D1f2e31c3f0a490eaf0b6ce8563fed20e3a9c3049f876166dd0e7ea200dc93b8e",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/Asr26Wrp6ps/image/Asr26Wrp6ps_poster.jpg?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FAsr26Wrp6ps%2Frend%2F*%21%2Fi%2FAsr26Wrp6ps%2Frend%2F*%21%2FAsr26Wrp6ps%2Frend%2F*%21%2FAsr26Wrp6ps%2Fimage%2F*%21%2FAsr26Wrp6ps%2Fcaptions%2F*%7Ehmac%3D1f2e31c3f0a490eaf0b6ce8563fed20e3a9c3049f876166dd0e7ea200dc93b8e"
                },
                link: "https://youtube.com/@nils.schlieper"
              },
              {
                title: "@Nils Schlieper",
                description: "Youtube Preintro (Dubai Wohnung)",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/U7rUzTdyfKy/rend/U7rUzTdyfKy_576.mp4?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FU7rUzTdyfKy%2Frend%2F*%21%2Fi%2FU7rUzTdyfKy%2Frend%2F*%21%2FU7rUzTdyfKy%2Frend%2F*%21%2FU7rUzTdyfKy%2Fimage%2F*%21%2FU7rUzTdyfKy%2Fcaptions%2F*%7Ehmac%3D45b9dfac4cf7db43fa8102475cd12cae2092ff5bc6678692dcb2e8afc7d07d85",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/U7rUzTdyfKy/image/U7rUzTdyfKy_poster.jpg?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FU7rUzTdyfKy%2Frend%2F*%21%2Fi%2FU7rUzTdyfKy%2Frend%2F*%21%2FU7rUzTdyfKy%2Frend%2F*%21%2FU7rUzTdyfKy%2Fimage%2F*%21%2FU7rUzTdyfKy%2Fcaptions%2F*%7Ehmac%3D45b9dfac4cf7db43fa8102475cd12cae2092ff5bc6678692dcb2e8afc7d07d85"
                },
                link: "https://youtube.com/@nils.schlieper"
              },
              {
                title: "@Nils Schlieper",
                description: "Youtube Preintro (Pokemonkarten)",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/F6s5nwknkoG/rend/F6s5nwknkoG_576.mp4?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FF6s5nwknkoG%2Frend%2F*%21%2Fi%2FF6s5nwknkoG%2Frend%2F*%21%2FF6s5nwknkoG%2Frend%2F*%21%2FF6s5nwknkoG%2Fimage%2F*%21%2FF6s5nwknkoG%2Fcaptions%2F*%7Ehmac%3D687e848e636f3d150294148d8e3fe10496b3276a2038996b8515985c762584de",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/F6s5nwknkoG/image/F6s5nwknkoG_poster.jpg?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FF6s5nwknkoG%2Frend%2F*%21%2Fi%2FF6s5nwknkoG%2Frend%2F*%21%2FF6s5nwknkoG%2Frend%2F*%21%2FF6s5nwknkoG%2Fimage%2F*%21%2FF6s5nwknkoG%2Fcaptions%2F*%7Ehmac%3D687e848e636f3d150294148d8e3fe10496b3276a2038996b8515985c762584de"
                },
                link: "https://youtube.com/@nils.schlieper"
              },
              {
                title: "@Nils Schlieper",
                description: "Youtube Preintro (Villa Showcase)",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/2-RgLp9Uv46/rend/2-RgLp9Uv46_576.mp4?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F2-RgLp9Uv46%2Frend%2F*%21%2Fi%2F2-RgLp9Uv46%2Frend%2F*%21%2F2-RgLp9Uv46%2Frend%2F*%21%2F2-RgLp9Uv46%2Fimage%2F*%21%2F2-RgLp9Uv46%2Fcaptions%2F*%7Ehmac%3Dfddd440631fa4b887ff197d870b63cb19187e2b4b3b0ce22f7540a27c81bb205",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/2-RgLp9Uv46/image/2-RgLp9Uv46_poster.jpg?hdnts=st%3D1745010707%7Eexp%3D1745269907%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F2-RgLp9Uv46%2Frend%2F*%21%2Fi%2F2-RgLp9Uv46%2Frend%2F*%21%2F2-RgLp9Uv46%2Frend%2F*%21%2F2-RgLp9Uv46%2Fimage%2F*%21%2F2-RgLp9Uv46%2Fcaptions%2F*%7Ehmac%3Dfddd440631fa4b887ff197d870b63cb19187e2b4b3b0ce22f7540a27c81bb205"
                },
                link: "https://youtube.com/@nils.schlieper"
              }
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
              {category.projects.length === 1 ? (
                <div className="flex justify-center">
                  <ProjectCard
                    key={`${category.projects[0]?.title ?? 'unknown'}-0`}
                    project={category.projects[0] as Project}
                    categoryName={category.name}
                  />
                </div>
              ) : (
                <Masonry
                  breakpointCols={{ default: 2, 768: 1 }}
                  className="flex gap-8"
                  columnClassName="masonry-column w-1/2"
                >
                  {[...category.projects].reverse().map((project, _index) => {
                    const aspect = (project as Partial<Project>).aspect;
                    // Type guard: only render if project fits the Project type
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
                        <ProjectCard
                          key={`${project.title}-${_index}`}
                          project={project as Project}
                          categoryName={category.name}
                        />
                      );
                    }
                    return null;
                  })}
                  {/* Optional: Add a single invisible placeholder if there is only one project, to keep the card size stable */}
                  {category.projects.length === 1 && (
                    <div key="placeholder" className="invisible" aria-hidden="true" />
                  )}
                </Masonry>
              )}
            </motion.div>
          ))}
      </motion.div>
    </motion.main>
  );
}