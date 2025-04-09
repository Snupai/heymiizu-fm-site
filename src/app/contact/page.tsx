"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "../../components/Logo";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
// Animation variants for staggered fade-in
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ContactPage() {
  const pathname = usePathname();
  
  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden px-4 flex flex-col">
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
              <motion.div
                initial="initial"
                whileHover="hover"
                animate="initial"
                className="relative group hover:scale-105"
              >
                <Link href="/" className="relative block">
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
                <Link href="/projects" className="relative block">
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
                <Link href="/contact" className="relative block">
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
      <div className="relative flex flex-col items-center justify-start flex-grow max-w-7xl mx-auto pt-32 pb-16">
        <motion.h1 
          className="text-8xl font-bold mb-4 text-center z-50 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h1>
        
        <motion.p 
          className="text-xl mb-12 text-center z-50 relative max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Have a question or want to work together? Feel free to reach out via email or through social media.
        </motion.p>

        <div className="w-full z-50 flex justify-center">
          {/* Contact Info */}
          <motion.div
            className="bg-white rounded-xl p-8 shadow-lg inline-block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Information</h2>
            <div className="flex">
              {/* Icons Column */}
              <div className="flex flex-col items-center justify-center space-y-6 mr-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              
              {/* Content Column */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="text-center">
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">hey@miizumelon.de</p>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Location</h3>
                  <p className="text-gray-600">Tokyo, Japan</p>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Social Media</h3>
                  <div className="flex space-x-4 mt-2 justify-center">
                    <a href="https://x.com/heymiizu" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF]">
                      <FaXTwitter className="w-6 h-6" />
                    </a>
                    <a href="https://www.instagram.com/miizumelon/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF]">
                      <FaInstagram className="w-6 h-6" />
                    </a>
                    <a href="https://www.youtube.com/@Miizumelon" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#0095FF]">
                      <FaYoutube className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-screen bg-[#520066] relative left-[50%] right-[50%] mr-[-50vw] ml-[-50vw]">
        <div className="py-4">
          <div className="container mx-auto px-4">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 