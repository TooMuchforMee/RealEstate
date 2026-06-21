'use client';

import React, { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Child component to handle Lenis-to-GSAP ScrollTrigger synchronization
function ScrollSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Tell ScrollTrigger to update whenever Lenis scrolls
    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', handleScroll);

    // Ensure ScrollTrigger refreshes on initial load
    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis]);

  return null;
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Clear scroll memory on reload
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      ScrollTrigger.clearScrollMemory();
    }
  }, []);

  // Whenever the pathname changes, refresh ScrollTrigger to recalculate trigger positions
  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [pathname]);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
      }}
    >
      <ScrollSync />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', minHeight: '100vh', position: 'relative' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ReactLenis>
  );
}
