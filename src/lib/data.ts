import {
  Code2,
  Server,
  Database,
  Layout,
  Wrench,
  Cpu,
  Smartphone,
  Brain,
  Globe,
  GitBranch,
  Package,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type ProjectCategory = "Web" | "Mobile" | "AI" | "Open Source";

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  categories: ProjectCategory[];
  tech: string[];
  featured?: boolean;
  year: number;
  liveUrl?: string;
  githubUrl?: string;
  gradient: string;
}

export const projects: Project[] = [
  {
    slug: "smart-campus",
    title: "Smart Campus App",
    description:
      "Cross-platform mobile app for University of Moratuwa students — timetables, dining, transit, and event feeds in one place.",
    longDescription:
      "Built with React Native and Firebase, the Smart Campus App unifies fragmented university services. Push notifications, offline-first caching, and role-based access for students, lecturers, and admins.",
    categories: ["Mobile"],
    tech: ["React Native", "Expo", "Firebase", "TypeScript"],
    featured: true,
    year: 2025,
    githubUrl: "https://github.com/kalanas210/smart-campus",
    gradient: "from-brand-violet via-brand-fuchsia to-brand-rose",
  },
  {
    slug: "algo-viz",
    title: "Algorithm Visualizer",
    description:
      "Interactive teaching tool for sorting, pathfinding and graph algorithms with frame-perfect step playback.",
    longDescription:
      "An education-first visualizer built with Next.js, D3, and Framer Motion. Drop a custom dataset, scrub through every step, and inspect call stacks in real time.",
    categories: ["Web", "Open Source"],
    tech: ["Next.js", "D3.js", "Framer Motion", "TypeScript"],
    featured: true,
    year: 2025,
    liveUrl: "https://algoviz.kalana.dev",
    githubUrl: "https://github.com/kalanas210/algo-viz",
    gradient: "from-brand-cyan via-brand-violet to-brand-fuchsia",
  },
  {
    slug: "ecomm",
    title: "E-Commerce Platform",
    description:
      "Production-grade storefront with Stripe payments, multi-vendor admin, and a Next.js + PostgreSQL stack.",
    longDescription:
      "Full-fledged e-commerce engine — products, variants, inventory, multi-vendor admin, Stripe Connect, and a server-rendered storefront optimized for Core Web Vitals.",
    categories: ["Web"],
    tech: ["Next.js", "PostgreSQL", "Prisma", "Stripe", "Tailwind"],
    year: 2024,
    liveUrl: "https://shop.kalana.dev",
    githubUrl: "https://github.com/kalanas210/ecomm",
    gradient: "from-brand-emerald via-brand-cyan to-brand-violet",
  },
  {
    slug: "ai-chatbot",
    title: "AI Documentation Chatbot",
    description:
      "RAG-powered assistant that answers technical questions over private docs using FastAPI and embeddings.",
    longDescription:
      "FastAPI service that ingests Markdown/PDF docs, chunks and embeds them with OpenAI, and serves cited answers via a streaming chat UI. Postgres + pgvector for retrieval.",
    categories: ["AI"],
    tech: ["Python", "FastAPI", "OpenAI", "pgvector", "Docker"],
    featured: true,
    year: 2025,
    githubUrl: "https://github.com/kalanas210/docs-bot",
    gradient: "from-brand-amber via-brand-rose to-brand-fuchsia",
  },
  {
    slug: "portfolio",
    title: "Portfolio Website",
    description:
      "The site you're on — Next.js 16, Framer Motion, and a WebGL fluid simulation hero.",
    longDescription:
      "A handcrafted portfolio that doubles as a playground for shader work, motion design, and accessibility-first interaction. Built in the open.",
    categories: ["Web", "Open Source"],
    tech: ["Next.js", "Framer Motion", "Three.js", "Tailwind"],
    year: 2026,
    liveUrl: "https://kalana.dev",
    githubUrl: "https://github.com/kalanas210/portfolio",
    gradient: "from-brand-fuchsia via-brand-violet to-brand-cyan",
  },
  {
    slug: "ems",
    title: "University Event Management",
    description:
      "Spring Boot + React platform for managing campus events, registrations, ticketing, and analytics.",
    longDescription:
      "End-to-end event platform with role-based dashboards for organizers, an attendee app, QR check-in, and Grafana-style analytics.",
    categories: ["Web"],
    tech: ["React", "Spring Boot", "PostgreSQL", "Docker"],
    year: 2024,
    githubUrl: "https://github.com/kalanas210/uom-events",
    gradient: "from-brand-rose via-brand-amber to-brand-emerald",
  },
];

export interface SkillGroup {
  category: string;
  icon: LucideIcon;
  items: { name: string; level: number }[];
  accent: string;
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    icon: Code2,
    accent: "from-brand-violet to-brand-fuchsia",
    items: [
      { name: "TypeScript", level: 92 },
      { name: "JavaScript", level: 95 },
      { name: "Python", level: 88 },
      { name: "Java", level: 85 },
      { name: "C++", level: 75 },
    ],
  },
  {
    category: "Frontend",
    icon: Layout,
    accent: "from-brand-cyan to-brand-violet",
    items: [
      { name: "React", level: 94 },
      { name: "Next.js", level: 92 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 86 },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    accent: "from-brand-emerald to-brand-cyan",
    items: [
      { name: "Node.js", level: 90 },
      { name: "Express", level: 88 },
      { name: "Spring Boot", level: 82 },
      { name: "FastAPI", level: 84 },
    ],
  },
  {
    category: "Database",
    icon: Database,
    accent: "from-brand-amber to-brand-rose",
    items: [
      { name: "PostgreSQL", level: 88 },
      { name: "MongoDB", level: 84 },
      { name: "Firebase", level: 86 },
      { name: "Redis", level: 78 },
    ],
  },
  {
    category: "Tools",
    icon: Wrench,
    accent: "from-brand-rose to-brand-fuchsia",
    items: [
      { name: "Git", level: 92 },
      { name: "Docker", level: 82 },
      { name: "Figma", level: 80 },
      { name: "VS Code", level: 96 },
    ],
  },
  {
    category: "Other",
    icon: Cpu,
    accent: "from-brand-violet to-brand-cyan",
    items: [
      { name: "REST / GraphQL", level: 88 },
      { name: "WebGL / Shaders", level: 70 },
      { name: "CI/CD", level: 78 },
      { name: "Testing", level: 80 },
    ],
  },
];

export interface TimelineEntry {
  year: string;
  title: string;
  org: string;
  description: string;
  type: "education" | "experience";
}

export const timeline: TimelineEntry[] = [
  {
    year: "2023 — Present",
    title: "B.Sc. (Hons) in Information Technology",
    org: "University of Moratuwa",
    description:
      "Specializing in software systems, distributed computing, and human-computer interaction.",
    type: "education",
  },
  {
    year: "2025",
    title: "Software Engineering Intern",
    org: "Open to opportunities",
    description:
      "Looking for SWE / full-stack internships for the 2025–2026 industrial training cycle.",
    type: "experience",
  },
  {
    year: "2024",
    title: "Open Source Maintainer",
    org: "Independent",
    description:
      "Maintaining a handful of TypeScript libraries and contributing to motion-design tooling.",
    type: "experience",
  },
  {
    year: "2022",
    title: "G.C.E. Advanced Level — Physical Science",
    org: "Sri Lanka",
    description: "Top 1% in the island. Maths, Physics, Chemistry.",
    type: "education",
  },
];

export interface Hobby {
  name: string;
  icon: LucideIcon;
}

export const hobbies: Hobby[] = [
  { name: "Open source", icon: GitBranch },
  { name: "Motion design", icon: Palette },
  { name: "Generative art", icon: Brain },
  { name: "Mobile dev", icon: Smartphone },
  { name: "Reading", icon: Package },
  { name: "Web platform", icon: Globe },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Kalana's work has this rare quality — every detail looks intentional. The product feels handmade, but ships like a machine.",
    name: "Dilshan Perera",
    role: "Lead Engineer, Bloomroom",
  },
  {
    quote:
      "One of the most thoughtful junior engineers I've collaborated with. He treats the user, the codebase, and his teammates with the same care.",
    name: "Anjali Fernando",
    role: "Senior Designer, Surge",
  },
  {
    quote:
      "Picked up Spring Boot in a weekend and shipped a clean microservice the following week. Curious, kind, and quick.",
    name: "Prof. R. Wickramasinghe",
    role: "University of Moratuwa",
  },
];

export const techMarquee = [
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "Tailwind",
  "Framer Motion",
  "PostgreSQL",
  "Docker",
  "Spring Boot",
  "Python",
  "FastAPI",
  "Three.js",
  "GraphQL",
  "AWS",
  "Figma",
];
