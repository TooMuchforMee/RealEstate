'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

// Easing / Opacity helper function
function calculateOpacityForRange(progress: number, start: number, end: number): number {
  if (progress < start || progress > end) return 0;
  const t = (progress - start) / (end - start);
  return Math.sin(t * Math.PI); // Perfect sine-wave fade-in and fade-out
}
const showcaseProjects = [
  {
    id: 'kensho',
    name: 'KENSHO',
    bgImage: '/menu/work_left.png',
    videoSrc: '/videos/kensho.mp4',
    details: ['CREATIVE DIRECTION', '& FILM PRODUCTION', '2024']
  },
  {
    id: 'panoramah',
    name: 'PANORAMAH',
    bgImage: '/menu/work_rt.png',
    videoSrc: '/videos/panoramah.mp4',
    details: ['CREATIVE DIRECTION', '& FILM PRODUCTION', '2024']
  },
  {
    id: 'solheaven',
    name: 'SOLHEAVEN',
    bgImage: '/menu/work_rb.png',
    videoSrc: '/videos/solheaven.mp4',
    details: ['CREATIVE DIRECTION', '& FILM PRODUCTION', '2025']
  }
];

const testimonials = [
  {
    id: 1,
    author: "SANZPONT AWARD-WINNING - ARCHITECTURE FIRM",
    lines: [
      [
        { text: "FÉLIX BROUGHT ", highlight: false },
        { text: "CLARITY, INITIATIVE", highlight: true }
      ],
      [
        { text: "AND RELIABILITY ", highlight: true },
        { text: "TO A FAST-PACED", highlight: false }
      ],
      [{ text: "PRIVATE DEVELOPMENT", highlight: false }],
      [{ text: "PRESENTATION. THE PROJECT", highlight: false }],
      [{ text: "ENDED UP WINNING, A GREAT", highlight: false }],
      [{ text: "OUTCOME FOR A COLLABORATION", highlight: false }],
      [{ text: "WE GENUINELY RECOMMEND AND", highlight: false }],
      [{ text: "WOULD REPEAT AGAIN.", highlight: false }]
    ]
  },
  {
    id: 2,
    author: "NUA - ARCHITECTURE FIRM",
    lines: [
      [{ text: "FÉLIX HELPED US IDENTIFY OUR", highlight: false }],
      [{ text: "STRENGTHS AND BRING MORE", highlight: false }],
      [{ text: "CLARITY TO OUR POSITIONING. HIS", highlight: false }],
      [{ text: "STRATEGIC PERSPECTIVE", highlight: true }],
      [{ text: "EXCEEDED OUR EXPECTATIONS.", highlight: false }],
      [{ text: "HIS INSIGHTS ON PROCESSES, CLIENT", highlight: false }],
      [{ text: "ACQUISITION AND POSITIONING", highlight: false }],
      [{ text: "WERE ESPECIALLY VALUABLE.", highlight: false }]
    ]
  },
  {
    id: 3,
    author: "ROMINA ROSS - RO ARCHITECTURE",
    lines: [
      [{ text: "WHAT STOOD OUT MOST WAS", highlight: false }],
      [
        { text: "FÉLIX'S ", highlight: false },
        { text: "SENSITIVITY AND ABILITY", highlight: true }
      ],
      [{ text: "TO UNDERSTAND THE ESSENCE OF MY", highlight: false }],
      [{ text: "FIRM. THE WHOLE EXPERIENCE FELT", highlight: false }],
      [{ text: "COHERENT, THOUGHTFUL AND", highlight: false }],
      [{ text: "DEEPLY ALIGNED WITH THE TYPE OF", highlight: false }],
      [{ text: "WORK I WANT TO COMMUNICATE.", highlight: false }]
    ]
  },
  {
    id: 4,
    author: "SIMONE VELA - SV DESIGN",
    lines: [
      [
        { text: "FÉLIX DELIVERED ", highlight: false },
        { text: "EXCEPTIONAL", highlight: true }
      ],
      [
        { text: "VISUAL WORK ", highlight: true },
        { text: "UNDER EXTREMELY", highlight: false }
      ],
      [{ text: "DEMANDING TIMELINES. HIS", highlight: false }],
      [{ text: "CREATIVE INPUT AND ABILITY TO", highlight: false }],
      [{ text: "MAKE FAST, HIGH-QUALITY", highlight: false }],
      [{ text: "DECISIONS ELEVATED THE OVERALL", highlight: false }],
      [{ text: "PRESENTATION. THE FINAL RESULT", highlight: false }],
      [{ text: "WAS EXCELLENT AND VISUALLY", highlight: false }],
      [{ text: "SPECTACULAR.", highlight: false }]
    ]
  }
];

export default function Home() {
  const router = useRouter();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [headerTheme, setHeaderTheme] = useState<'dark' | 'light'>('dark');

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

  // Showcase section refs
  const containerRefShowcase = useRef<HTMLDivElement>(null);
  const videoCursorRef = useRef<HTMLAnchorElement>(null);
  const lastMouseYRef = useRef<number>(0);

  // Showcase section states
  const [scrollProgressShowcase, setScrollProgressShowcase] = useState(0);
  const [hoveredProjectIdx, setHoveredProjectIdx] = useState(0);
  const [isHoveringShowcase, setIsHoveringShowcase] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Testimonials refs and state
  const testimonialsSectionRef = useRef<HTMLDivElement>(null);
  const [testimonialsInView, setTestimonialsInView] = useState(false);

  // Preload all 238 images
  useEffect(() => {
    const totalFrames = 238;
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = new Array(totalFrames);

    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
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

        // Dynamically set header theme based on overlap with the cream flip section
        if (rectFlip.top <= 0 && rectFlip.bottom >= 80) {
          setHeaderTheme('light');
        } else {
          setHeaderTheme('dark');
        }

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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll listener for Showcase
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRefShowcase.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
          setScrollProgressShowcase(progress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll detector for Testimonials Section
  useEffect(() => {
    function handleScroll() {
      const element = testimonialsSectionRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        setTestimonialsInView(true);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update hovered index based on scroll changes
  useEffect(() => {
    if (!isHoveringShowcase || isMobile) return;

    const vh = window.innerHeight;
    const panel1Progress = Math.max(0, Math.min(1, scrollProgressShowcase / 0.5));
    const panel2Progress = Math.max(0, Math.min(1, (scrollProgressShowcase - 0.5) / 0.5));

    const y1 = (1 - panel1Progress) * vh;
    const y2 = (1 - panel2Progress) * vh;

    const y = lastMouseYRef.current;

    let currentHovered = 0;
    if (y >= y2) {
      currentHovered = 2;
    } else if (y >= y1) {
      currentHovered = 1;
    } else {
      currentHovered = 0;
    }

    if (hoveredProjectIdx !== currentHovered) {
      setHoveredProjectIdx(currentHovered);
    }
  }, [scrollProgressShowcase, isHoveringShowcase, hoveredProjectIdx, isMobile]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    lastMouseYRef.current = y;

    if (videoCursorRef.current) {
      const width = videoCursorRef.current.offsetWidth || 400;
      const height = videoCursorRef.current.offsetHeight || 250;
      videoCursorRef.current.style.left = `${x - width / 2}px`;
      videoCursorRef.current.style.top = `${y - height / 2}px`;
    }

    const vh = rect.height;
    const panel1Progress = Math.max(0, Math.min(1, scrollProgressShowcase / 0.5));
    const panel2Progress = Math.max(0, Math.min(1, (scrollProgressShowcase - 0.5) / 0.5));

    const y1 = (1 - panel1Progress) * vh;
    const y2 = (1 - panel2Progress) * vh;

    let currentHovered = 0;
    if (y >= y2) {
      currentHovered = 2;
    } else if (y >= y1) {
      currentHovered = 1;
    } else {
      currentHovered = 0;
    }

    if (hoveredProjectIdx !== currentHovered) {
      setHoveredProjectIdx(currentHovered);
    }
  };

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

      {/* Header */}
      <header className={`${styles.header} ${headerTheme === 'light' ? styles.headerLight : styles.headerDark}`}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoLight}>felix</span>
            <span className={styles.logoBold}>nieto.</span>
          </Link>

          <div className={styles.headerRight}>
            <Link href="#footer" className={styles.contactBtn}>
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
        {/* Intro Block */}
        <div className={styles.introBlock}>
          <p className={styles.introText}>
            PROPERTY FILMS, STILL IMAGERY AND INTERACTIVE<br />
            EXPERIENCES FOR OFF-PLAN CAMPAIGNS.
          </p>
          <div className={styles.introButtons}>
            <Link href="/about" className={styles.introBtnTeal}>
              <span className={styles.flipText}>
                <span className={styles.flipCube}>
                  <span className={styles.flipFront}>ABOUT ME</span>
                  <span className={styles.flipBack}>ABOUT ME</span>
                </span>
              </span>
              <span className={styles.arrowWrapper}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 5h8M5 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <Link href="/about#process" className={styles.introBtnOutline}>
              <span className={styles.flipText}>
                <span className={styles.flipCube}>
                  <span className={styles.flipFront}>MY PROCESS</span>
                  <span className={styles.flipBack}>MY PROCESS</span>
                </span>
              </span>
              <span className={styles.simpleArrow}>→</span>
            </Link>
          </div>
        </div>

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


      {/* SECTION 5: Project Showcase Stack */}
      <div ref={containerRefShowcase} id="projects" className={styles.scrollTrack5}>
        <div 
          className={styles.stickyContent5}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringShowcase(true)}
          onMouseLeave={() => setIsHoveringShowcase(false)}
        >
          {/* Project Panels */}
          {showcaseProjects.map((proj, idx) => {
            let style = {};
            if (!isMobile) {
              if (idx === 1) {
                const panel1Progress = Math.max(0, Math.min(1, scrollProgressShowcase / 0.5));
                style = { transform: `translateY(calc(100vh - ${panel1Progress * 100}vh))` };
              } else if (idx === 2) {
                const panel2Progress = Math.max(0, Math.min(1, (scrollProgressShowcase - 0.5) / 0.5));
                style = { transform: `translateY(calc(100vh - ${panel2Progress * 100}vh))` };
              }
            }

            return (
              <Link 
                key={proj.id} 
                href={`/projects/${proj.id}`}
                className={`${styles.projectPanel} ${styles[`panel${idx}`]}`}
                style={style}
              >
                {/* Blurred Background Image */}
                <div 
                  className={styles.panelBg}
                  style={{ backgroundImage: `url(${proj.bgImage})` }}
                />
                <div className={styles.panelBgOverlay} />

                {/* Panel Content Overlay */}
                <div className={styles.panelContent}>
                  <h2 className={styles.projectName}>{proj.name}</h2>
                  
                  {/* Inline Video for Mobile (Option A) */}
                  {isMobile && (
                    <div className={styles.inlineVideoContainer}>
                      <div className={styles.inlineVideoFrame}>
                        <div className={styles.inlineBorderTop}>VIEW PROJECT</div>
                        <div className={styles.inlineBorderBottom}>VIEW PROJECT</div>
                        <div className={styles.inlineBorderLeft}>VIEW PROJECT</div>
                        <div className={styles.inlineBorderRight}>VIEW PROJECT</div>
                        <video 
                          src={proj.videoSrc}
                          className={styles.inlineVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      </div>
                    </div>
                  )}

                  <div className={styles.projectDetails}>
                    {proj.details.map((line, lIdx) => (
                      <div key={lIdx}>{line}</div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Floating Video Cursor for Desktop */}
          {!isMobile && (
            <Link 
              href={`/projects/${showcaseProjects[hoveredProjectIdx].id}`}
              ref={videoCursorRef} 
              className={`${styles.videoCursor} ${isHoveringShowcase ? styles.activeVideoCursor : ''}`}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/projects/${showcaseProjects[hoveredProjectIdx].id}`);
              }}
            >
              <div className={styles.borderTop}>VIEW PROJECT</div>
              <div className={styles.borderBottom}>VIEW PROJECT</div>
              <div className={styles.borderLeft}>VIEW PROJECT</div>
              <div className={styles.borderRight}>VIEW PROJECT</div>
              <div className={styles.videoInner}>
                {showcaseProjects.map((proj, idx) => (
                  <video
                    key={`vid-${proj.id}`}
                    src={proj.videoSrc}
                    className={`${styles.cursorVideo} ${hoveredProjectIdx === idx ? styles.activeVideo : ''}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ))}
              </div>
            </Link>
          )}
        </div>
      </div>


      {/* SECTION 6: Testimonials */}
      <section 
        ref={testimonialsSectionRef} 
        className={styles.testimonialsSection}
      >
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.testimonialsTitleSerif}>WHAT PEOPLE</h2>
          <h2 className={styles.testimonialsTitleSans}>SAY ABOUT ME</h2>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                {testimonial.lines.map((line, lIdx) => (
                  <div 
                    key={lIdx} 
                    className={`${styles.testimonialLine} ${testimonialsInView ? styles.testimonialLineAnimate : ''}`}
                    style={{ transitionDelay: `${lIdx * 120}ms` }}
                  >
                    {line.map((part, pIdx) => (
                      <span 
                        key={pIdx} 
                        className={part.highlight ? styles.highlightText : ''}
                      >
                        {part.text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className={styles.testimonialAuthor}>
                {testimonial.author}
              </div>
            </div>
          ))}
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
