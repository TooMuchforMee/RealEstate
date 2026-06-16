'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './menu.module.css';

export default function MenuPage() {
  const [activeItem, setActiveItem] = useState<'work' | 'about' | 'process' | null>(null);

  return (
    <main className={styles.menuPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoLight}>felix</span>
            <span className={styles.logoBold}>nieto.</span>
          </Link>

          <div className={styles.headerRight}>
            <Link href="/#footer" className={styles.contactBtn}>
              <span>GET IN TOUCH</span>
              <span className={styles.arrowWrapper}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 5h8M5 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <Link href="/" className={styles.closeBtn} aria-label="Close Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <div className={styles.contentContainer}>
        {/* Navigation list */}
        <nav className={styles.navMenu}>
          <div 
            className={styles.menuItem}
            onMouseEnter={() => setActiveItem('work')}
            onMouseLeave={() => setActiveItem(null)}
          >
            <Link href="/#philosophy" className={styles.menuLink}>
              <div className={styles.wordCube}>
                <div className={`${styles.wordFace} ${styles.front} ${styles.serifWord}`}>WORK</div>
                <div className={`${styles.wordFace} ${styles.back} ${styles.sansWord}`}>WORK</div>
              </div>
            </Link>
          </div>

          <div 
            className={styles.menuItem}
            onMouseEnter={() => setActiveItem('about')}
            onMouseLeave={() => setActiveItem(null)}
          >
            <Link href="/about" className={styles.menuLink}>
              <div className={styles.wordCube}>
                <div className={`${styles.wordFace} ${styles.front} ${styles.sansWord}`}>ABOUT</div>
                <div className={`${styles.wordFace} ${styles.back} ${styles.serifWord}`}>ABOUT</div>
              </div>
            </Link>
          </div>

          <div 
            className={styles.menuItem}
            onMouseEnter={() => setActiveItem('process')}
            onMouseLeave={() => setActiveItem(null)}
          >
            <Link href="/#materiality" className={styles.menuLink}>
              <div className={styles.wordCube}>
                <div className={`${styles.wordFace} ${styles.front} ${styles.sansWord}`}>PROCESS</div>
                <div className={`${styles.wordFace} ${styles.back} ${styles.serifWord}`}>PROCESS</div>
              </div>
            </Link>
          </div>
        </nav>
      </div>

      {/* Slide-in Images Section */}
      <div className={styles.imagesWrapper}>
        {/* WORK Images */}
        <div className={`${styles.imageContainer} ${styles.leftImage} ${activeItem === 'work' ? styles.active : ''}`} style={{ transitionDelay: '0ms' }}>
          <Image src="/menu/work_left.png" alt="Work Architecture" fill sizes="(max-width: 768px) 100vw, 320px" priority />
        </div>
        <div className={`${styles.imageContainer} ${styles.rightTopImage} ${activeItem === 'work' ? styles.active : ''}`} style={{ transitionDelay: '50ms' }}>
          <Image src="/menu/work_rt.png" alt="Work Bathroom" fill sizes="(max-width: 768px) 100vw, 340px" />
        </div>
        <div className={`${styles.imageContainer} ${styles.rightBottomImage} ${activeItem === 'work' ? styles.active : ''}`} style={{ transitionDelay: '100ms' }}>
          <Image src="/menu/work_rb.png" alt="Work Bathtub Relax" fill sizes="(max-width: 768px) 100vw, 360px" />
        </div>

        {/* ABOUT Images */}
        <div className={`${styles.imageContainer} ${styles.leftImage} ${activeItem === 'about' ? styles.active : ''}`} style={{ transitionDelay: '0ms' }}>
          <Image src="/menu/about_left.png" alt="About Villa" fill sizes="(max-width: 768px) 100vw, 320px" />
        </div>
        <div className={`${styles.imageContainer} ${styles.rightTopImage} ${activeItem === 'about' ? styles.active : ''}`} style={{ transitionDelay: '50ms' }}>
          <Image src="/menu/about_rt.png" alt="About Living Room" fill sizes="(max-width: 768px) 100vw, 340px" />
        </div>
        <div className={`${styles.imageContainer} ${styles.rightBottomImage} ${activeItem === 'about' ? styles.active : ''}`} style={{ transitionDelay: '100ms' }}>
          <Image src="/menu/about_rb.png" alt="About Sketching" fill sizes="(max-width: 768px) 100vw, 360px" />
        </div>

        {/* PROCESS Images */}
        <div className={`${styles.imageContainer} ${styles.leftImage} ${activeItem === 'process' ? styles.active : ''}`} style={{ transitionDelay: '0ms' }}>
          <Image src="/menu/process_left.png" alt="Process Model" fill sizes="(max-width: 768px) 100vw, 320px" />
        </div>
        <div className={`${styles.imageContainer} ${styles.rightTopImage} ${activeItem === 'process' ? styles.active : ''}`} style={{ transitionDelay: '50ms' }}>
          <Image src="/menu/process_rt.png" alt="Process Concrete" fill sizes="(max-width: 768px) 100vw, 340px" />
        </div>
        <div className={`${styles.imageContainer} ${styles.rightBottomImage} ${activeItem === 'process' ? styles.active : ''}`} style={{ transitionDelay: '100ms' }}>
          <Image src="/menu/process_rb.png" alt="Process Crafting" fill sizes="(max-width: 768px) 100vw, 360px" />
        </div>
      </div>

      {/* Footer Socials */}
      <footer className={styles.menuFooter}>
        <span className={styles.footerLabel}>CONNECT WITH ME</span>
        <div className={styles.socialIcons}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}
