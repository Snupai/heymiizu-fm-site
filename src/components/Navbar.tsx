"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import Logo from "./Logo";

type NavigationItem = {
  href: string;
  label: string;
  adminOnly?: boolean;
};

const navigationItems: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/#contact", label: "Contact" },
  { href: "/admin", label: "Admin", adminOnly: true },
];

function NavbarContent() {
  const pathname = usePathname();
  const menuId = useId();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, user, signOut } = useAuth();
  const visibleNavigationItems = navigationItems.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      const menu = document.getElementById(menuId);
      const restoreTriggerFocus =
        menu?.contains(document.activeElement) ?? false;

      setMenuOpen(false);
      if (restoreTriggerFocus) {
        window.requestAnimationFrame(() => menuTriggerRef.current?.focus());
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeAtDesktop);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeAtDesktop);
    };
  }, [menuId, menuOpen]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 top-0 z-[3000] flex min-h-[var(--shared-nav-height)] flex-col bg-white px-4 shadow-md md:hidden"
      >
        <div className="grid min-h-[var(--shared-nav-height)] w-full grid-cols-[2.75rem_1fr_2.75rem] items-center">
          <span aria-hidden="true" />
          <div className="justify-self-center">
            <Logo />
          </div>
          <button
            aria-controls={menuId}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuTriggerRef}
            type="button"
          >
            <span aria-hidden="true" className="text-[1.75rem] leading-none">
              {menuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div
            className="animate-fade-in absolute inset-x-0 top-full flex max-h-[calc(100dvh-var(--shared-nav-height))] flex-col overflow-y-auto border-t border-gray-200 bg-white px-4 pb-3 shadow-md"
            data-lenis-prevent
            id={menuId}
          >
            {visibleNavigationItems.map((item) => (
              <Link
                className="flex min-h-11 w-full items-center justify-center border-b border-gray-100 px-3 text-center text-base text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                className="flex min-h-11 w-full items-center justify-center px-3 text-center text-base text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                onClick={() => {
                  void signOut();
                  setMenuOpen(false);
                }}
                type="button"
              >
                Logout
              </button>
            ) : (
              <Link
                className="flex min-h-11 w-full items-center justify-center px-3 text-center text-sm text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                href="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        ) : null}
      </nav>

      <motion.nav
        aria-label="Primary navigation"
        animate="visible"
        className="fixed inset-x-0 top-0 z-[2000] hidden md:block"
        initial="hidden"
        transition={{ duration: 0.5, delay: 0.3 }}
        variants={fadeInUp}
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
          <Logo />

          <div className="flex items-center gap-8">
            <ul className="flex items-center gap-8 text-lg">
              {visibleNavigationItems.map((item) => (
                <li
                  className="inline-flex flex-col items-center"
                  key={item.href}
                >
                  <motion.div
                    animate="initial"
                    className="group relative"
                    initial="initial"
                    whileHover="hover"
                  >
                    <Link
                      className="group relative inline-flex items-center justify-center"
                      data-touch-target="square"
                      href={item.href}
                    >
                      <span
                        className={`relative z-10 transition-colors duration-200 ${
                          pathname === item.href ||
                          (item.href === "/admin" && pathname === "/admin")
                            ? "text-brand"
                            : ""
                        }`}
                      >
                        {item.label === "Contact" ? "Contact Me" : item.label}
                        <motion.span
                          className="absolute bottom-0 left-0 block h-[2px] bg-brand"
                          initial={{ scaleX: 0, originX: 0 }}
                          style={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                          variants={{ hover: { scaleX: 1, originX: 0 } }}
                        />
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <AnimatePresence initial={false}>
              {user ? (
                <button
                  className="inline-flex items-center justify-center text-sm font-medium text-gray-600 transition-colors hover:text-black"
                  data-touch-target="square"
                  onClick={() => void signOut()}
                  type="button"
                >
                  Logout
                </button>
              ) : (
                <Link
                  className="inline-flex items-center justify-center text-xs text-gray-300 transition-colors hover:text-gray-500"
                  data-touch-target="square"
                  href="/login"
                >
                  Login
                </Link>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

export default NavbarContent;
