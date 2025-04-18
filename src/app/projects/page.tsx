"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

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
                title: "Animation Project 1", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/Pz8mQY9e-xa/rend/Pz8mQY9e-xa_576.mp4?hdnts=st%3D1745006750%7Eexp%3D1745265950%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FPz8mQY9e-xa%2Frend%2F*%21%2Fi%2FPz8mQY9e-xa%2Frend%2F*%21%2FPz8mQY9e-xa%2Frend%2F*%21%2FPz8mQY9e-xa%2Fimage%2F*%21%2FPz8mQY9e-xa%2Fcaptions%2F*%7Ehmac%3D883615180a7423e9560218f250675dad0c85a54d218fdc06d7c849bd2fc9ef12",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/Pz8mQY9e-xa/image/Pz8mQY9e-xa_poster.jpg?hdnts=st%3D1745007847%7Eexp%3D1745267047%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FPz8mQY9e-xa%2Frend%2F*%21%2Fi%2FPz8mQY9e-xa%2Frend%2F*%21%2FPz8mQY9e-xa%2Frend%2F*%21%2FPz8mQY9e-xa%2Fimage%2F*%21%2FPz8mQY9e-xa%2Fcaptions%2F*%7Ehmac%3Dbec82535c122bb6fbfb3ff23aeb706da31b60152f0dfad1e8469e3d8ef28dfd0"
                }
              },
              { 
                title: "Animation Project 2", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/7erYwGASLhh/rend/7erYwGASLhh_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F7erYwGASLhh%2Frend%2F*%21%2Fi%2F7erYwGASLhh%2Frend%2F*%21%2F7erYwGASLhh%2Frend%2F*%21%2F7erYwGASLhh%2Fimage%2F*%21%2F7erYwGASLhh%2Fcaptions%2F*%7Ehmac%3Dd76c6c00b0043a9c0a6fa249ff3bf25504a5cf8a337ac015a45cda9447159b7d",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/7erYwGASLhh/image/7erYwGASLhh_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F7erYwGASLhh%2Frend%2F*%21%2Fi%2F7erYwGASLhh%2Frend%2F*%21%2F7erYwGASLhh%2Frend%2F*%21%2F7erYwGASLhh%2Fimage%2F*%21%2F7erYwGASLhh%2Fcaptions%2F*%7Ehmac%3Dd76c6c00b0043a9c0a6fa249ff3bf25504a5cf8a337ac015a45cda9447159b7d"
                }
              },
              {
                title: "Animation Project 3", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/I2wM4_I6vda/rend/I2wM4_I6vda_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FI2wM4_I6vda%2Frend%2F*%21%2Fi%2FI2wM4_I6vda%2Frend%2F*%21%2FI2wM4_I6vda%2Frend%2F*%21%2FI2wM4_I6vda%2Fimage%2F*%21%2FI2wM4_I6vda%2Fcaptions%2F*%7Ehmac%3D7c528dc5cd722ba6f19b087c210d17fbca326de113d1b8503c2b62e231e52ab3",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/I2wM4_I6vda/image/I2wM4_I6vda_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FI2wM4_I6vda%2Frend%2F*%21%2Fi%2FI2wM4_I6vda%2Frend%2F*%21%2FI2wM4_I6vda%2Frend%2F*%21%2FI2wM4_I6vda%2Fimage%2F*%21%2FI2wM4_I6vda%2Fcaptions%2F*%7Ehmac%3D7c528dc5cd722ba6f19b087c210d17fbca326de113d1b8503c2b62e231e52ab3"
                }
              },
              {
                title: "Animation Project 4", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/MLEbpIMFmgE/rend/MLEbpIMFmgE_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FMLEbpIMFmgE%2Frend%2F*%21%2Fi%2FMLEbpIMFmgE%2Frend%2F*%21%2FMLEbpIMFmgE%2Frend%2F*%21%2FMLEbpIMFmgE%2Fimage%2F*%21%2FMLEbpIMFmgE%2Fcaptions%2F*%7Ehmac%3De2ae256e4457d000bdd8a3f04ffbe92dbce5362619a67e975e8ae084481934f0",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/MLEbpIMFmgE/image/MLEbpIMFmgE_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FMLEbpIMFmgE%2Frend%2F*%21%2Fi%2FMLEbpIMFmgE%2Frend%2F*%21%2FMLEbpIMFmgE%2Frend%2F*%21%2FMLEbpIMFmgE%2Fimage%2F*%21%2FMLEbpIMFmgE%2Fcaptions%2F*%7Ehmac%3De2ae256e4457d000bdd8a3f04ffbe92dbce5362619a67e975e8ae084481934f0"
                }
              },
              {
                title: "Animation Project 5", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/LtWHS7kxZLB/rend/LtWHS7kxZLB_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FLtWHS7kxZLB%2Frend%2F*%21%2Fi%2FLtWHS7kxZLB%2Frend%2F*%21%2FLtWHS7kxZLB%2Frend%2F*%21%2FLtWHS7kxZLB%2Fimage%2F*%21%2FLtWHS7kxZLB%2Fcaptions%2F*%7Ehmac%3D2f77f99e9f08fec95fe596a204f47a664ea78da029ef69a5ee2cdda50d605ddd",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/LtWHS7kxZLB/image/LtWHS7kxZLB_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FLtWHS7kxZLB%2Frend%2F*%21%2Fi%2FLtWHS7kxZLB%2Frend%2F*%21%2FLtWHS7kxZLB%2Frend%2F*%21%2FLtWHS7kxZLB%2Fimage%2F*%21%2FLtWHS7kxZLB%2Fcaptions%2F*%7Ehmac%3D2f77f99e9f08fec95fe596a204f47a664ea78da029ef69a5ee2cdda50d605ddd"  
                }
              },
              {
                title: "Animation Project 6", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/NBfN3uLIRcB/rend/NBfN3uLIRcB_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FNBfN3uLIRcB%2Frend%2F*%21%2Fi%2FNBfN3uLIRcB%2Frend%2F*%21%2FNBfN3uLIRcB%2Frend%2F*%21%2FNBfN3uLIRcB%2Fimage%2F*%21%2FNBfN3uLIRcB%2Fcaptions%2F*%7Ehmac%3D1871cdc92ba484b9794d2d0a4080c1bdf123d5c50e7a511326ac2e0051f56d9b",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/NBfN3uLIRcB/image/NBfN3uLIRcB_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FNBfN3uLIRcB%2Frend%2F*%21%2Fi%2FNBfN3uLIRcB%2Frend%2F*%21%2FNBfN3uLIRcB%2Frend%2F*%21%2FNBfN3uLIRcB%2Fimage%2F*%21%2FNBfN3uLIRcB%2Fcaptions%2F*%7Ehmac%3D1871cdc92ba484b9794d2d0a4080c1bdf123d5c50e7a511326ac2e0051f56d9b"
                }
              },
              {
                title: "Animation Project 7", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/Krb68pt3Lxm/rend/Krb68pt3Lxm_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FKrb68pt3Lxm%2Frend%2F*%21%2Fi%2FKrb68pt3Lxm%2Frend%2F*%21%2FKrb68pt3Lxm%2Frend%2F*%21%2FKrb68pt3Lxm%2Fimage%2F*%21%2FKrb68pt3Lxm%2Fcaptions%2F*%7Ehmac%3D83e7cabe16838ee8df8f70404aafbb19da16d6314479b89da03bc67e1ffe84ac",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/Krb68pt3Lxm/image/Krb68pt3Lxm_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FKrb68pt3Lxm%2Frend%2F*%21%2Fi%2FKrb68pt3Lxm%2Frend%2F*%21%2FKrb68pt3Lxm%2Frend%2F*%21%2FKrb68pt3Lxm%2Fimage%2F*%21%2FKrb68pt3Lxm%2Fcaptions%2F*%7Ehmac%3D83e7cabe16838ee8df8f70404aafbb19da16d6314479b89da03bc67e1ffe84ac"  
                }
              },
              {
                title: "Animation Project 8", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/UHEC9WibFXQ/rend/UHEC9WibFXQ_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FUHEC9WibFXQ%2Frend%2F*%21%2Fi%2FUHEC9WibFXQ%2Frend%2F*%21%2FUHEC9WibFXQ%2Frend%2F*%21%2FUHEC9WibFXQ%2Fimage%2F*%21%2FUHEC9WibFXQ%2Fcaptions%2F*%7Ehmac%3D48e49a585af32dae6709884ca14d69eeee1633ff20ff01a569d23d57bf175fef",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/UHEC9WibFXQ/image/UHEC9WibFXQ_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FUHEC9WibFXQ%2Frend%2F*%21%2Fi%2FUHEC9WibFXQ%2Frend%2F*%21%2FUHEC9WibFXQ%2Frend%2F*%21%2FUHEC9WibFXQ%2Fimage%2F*%21%2FUHEC9WibFXQ%2Fcaptions%2F*%7Ehmac%3D48e49a585af32dae6709884ca14d69eeee1633ff20ff01a569d23d57bf175fef"
                }
              },
              {
                title: "Animation Project 9", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/-XpV93qw-Dh/rend/-XpV93qw-Dh_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F-XpV93qw-Dh%2Frend%2F*%21%2Fi%2F-XpV93qw-Dh%2Frend%2F*%21%2F-XpV93qw-Dh%2Frend%2F*%21%2F-XpV93qw-Dh%2Fimage%2F*%21%2F-XpV93qw-Dh%2Fcaptions%2F*%7Ehmac%3Db8c5a23303f93e9328e15a663c477fa70fffa84b1fefe82aba335ff4d94a527b",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/-XpV93qw-Dh/image/-XpV93qw-Dh_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2F-XpV93qw-Dh%2Frend%2F*%21%2Fi%2F-XpV93qw-Dh%2Frend%2F*%21%2F-XpV93qw-Dh%2Frend%2F*%21%2F-XpV93qw-Dh%2Fimage%2F*%21%2F-XpV93qw-Dh%2Fcaptions%2F*%7Ehmac%3Db8c5a23303f93e9328e15a663c477fa70fffa84b1fefe82aba335ff4d94a527b"
                }
              },
              {
                title: "Animation Project 10", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/CXvU6bUvVp8/rend/CXvU6bUvVp8_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FCXvU6bUvVp8%2Frend%2F*%21%2Fi%2FCXvU6bUvVp8%2Frend%2F*%21%2FCXvU6bUvVp8%2Frend%2F*%21%2FCXvU6bUvVp8%2Fimage%2F*%21%2FCXvU6bUvVp8%2Fcaptions%2F*%7Ehmac%3D41a0da38596a94c6c6e45c1f0fbfebf2e7405e45f970888aed5efa8aff12dab2",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/CXvU6bUvVp8/image/CXvU6bUvVp8_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FCXvU6bUvVp8%2Frend%2F*%21%2Fi%2FCXvU6bUvVp8%2Frend%2F*%21%2FCXvU6bUvVp8%2Frend%2F*%21%2FCXvU6bUvVp8%2Fimage%2F*%21%2FCXvU6bUvVp8%2Fcaptions%2F*%7Ehmac%3D41a0da38596a94c6c6e45c1f0fbfebf2e7405e45f970888aed5efa8aff12dab2"
                }
              },
              {
                title: "Animation Project 11", 
                description: "A placeholder animation project showcasing various techniques.",
                media: {
                  src: "https://cdn-prod-ccv.adobe.com/HXLiRAQ-aAg/rend/HXLiRAQ-aAg_576.mp4?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FHXLiRAQ-aAg%2Frend%2F*%21%2Fi%2FHXLiRAQ-aAg%2Frend%2F*%21%2FHXLiRAQ-aAg%2Frend%2F*%21%2FHXLiRAQ-aAg%2Fimage%2F*%21%2FHXLiRAQ-aAg%2Fcaptions%2F*%7Ehmac%3Dd61cbe27214062448f09a9215898b2450e08342f7904f5e708ac309a64245ba6",
                  thumbnail: "https://cdn-prod-ccv.adobe.com/HXLiRAQ-aAg/image/HXLiRAQ-aAg_poster.jpg?hdnts=st%3D1745007846%7Eexp%3D1745267046%7Eacl%3D%2Fshared_assets%2Fimage%2F*%21%2Fz%2FHXLiRAQ-aAg%2Frend%2F*%21%2Fi%2FHXLiRAQ-aAg%2Frend%2F*%21%2FHXLiRAQ-aAg%2Frend%2F*%21%2FHXLiRAQ-aAg%2Fimage%2F*%21%2FHXLiRAQ-aAg%2Fcaptions%2F*%7Ehmac%3Dd61cbe27214062448f09a9215898b2450e08342f7904f5e708ac309a64245ba6"
                }
              },
              {
                title: "Animation Project 12", 
                description: "A placeholder animation project showcasing various techniques.",
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
                title: "VFX Project 1", 
                description: "A placeholder VFX project with stunning visual effects.",
                media: undefined
              },
              { 
                title: "VFX Project 2", 
                description: "A placeholder VFX project with stunning visual effects.",
                media: undefined
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
                media: undefined
              },
              { 
                title: "Photography Project 2", 
                description: "A placeholder photography project capturing beautiful moments.",
                media: undefined
              }
            ]
          },
          {
            name: "Commissions",
            description: "Custom projects created for clients",
            icon: "💼",
            projects: [
              { 
                title: "Commission Project 1", 
                description: "A custom project created for a client.",
                media: undefined
              },
              { 
                title: "Commission Project 2", 
                description: "A custom project created for a client.",
                media: undefined
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
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                layout
              >
              {/*{category.projects.map((project: Project, index) => (*/}
                {[...category.projects].reverse().map((project: Project, index) => (
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
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
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
    </motion.main>
  );
}