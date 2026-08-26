"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";

function NavbarContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, user, signOut } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(
        /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          window.navigator.userAgent,
        ),
      );
    }
  }, []);

  if (isMobile) {
    return (
      <nav
        className="flex w-full flex-col items-center justify-between bg-white px-4 py-3 shadow-md"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 3000 }}
      >
        <div className="flex w-full items-center justify-between">
          <div />
          <div className="flex flex-1 justify-center">
            <Logo />
          </div>
          <button
            aria-label="Open menu"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              padding: 0,
            }}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span style={{ fontSize: 28, color: "#0189ff" }}>&#9776;</span>
          </button>
        </div>
        {menuOpen && (
          <div className="mt-2 flex w-full flex-col items-center border-t border-gray-200 bg-white">
            <Link
              href="/"
              className="block w-full py-2 text-center text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#work"
              className="block w-full py-2 text-center text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Work
            </Link>
            <Link
              href="/#contact"
              className="block w-full py-2 text-center text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block w-full py-2 text-center text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  void signOut();
                  setMenuOpen(false);
                }}
                className="block w-full py-2 text-center text-lg text-red-500"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full py-2 text-center text-sm text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.main
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      <motion.nav
        className="fixed left-0 right-0 top-0 z-[2000]"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-white/60" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-white/70"
          style={{
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            maskImage: "linear-gradient(to top, transparent, white 50%)",
            WebkitMaskImage: "linear-gradient(to top, transparent, white 50%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-white/60 to-white/80"
          style={{
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            maskImage: "linear-gradient(to top, transparent 30%, white)",
            WebkitMaskImage: "linear-gradient(to top, transparent 30%, white)",
          }}
        />

        <div className="container relative z-10 mx-auto flex items-center justify-between px-12 py-8">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center gap-8">
            <ul className="flex items-center gap-8 text-lg">
              <li className="inline-flex flex-col items-center">
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  animate="initial"
                  className="group relative"
                >
                  <Link href="/" className="group relative block">
                    <span
                      className={`relative z-10 transition-colors duration-200 ${pathname === "/" ? "text-brand" : ""}`}
                    >
                      Home
                      <motion.span
                        className="absolute bottom-0 left-0 block h-[2px] bg-brand"
                        style={{ width: "100%" }}
                        initial={{ scaleX: 0, originX: 0 }}
                        variants={{ hover: { scaleX: 1, originX: 0 } }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </Link>
                </motion.div>
              </li>
              <li className="inline-flex flex-col items-center">
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  animate="initial"
                  className="group relative"
                >
                  <Link href="/#work" className="group relative block">
                    <span className="relative z-10 transition-colors duration-200">
                      Work
                      <motion.span
                        className="absolute bottom-0 left-0 block h-[2px] bg-brand"
                        style={{ width: "100%" }}
                        initial={{ scaleX: 0, originX: 0 }}
                        variants={{ hover: { scaleX: 1, originX: 0 } }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </Link>
                </motion.div>
              </li>
              <li className="inline-flex flex-col items-center">
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  animate="initial"
                  className="group relative"
                >
                  <Link href="/#contact" className="group relative block">
                    <span className="relative z-10 transition-colors duration-200">
                      Contact Me
                      <motion.span
                        className="absolute bottom-0 left-0 block h-[2px] bg-brand"
                        style={{ width: "100%" }}
                        initial={{ scaleX: 0, originX: 0 }}
                        variants={{ hover: { scaleX: 1, originX: 0 } }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </Link>
                </motion.div>
              </li>
              {isAdmin && (
                <li className="inline-flex flex-col items-center">
                  <motion.div
                    initial="initial"
                    whileHover="hover"
                    animate="initial"
                    className="group relative"
                  >
                    <Link href="/admin" className="group relative block">
                      <span
                        className={`relative z-10 transition-colors duration-200 ${pathname === "/admin" ? "text-brand" : ""}`}
                      >
                        Admin
                        <motion.span
                          className="absolute bottom-0 left-0 block h-[2px] bg-brand"
                          style={{ width: "100%" }}
                          initial={{ scaleX: 0, originX: 0 }}
                          variants={{ hover: { scaleX: 1, originX: 0 } }}
                          transition={{ duration: 0.3 }}
                        />
                      </span>
                    </Link>
                  </motion.div>
                </li>
              )}
            </ul>

            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-xs text-gray-300 transition-colors hover:text-gray-500"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </motion.main>
  );
}

export default NavbarContent;
