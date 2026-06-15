'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';

// Easing / Opacity helper function
function calculateOpacityForRange(progress: number, start: number, end: number): number {
  if (progress < start || progress > end) return 0;
  const t = (progress - start) / (end - start);
  return Math.sin(t * Math.PI); // Perfect sine-wave fade-in and fade-out
}

export default function Home() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);

  // References for direct DOM styling to achieve 60fps scrolling
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Refs for the editorial text flip section
  const flipContainerRef = useRef<HTMLDivElement>(null);
  const flipWord1Ref = useRef<HTMLDivElement>(null);
  const flipWord2Ref = useRef<HTMLDivElement>(null);
  const flipWord3Ref = useRef<HTMLDivElement>(null);

  // Preload all 238 images
  useEffect(() => {
    const totalFrames = 238;
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = new Array(totalFrames);

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameNum}.jpg`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        // Fallback for missing or broken frames
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };

      loadedImages[i - 1] = img;
    }
  }, []);

  // Frame drawer with aspect ratio cover (acts like background-size: cover)
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas || imagesRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex - 1];
    if (!img) return;

    const w = canvas.width;
    const h = canvas.height;
    const iw = img.width;
    const ih = img.height;

    // Calculate scaling ratio
    const r = Math.min(w / iw, h / ih);
    let nw = iw * r;
    let nh = ih * r;
    let cx = 0;
    let cy = 0;
    let cw = iw;
    let ch = ih;

    if (nw < w) {
      const scale = w / nw;
      nw *= scale;
      nh *= scale;
    }
    if (nh < h) {
      const scale = h / nh;
      nw *= scale;
      nh *= scale;
    }

    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * 0.5;
    cy = (ih - ch) * 0.5;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
  }, []);

  // Handle Resize and high-DPI scaling
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Draw current frame immediately
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded, drawFrame]);

  // Scroll listener
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      if (totalHeight <= 0) return;

      // Calculate scroll progress from 0 to 1
      const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));

      // Calculate frame index from 1 to 238
      const frameIndex = Math.max(1, Math.min(238, Math.floor(progress * 237) + 1));

      if (currentFrameRef.current !== frameIndex) {
        currentFrameRef.current = frameIndex;
        requestAnimationFrame(() => drawFrame(frameIndex));
      }

      // Calculate opacity & position for narrative text
      const opacity1 = calculateOpacityForRange(progress, 0.05, 0.28);
      const opacity2 = calculateOpacityForRange(progress, 0.38, 0.62);
      const opacity3 = calculateOpacityForRange(progress, 0.72, 0.95);

      if (text1Ref.current) {
        text1Ref.current.style.opacity = opacity1.toFixed(3);
        text1Ref.current.style.transform = `translateY(${(25 * (1 - opacity1)).toFixed(1)}px)`;
      }
      if (text2Ref.current) {
        text2Ref.current.style.opacity = opacity2.toFixed(3);
        text2Ref.current.style.transform = `translateY(${(25 * (1 - opacity2)).toFixed(1)}px)`;
      }
      if (text3Ref.current) {
        text3Ref.current.style.opacity = opacity3.toFixed(3);
        text3Ref.current.style.transform = `translateY(${(25 * (1 - opacity3)).toFixed(1)}px)`;
      }

      // Fade out scroll mouse indicator
      if (indicatorRef.current) {
        const indicatorOpacity = Math.max(0, 1 - progress * 15);
        indicatorRef.current.style.opacity = indicatorOpacity.toFixed(3);
      }

      // Calculate progress for the text flip section
      const flipContainer = flipContainerRef.current;
      if (flipContainer) {
        const rectFlip = flipContainer.getBoundingClientRect();
        const totalHeightFlip = rectFlip.height - window.innerHeight;
        if (totalHeightFlip > 0) {
          // Progress from 0 to 1 for this section
          const progressFlip = Math.max(0, Math.min(1, -rectFlip.top / totalHeightFlip));

          // Line 1: TRANSFORMING -> CREATIVE (progress: 0.08 to 0.33)
          const t1 = Math.max(0, Math.min(1, (progressFlip - 0.08) / 0.25));
          // Line 2: PROPERTIES -> VISUAL (progress: 0.36 to 0.61)
          const t2 = Math.max(0, Math.min(1, (progressFlip - 0.36) / 0.25));
          // Line 3: INTO -> NARRATIVES (progress: 0.64 to 0.89)
          const t3 = Math.max(0, Math.min(1, (progressFlip - 0.64) / 0.25));

          if (flipWord1Ref.current) {
            const front = flipWord1Ref.current.querySelector(`.${styles.front}`) as HTMLElement;
            const back = flipWord1Ref.current.querySelector(`.${styles.back}`) as HTMLElement;
            if (front && back) {
              front.style.transform = `rotateX(${-90 * t1}deg) translateY(${-50 * t1}px)`;
              front.style.opacity = (1 - t1).toFixed(3);
              back.style.transform = `rotateX(${90 - 90 * t1}deg) translateY(${50 * (1 - t1)}px)`;
              back.style.opacity = t1.toFixed(3);
            }
          }

          if (flipWord2Ref.current) {
            const front = flipWord2Ref.current.querySelector(`.${styles.front}`) as HTMLElement;
            const back = flipWord2Ref.current.querySelector(`.${styles.back}`) as HTMLElement;
            if (front && back) {
              front.style.transform = `rotateX(${-90 * t2}deg) translateY(${-50 * t2}px)`;
              front.style.opacity = (1 - t2).toFixed(3);
              back.style.transform = `rotateX(${90 - 90 * t2}deg) translateY(${50 * (1 - t2)}px)`;
              back.style.opacity = t2.toFixed(3);
            }
          }

          if (flipWord3Ref.current) {
            const front = flipWord3Ref.current.querySelector(`.${styles.front}`) as HTMLElement;
            const back = flipWord3Ref.current.querySelector(`.${styles.back}`) as HTMLElement;
            if (front && back) {
              front.style.transform = `rotateX(${-90 * t3}deg) translateY(${-50 * t3}px)`;
              front.style.opacity = (1 - t3).toFixed(3);
              back.style.transform = `rotateX(${90 - 90 * t3}deg) translateY(${50 * (1 - t3)}px)`;
              back.style.opacity = t3.toFixed(3);
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [imagesLoaded, drawFrame]);

  return (
    <main className={styles.main}>
      {/* Loading preloader screen */}
      <div className={`${styles.loadingScreen} ${imagesLoaded ? styles.hidden : ''}`}>
        <div className={styles.loaderRing}>
          <div className={styles.loaderSpinner}></div>
          <span className={styles.loaderProgress}>{loadProgress}%</span>
        </div>
        <span className={styles.loaderBrand}>AURA ARCHITECTURE</span>
      </div>

      {/* Sticky Canvas Video Scroll Container */}
      <div ref={containerRef} className={styles.scrollContainer}>
        <div className={styles.canvasWrapper}>
          <canvas ref={canvasRef} className={styles.canvas} />

          {/* Overlaid Narrative Text */}
          <div className={styles.overlayTextContainer}>
            <div ref={text1Ref} className={styles.caption} style={{ opacity: 0 }}>
              AURA RESIDENCE
              <span className={styles.captionHighlight}>SEAMLESS MINIMALISM</span>
            </div>
            <div ref={text2Ref} className={styles.caption} style={{ opacity: 0 }}>
              CRAFTED PRECISION
              <span className={styles.captionHighlight}>ORGANIC PLASTER & STONE</span>
            </div>
            <div ref={text3Ref} className={styles.caption} style={{ opacity: 0 }}>
              ARCHITECTURAL FLOW
              <span className={styles.captionHighlight}>NATURAL LIGHT HARMONY</span>
            </div>
          </div>

          {/* Mouse Scroll Indicator */}
          <div ref={indicatorRef} className={styles.scrollIndicator}>
            <span>Scroll to Enter</span>
            <div className={styles.scrollMouse}>
              <div className={styles.scrollWheel}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Text Flip Section */}
      <div ref={flipContainerRef} className={styles.flipSectionContainer}>
        <div className={styles.flipStickyWrapper}>
          <div className={styles.flipTextWrapper}>
            {/* Line 1 */}
            <div className={styles.wordContainer}>
              <div ref={flipWord1Ref} className={styles.wordCube}>
                <div className={`${styles.wordFace} ${styles.front} ${styles.serifWord}`}>TRANSFORMING</div>
                <div className={`${styles.wordFace} ${styles.back} ${styles.serifWord}`}>CREATIVE</div>
              </div>
            </div>
            {/* Line 2 */}
            <div className={styles.wordContainer}>
              <div ref={flipWord2Ref} className={styles.wordCube}>
                <div className={`${styles.wordFace} ${styles.front} ${styles.sansWord}`}>PROPERTIES</div>
                <div className={`${styles.wordFace} ${styles.back} ${styles.sansWord}`}>VISUAL</div>
              </div>
            </div>
            {/* Line 3 */}
            <div className={styles.wordContainer}>
              <div ref={flipWord3Ref} className={styles.wordCube}>
                <div className={`${styles.wordFace} ${styles.front} ${styles.serifWord}`}>INTO</div>
                <div className={`${styles.wordFace} ${styles.back} ${styles.serifWord}`}>NARRATIVES</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Heroio Showcase Section */}
      <section className={styles.heroioSection}>
        <div className={styles.sectionContainer}>
          
          {/* Header */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>The Philosophy</span>
            <h2 className={styles.sectionTitle}>
              Pure Space. <span>Organic Architecture.</span>
            </h2>
            <p className={styles.sectionDesc}>
              Aura represents the integration of natural raw elements and soft geometries. A residential masterpiece built for quietness, sensory experience, and architectural flow.
            </p>
          </div>

          {/* Features Grid */}
          <div className={styles.grid}>
            
            {/* Card 1 */}
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Monolithic Curves</h3>
              <p className={styles.cardDesc}>
                Architectural structures designed as a singular, flowing concrete monument. Structural lines merge seamlessly with raw plaster to form organic living cavities.
              </p>
            </div>

            {/* Card 2 */}
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37m0 0l-1.06-1.06a1.5 1.5 0 00-2.122 0L6.794 15.602a2.25 2.25 0 01-1.053.608l-1.442.36a.75.75 0 00-.902-.903l.36-1.443a2.25 2.25 0 01.608-1.052l9.37-9.37m9.37 0l1.06 1.06a1.5 1.5 0 010 2.122l-9.37 9.37m-2.125-2.125l-.75-.75" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Bespoke Craftsmanship</h3>
              <p className={styles.cardDesc}>
                Every surface features hand-applied micro-cement plaster. The organic stone coffee table is meticulously hand-sculpted from solid, local travertine.
              </p>
            </div>

            {/* Card 3 */}
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Light & Shadow</h3>
              <p className={styles.cardDesc}>
                High-aperture, floor-to-ceiling sliding glass panels bridge the boundary between raw concrete and daylight, painting dynamic shadows across the interiors.
              </p>
            </div>

          </div>

          {/* Split Detail Showcase */}
          <div className={styles.splitShowcase}>
            
            {/* Content side */}
            <div className={styles.showcaseContent}>
              <h3 className={styles.showcaseTitle}>
                Sculpting the <span>Atmosphere.</span>
              </h3>
              <p className={styles.sectionDesc}>
                Beyond visual luxury, Aura is engineered for silence and tactile warmth. The acoustic design reduces echo using porous stone plaster, while underfloor thermal concrete maintains natural comfort.
              </p>

              <div className={styles.showcaseFeatureList}>
                
                <div className={styles.featureItem}>
                  <div className={styles.featureBullet}></div>
                  <div className={styles.featureText}>
                    <h4>Tactile Plaster Finishes</h4>
                    <p>Washed plaster with organic pigment tones that shift colors under natural solar arcs.</p>
                  </div>
                </div>

                <div className={styles.featureItem}>
                  <div className={styles.featureBullet}></div>
                  <div className={styles.featureText}>
                    <h4>Frameless Glass Portals</h4>
                    <p>Minimalist track systems embedded directly into the concrete floor and ceiling plates.</p>
                  </div>
                </div>

                <div className={styles.featureItem}>
                  <div className={styles.featureBullet}></div>
                  <div className={styles.featureText}>
                    <h4>Stone Curations</h4>
                    <p>Curated travertine and limestone blocks that anchor the room with natural weight.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Glowing Graphic Side */}
            <div className={styles.glassShowcaseBox}>
              <div className={styles.glassShowcaseInner}>
                <span className={styles.glassGlowNumber}>238</span>
                <span className={styles.glassLabel}>Animation Frames</span>
                <p className={styles.cardDesc}>
                  A fluid, cinematic sequence capturing the dialogue between raw structural lines, curves, and soft daylight.
                </p>
              </div>
            </div>

          </div>

          {/* Dynamic Stats Grid */}
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>320 m²</span>
              <span className={styles.statLabel}>Living Space</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>4.8 m</span>
              <span className={styles.statLabel}>Ceiling Height</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>01</span>
              <span className={styles.statLabel}>Masterpiece</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>100%</span>
              <span className={styles.statLabel}>Sustainable Elements</span>
            </div>
          </div>

        </div>
      </section>

      {/* Sleek Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>A U R A</div>
          <div className={styles.footerLinks}>
            <a href="#philosophy">Architecture</a>
            <a href="#spaces">Spaces</a>
            <a href="#materiality">Materiality</a>
            <a href="#contact">Contact</a>
          </div>
          <p className={styles.copyright}>© 2026 Aura Architecture. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
