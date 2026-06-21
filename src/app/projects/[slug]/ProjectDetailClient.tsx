'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './projects.module.css';
import ProjectGalleryClient from './ProjectGalleryClient';
import { gsap } from 'gsap';

interface Project {
  name: string;
  videoSrc: string;
  images: string[];
}

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Entrance animation for Hero Title
    if (heroTitleRef.current) {
      gsap.fromTo(heroTitleRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power4.out', delay: 0.2 }
      );
    }

    // GSAP ScrollTrigger reveal for footer
    if (footerRef.current) {
      gsap.fromTo(footerRef.current.querySelectorAll(`.${styles.footerLogo}, .${styles.footerLinks} a, .${styles.copyright}`),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          }
        }
      );
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [project]);

  return (
    <div className={styles.projectPageWrapper}>
      {/* Floating absolute header */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoLight}>felix</span>
            <span className={styles.logoBold}>nieto.</span>
          </Link>

          <div className={styles.headerRight}>
            <Link href="/#footer" className={styles.contactBtn}>
              <span className={styles.flipText}>
                <span className={styles.flipCube}>
                  <span className={styles.flipFront}>GET IN TOUCH</span>
                  <span className={styles.flipBack}>GET IN TOUCH</span>
                </span>
              </span>
              <span className={styles.arrowWrapper}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 5h8M5 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <Link href="/menu" className={styles.menuLines} aria-label="Menu">
              <span className={styles.line}></span>
              <span className={styles.line}></span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION: Full-width background video with large title */}
      <section className={styles.heroContainer}>
        <video
          src={project.videoSrc}
          className={styles.bgVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.videoOverlay} />
        
        <div className={styles.heroContent}>
          <h1 ref={heroTitleRef} className={styles.heroTitle}>{project.name}</h1>
        </div>
      </section>

      {/* GALLERY SECTION: Interactive sticky stacked card gallery */}
      <ProjectGalleryClient images={project.images} projectName={project.name} />

      {/* Site Footer */}
      <footer ref={footerRef} className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>A U R A</div>
          <div className={styles.footerLinks}>
            <Link href="/#philosophy">Architecture</Link>
            <Link href="/#spaces">Spaces</Link>
            <Link href="/#materiality">Materiality</Link>
            <Link href="/#footer">Contact</Link>
          </div>
          <p className={styles.copyright}>© 2026 Aura Architecture. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
