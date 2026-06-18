import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './projects.module.css';

const projectDetails = {
  kensho: {
    name: 'KENSHO',
    videoSrc: '/videos/kensho.mp4',
    images: [
      '/menu/work_left.png',
      '/menu/process_left.png',
      '/about_showcase.png'
    ]
  },
  panoramah: {
    name: 'PANORAMAH',
    videoSrc: '/videos/panoramah.mp4',
    images: [
      '/menu/work_rt.png',
      '/menu/process_rt.png',
      '/menu/about_rt.png'
    ]
  },
  solheaven: {
    name: 'SOLHEAVEN',
    videoSrc: '/videos/solheaven.mp4',
    images: [
      '/menu/work_rb.png',
      '/menu/process_rb.png',
      '/menu/about_rb.png'
    ]
  }
};

export function generateStaticParams() {
  return [
    { slug: 'kensho' },
    { slug: 'panoramah' },
    { slug: 'solheaven' }
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projectDetails[slug as keyof typeof projectDetails];

  if (!project) {
    notFound();
  }

  return (
    <div className={styles.projectPageWrapper}>
      {/* Floating absolute header */}
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
          <h1 className={styles.heroTitle}>{project.name}</h1>
        </div>
      </section>

      {/* GALLERY SECTION: Three spaced large portfolio images */}
      <section className={styles.galleryContainer}>
        <div className={styles.galleryGrid}>
          {project.images.map((imgSrc, idx) => (
            <div key={idx} className={styles.galleryImageWrapper}>
              <Image
                src={imgSrc}
                alt={`${project.name} showcase detail ${idx + 1}`}
                fill
                sizes="100vw"
                className={styles.galleryImage}
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Site Footer */}
      <footer className={styles.footer}>
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
