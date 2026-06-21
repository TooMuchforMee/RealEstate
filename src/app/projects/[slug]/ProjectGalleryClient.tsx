"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./projects.module.css";

interface ProjectGalleryClientProps {
  images: string[];
  projectName: string;
}

const OFFSET_PER_CARD = 14;   // px — initial vertical offset per stacked card
const SCALE_PER_CARD  = 0.045; // scale step between stacked cards
const SCROLL_MULTIPLIER = 4;   // total scroll height = vh * this value

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ProjectGalleryClient({ images, projectName }: ProjectGalleryClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Reset/truncate card refs to the correct length of current images
    cardRefs.current = cardRefs.current.slice(0, images.length);
    const cards = cardRefs.current;
    const n = cards.length;
    if (n === 0) return;

    function update() {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop    = section.getBoundingClientRect().top + window.scrollY;
      const scrollInside  = window.scrollY - sectionTop;
      const totalScroll   = section.offsetHeight - window.innerHeight;
      const progress      = clamp(scrollInside / totalScroll, 0, 1);
      const seg           = 1 / (n - 1);

      cards.forEach((card, i) => {
        if (!card) return;

        const p  = clamp((progress - (i * seg) / 2) / seg, 0, 1);
        const ep = easeOut(p);

        // Initial stacked state: back cards are lower + smaller
        const initY     = (n - 1 - i) * OFFSET_PER_CARD;
        const initScale = 1 - (n - 1 - i) * SCALE_PER_CARD;

        card.style.transform = `translateY(${lerp(initY, 0, ep).toFixed(2)}px) scale(${lerp(initScale, 1, ep).toFixed(4)})`;
        card.style.zIndex    = String(i === 0 ? n : Math.round(lerp(n - i, n, ep)));
        card.style.boxShadow = `0 ${Math.round(lerp(6, 24, ep))}px ${Math.round(lerp(20, 50, ep))}px rgba(0,0,0,${lerp(0.4, 0.7, ep).toFixed(2)})`;
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [images]);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${SCROLL_MULTIPLIER * 100}vh` }}
      className={styles.stackedSection}
    >
      {/* Sticky viewport — stays in place while section scrolls */}
      <div className={styles.stickyViewport}>

        {/* Card stack */}
        <div className={styles.cardStackContainer}>
          {images.map((imgSrc, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={styles.stackedCard}
              style={{
                // Initial position: cards behind are pushed down + scaled down
                transform: `translateY(${(images.length - 1 - i) * OFFSET_PER_CARD}px) scale(${1 - (images.length - 1 - i) * SCALE_PER_CARD})`,
                zIndex: i + 1,
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div className={styles.cardHoverWrapper}>
                <Image
                  src={imgSrc}
                  alt={`${projectName} Detail ${i + 1}`}
                  fill
                  className={styles.stackedImage}
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 60vw, 1000px"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <p className={styles.scrollHint}>
          scroll ↓
        </p>
      </div>
    </section>
  );
}
