"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../components/Logo";
import { useState, useEffect } from "react";

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

interface AnimationPattern {
  y: number;
  x: number;
  rotate: number;
  duration: number;
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

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [time, setTime] = useState(0);

  // Update time for continuous animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      messageBubbles.forEach(bubble => {
        bubble.pattern = createRandomPattern();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: "Everything", icon: "•" },
    { name: "Animations", icon: "Ae" },
    { name: "VFX", icon: "✨" },
    { name: "Photography", icon: "📷" },
  ];

  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden px-4">
      {/* Logo */}
      <div className="fixed top-8 left-[20%] z-30">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <ul className="flex gap-8">
              <li><Link href="/" className="hover:opacity-70">Home</Link></li>
              <li><Link href="/projects" className="text-black">Projects</Link></li>
              <li><Link href="/contact" className="hover:opacity-70">Contact Me</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <motion.div 
        className="relative flex flex-col items-center justify-start min-h-screen max-w-7xl mx-auto pt-32"
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
                opacity: { duration: 1, delay: 0.2 + (index * 0.3) },
                scale: { 
                  duration: 1.2,
                  delay: 0.2 + (index * 0.3),
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
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          My Projects
        </motion.h1>
        
        <motion.p 
          className="text-lg mb-12 text-center z-50 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Here are some of my projects, feel free to browse :D
        </motion.p>

        {/* Category Filters */}
        <div className="flex gap-8 mb-12">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                activeCategory === category.name
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Projects Section */}
        <div className="w-full">
          <h2 className="text-4xl font-bold mb-8 text-[#0095FF]">
            {activeCategory}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project Cards */}
            {/* Animations Category */}
            <motion.div 
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                activeCategory !== "Everything" && activeCategory !== "Animations" ? "hidden" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-64">
                <Image
                  src="/dd8ushtKAafNiPreGQQfuOm10U.jpg"
                  alt="Animation Project"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Animation Project 1</h3>
                <p className="text-gray-600">A placeholder animation project showcasing various techniques.</p>
              </div>
            </motion.div>

            {/* VFX Category */}
            <motion.div 
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                activeCategory !== "Everything" && activeCategory !== "VFX" ? "hidden" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative h-64">
                <Image
                  src="/dd8ushtKAafNiPreGQQfuOm10U.jpg"
                  alt="VFX Project"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">VFX Project 1</h3>
                <p className="text-gray-600">A placeholder VFX project with stunning visual effects.</p>
              </div>
            </motion.div>

            {/* Photography Category */}
            <motion.div 
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                activeCategory !== "Everything" && activeCategory !== "Photography" ? "hidden" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative h-64">
                <Image
                  src="/dd8ushtKAafNiPreGQQfuOm10U.jpg"
                  alt="Photography Project"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Photography Project 1</h3>
                <p className="text-gray-600">A placeholder photography project capturing beautiful moments.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  );
} 