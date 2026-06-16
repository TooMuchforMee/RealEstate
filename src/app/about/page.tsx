'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './about.module.css';

const desc1Text = `I'm Félix Nieto, architect by background and creative director by practice. Over the last decade, I have helped architecture teams and real estate developers present and sell high-end residential projects through property films, still imagery and interactive experiences for off-plan campaigns.`;
const desc2Text = `I quickly learned that in luxury real estate, first impressions are everything. Buyers and investors form their perception of a project in seconds. That perception either builds value or undermines it. The real difference lies in strategic visual direction. That is where I come in.`;

const showcaseText = `THROUGH ARCHITECTURAL SENSITIVITY, CINEMATIC STORYTELLING AND STRATEGIC THINKING, I SHAPE THE VISUAL DIRECTION YOUR DEVELOPMENT NEEDS TO MAKE THE RIGHT IMPRESSION ON THE RIGHT AUDIENCE.`;

const projects: { id: string; title: string; image: string; category?: string }[] = [
  { id: 'sensitivity', title: 'ARCHITECTURAL SENSITIVITY', image: '/menu/work_left.png' },
  { id: 'storytelling', title: 'CINEMATIC STORYTELLING', image: '/menu/work_rt.png' },
  { id: 'direction', title: 'STRATEGIC DIRECTION', image: '/menu/work_rb.png' },
  { id: 'positioning', title: 'MARKET POSITIONING', image: '/menu/about_rt.png' },
  { id: 'excellence', title: 'CREATIVE EXCELLENCE', image: '/menu/process_left.png' }
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const containerRef3 = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollProgress2, setScrollProgress2] = useState(0);
  const [scrollProgress3, setScrollProgress3] = useState(0);

  const desc1Words = desc1Text.split(' ');
  const desc2Words = desc2Text.split(' ');
  const showcaseWords = showcaseText.split(' ');

  const activeIdx = Math.min(projects.length - 1, Math.floor(scrollProgress3 * projects.length));

  useEffect(() => {
    const handleScroll = () => {
      // Container 1 progress
      const container1 = containerRef.current;
      if (container1) {
        const rect = container1.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
          setScrollProgress(progress);
        }
      }

      // Container 2 progress
      const container2 = containerRef2.current;
      if (container2) {
        const rect = container2.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
          setScrollProgress2(progress);
        }
      }

      // Container 3 progress
      const container3 = containerRef3.current;
      if (container3) {
        const rect = container3.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
          setScrollProgress3(progress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate word-by-word translateY for Description 1 (falling down to disappear)
  const getWordTranslateYDesc1 = (index: number) => {
    const totalWords = desc1Words.length;
    // Stagger start fades across 0% to 70% of scroll progress
    const startFade = (index / totalWords) * 0.7;
    const endFade = startFade + 0.15;

    if (scrollProgress < startFade) return 0;
    if (scrollProgress > endFade) return 110;
    const ratio = (scrollProgress - startFade) / 0.15;
    return ratio * 110;
  };

  // Calculate word-by-word translateY for Description 2 (rising up to appear)
  const getWordTranslateYDesc2 = (index: number) => {
    const totalWords = desc2Words.length;
    // Stagger end fades across 15% to 85% of scroll progress
    const startFade = 0.15 + (index / totalWords) * 0.65;
    const endFade = startFade + 0.15;

    if (scrollProgress < startFade) return 110;
    if (scrollProgress > endFade) return 0;
    const ratio = (scrollProgress - startFade) / 0.15;
    return 110 - ratio * 110;
  };

  // Calculate word-by-word reveal style for Section 2 (sliding in from right, behind the image)
  const getWordRevealStyles = (index: number) => {
    const totalWords = showcaseWords.length;
    // Stagger starts across 0% to 75% of scroll progress
    const startReveal = (index / totalWords) * 0.72;
    const endReveal = startReveal + 0.15;

    if (scrollProgress2 < startReveal) {
      return { opacity: 0, translateX: '45vw' };
    }
    if (scrollProgress2 > endReveal) {
      return { opacity: 1, translateX: '0vw' };
    }
    const ratio = (scrollProgress2 - startReveal) / 0.15;
    return {
      opacity: Math.min(1, ratio * 1.5),
      translateX: `${(1 - ratio) * 45}vw`
    };
  };

  return (
    <div className={styles.aboutWrapper}>
      {/* SECTION 1: Intro block */}
      <div ref={containerRef} className={styles.scrollTrack}>
        <div className={styles.stickyContent}>
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

                <Link href="/menu" className={styles.menuLines} aria-label="Menu">
                  <span className={styles.line}></span>
                  <span className={styles.line}></span>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Layout Grid */}
          <div className={styles.mainContent}>
            <h1 className={styles.heading}>
              <span className={styles.sansWord}>I DON&apos;T MAKE </span>
              <span className={styles.serifWord}>RENDERS.</span>
              <br />
              <span className={styles.sansWord}>I CRAFT </span>
              <span className={styles.serifWord}>VISUAL NARRATIVES</span>
              <br />
              <span className={styles.sansWord}>WORTHY OF YOUR PROJECT.</span>
            </h1>

            <div className={styles.columns}>
              {/* Column 1: Portrait */}
              <div className={styles.portraitCol}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src="/about_portrait.png" 
                    alt="Félix Nieto Portrait" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 300px" 
                    priority 
                    className={styles.portraitImg}
                  />
                </div>
              </div>

              {/* Column 2: Description 1 (Disappearing by falling down) */}
              <div className={styles.descCol1}>
                <p className={styles.descText}>
                  {desc1Words.map((word, idx) => (
                    <span key={`d1-${idx}`} className={styles.wordWrapper}>
                      <span 
                        style={{ transform: `translateY(${getWordTranslateYDesc1(idx)}%)` }}
                        className={styles.wordInner}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </p>
              </div>

              {/* Column 3: Description 2 (Appearing by rising up) */}
              <div className={styles.descCol2}>
                <p className={styles.descText}>
                  {desc2Words.map((word, idx) => (
                    <span key={`d2-${idx}`} className={styles.wordWrapper}>
                      <span 
                        style={{ transform: `translateY(${getWordTranslateYDesc2(idx)}%)` }}
                        className={styles.wordInner}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Showcase block */}
      <div ref={containerRef2} className={styles.scrollTrack2}>
        <div className={styles.stickyContent2}>
          <div className={styles.showcaseGrid}>
            
            {/* Left Column: Heading word reveal */}
            <div className={styles.showcaseTextCol}>
              <h2 className={styles.showcaseHeading}>
                {showcaseWords.map((word, idx) => {
                  const { opacity, translateX } = getWordRevealStyles(idx);
                  return (
                    <span key={`s-${idx}`} className={styles.showcaseWordWrapper}>
                      <span 
                        style={{ 
                          opacity, 
                          transform: `translateX(${translateX})` 
                        }}
                        className={styles.showcaseWordInner}
                      >
                        {word}
                      </span>
                    </span>
                  );
                })}
              </h2>
            </div>

            {/* Right Column: Large showcase image */}
            <div className={styles.showcaseImageCol}>
              <div className={styles.showcaseImageWrapper}>
                <Image 
                  src="/about_showcase.png" 
                  alt="Luxury Showcase Pool" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 650px" 
                  priority 
                  className={styles.showcaseImg}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 3: Large knockout typography with background image list */}
      <div ref={containerRef3} className={styles.scrollTrack3}>
        <div className={styles.stickyContent3}>
          
          {/* Background List (Outside center window, on cream bg) */}
          <div 
            style={{ transform: `translateY(calc(43vh - ${scrollProgress3 * (projects.length - 1) * 14}vh))` }}
            className={styles.listContainerBackground}
          >
            {projects.map((p, idx) => (
              <div 
                key={`bg-${p.id}`} 
                className={`${styles.projectItem} ${activeIdx === idx ? styles.activeBgItem : ''}`}
              >
                <span className={styles.projectTitle}>{p.title}</span>
                {p.category && <span className={styles.projectCategory}>({p.category})</span>}
              </div>
            ))}
          </div>

          {/* Center Window Mask */}
          <div className={styles.centerWindow}>
            
            {/* Background Background Images Cross-Fade */}
            <div className={styles.imageRevealWrapper}>
              {projects.map((p, idx) => (
                <div 
                  key={`img-${p.id}`} 
                  className={`${styles.bgImage} ${activeIdx === idx ? styles.activeImage : ''}`}
                  style={{ backgroundImage: `url(${p.image})` }}
                />
              ))}
              <div className={styles.imageOverlay} />
            </div>

            {/* Foreground List (Inside center window, on top of images) */}
            <div 
              style={{ transform: `translateY(calc(18vh - ${scrollProgress3 * (projects.length - 1) * 14}vh))` }}
              className={styles.listContainerForeground}
            >
              {projects.map((p, idx) => (
                <div 
                  key={`fg-${p.id}`} 
                  className={`${styles.projectItem} ${activeIdx === idx ? styles.activeFgItem : ''}`}
                >
                  <span className={styles.projectTitle}>{p.title}</span>
                  {p.category && <span className={styles.projectCategory}>({p.category})</span>}
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
