import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

const projectDetails = {
  kensho: {
    name: 'KENSHO',
    videoSrc: '/amazon%20IQ/project%201.mp4',
    images: [
      '/menu/work_left.png',
      '/menu/process_left.png',
      '/about_showcase.png'
    ]
  },
  panoramah: {
    name: 'PANORAMAH',
    videoSrc: '/amazon%20IQ/project%202.mp4',
    images: [
      '/menu/work_rt.png',
      '/menu/process_rt.png',
      '/menu/about_rt.png'
    ]
  },
  solheaven: {
    name: 'SOLHEAVEN',
    videoSrc: '/amazon%20IQ/project%203.mp4',
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

  return <ProjectDetailClient project={project} />;
}
