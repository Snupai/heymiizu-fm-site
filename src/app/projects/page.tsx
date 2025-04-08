"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../components/Logo";

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden px-4">
      {/* Logo */}
      <div className="fixed top-8 left-[20%] z-30">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-white/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-white/70" style={{
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          maskImage: 'linear-gradient(to top, transparent, white 50%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent, white 50%)'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/60 to-white/80" style={{
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          maskImage: 'linear-gradient(to top, transparent 30%, white)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 30%, white)'
        }} />

        <div className="container mx-auto px-12 py-8 relative">
          <ul className="flex gap-12 text-lg justify-end">
            <li>
              <Link href="/" className="relative block">
                <span className="relative z-10">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/projects" className="relative block">
                <span className="relative z-10 text-[#fc87f0]">Projects</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="relative block">
                <span className="relative z-10">Contact Me</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-start min-h-screen max-w-7xl mx-auto pt-32">
        <motion.h1 
          className="text-8xl font-bold mb-4 text-center z-50 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </motion.h1>
        
        <motion.p 
          className="text-xl mb-12 text-center z-50 relative max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Here are some of the projects I've worked on. Each one represents a unique challenge and learning experience.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl z-50">
          {/* Project Card 1 */}
          <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-48 bg-gray-200">
              <Image
                src="/project1.jpg"
                alt="Project 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Project One</h3>
              <p className="text-gray-600 mb-4">A brief description of the project and its key features.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Next.js</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">TypeScript</span>
              </div>
              <a href="#" className="text-[#0095FF] hover:text-[#0077CC] font-medium">View Project →</a>
            </div>
          </motion.div>

          {/* Project Card 2 */}
          <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative h-48 bg-gray-200">
              <Image
                src="/project2.jpg"
                alt="Project 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Project Two</h3>
              <p className="text-gray-600 mb-4">Another amazing project with its own unique features and challenges.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">Node.js</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">Express</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">MongoDB</span>
              </div>
              <a href="#" className="text-[#0095FF] hover:text-[#0077CC] font-medium">View Project →</a>
            </div>
          </motion.div>

          {/* Project Card 3 */}
          <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative h-48 bg-gray-200">
              <Image
                src="/project3.jpg"
                alt="Project 3"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Project Three</h3>
              <p className="text-gray-600 mb-4">A third project showcasing different skills and technologies.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Vue.js</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Firebase</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Tailwind</span>
              </div>
              <a href="#" className="text-[#0095FF] hover:text-[#0077CC] font-medium">View Project →</a>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 