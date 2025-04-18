"use client";

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

function FooterContent() {
    return (
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
    )
}

export default FooterContent;
