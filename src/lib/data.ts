import {
  Code2,
  Server,
  Database,
  Layout,
  Wrench,
  Cloud,
  Users,
  Plane,
  PawPrint,
  GitBranch,
  BookOpen,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import type { Project, Testimonial, Stat } from "@/lib/types";

// Re-export the shared types so existing imports (`@/lib/data`) keep working.
export type { Project, ProjectCategory, Testimonial, GalleryItem, Stat } from "@/lib/types";

// ─────────────────────────────────────────────────────────────
//  SEED DATA — used as a fallback when Supabase isn't configured,
//  and mirrored by supabase/seed.sql for the live database.
// ─────────────────────────────────────────────────────────────
export const seedProjects: Project[] = [
  {
    id: "seed-smart-campus",
    slug: "smart-campus",
    title: "Smart Campus App",
    description:
      "Cross-platform mobile app for University of Moratuwa students - timetables, dining, transit, and event feeds in one place.",
    longDescription:
      "Built with React Native and Firebase, the Smart Campus App unifies fragmented university services. Push notifications, offline-first caching, and role-based access for students, lecturers, and admins.",
    categories: ["Mobile"],
    tech: ["React Native", "Expo", "Firebase", "TypeScript"],
    featured: true,
    published: true,
    year: 2025,
    thumbnailUrl: "https://picsum.photos/seed/smart-campus/1200/800",
    gallery: [
      { type: "image", url: "https://picsum.photos/seed/smart-campus-a/1600/1000", caption: "Home dashboard" },
      { type: "image", url: "https://picsum.photos/seed/smart-campus-b/1600/1000", caption: "Timetable" },
      { type: "video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", caption: "Walkthrough" },
    ],
    liveUrl: null,
    githubUrl: "https://github.com/kalanas210/smart-campus",
    linkedinUrl: "https://www.linkedin.com/in/kalanasandakelum",
    gradient: "from-brand-violet via-brand-fuchsia to-brand-rose",
    sortOrder: 1,
  },
  {
    id: "seed-algo-viz",
    slug: "algo-viz",
    title: "Algorithm Visualizer",
    description:
      "Interactive teaching tool for sorting, pathfinding and graph algorithms with frame-perfect step playback.",
    longDescription:
      "An education-first visualizer built with Next.js, D3, and Framer Motion. Drop a custom dataset, scrub through every step, and inspect call stacks in real time.",
    categories: ["Web", "Open Source"],
    tech: ["Next.js", "D3.js", "Framer Motion", "TypeScript"],
    featured: true,
    published: true,
    year: 2025,
    thumbnailUrl: "https://picsum.photos/seed/algo-viz/1200/800",
    gallery: [
      { type: "image", url: "https://picsum.photos/seed/algo-viz-a/1600/1000", caption: "Sorting view" },
      { type: "image", url: "https://picsum.photos/seed/algo-viz-b/1600/1000", caption: "Pathfinding grid" },
    ],
    liveUrl: "https://algoviz.kalanalk.com",
    githubUrl: "https://github.com/kalanas210/algo-viz",
    linkedinUrl: null,
    gradient: "from-brand-cyan via-brand-violet to-brand-fuchsia",
    sortOrder: 2,
  },
  {
    id: "seed-ecomm",
    slug: "ecomm",
    title: "E-Commerce Platform",
    description:
      "Production-grade storefront with Stripe payments, multi-vendor admin, and a Next.js + PostgreSQL stack.",
    longDescription:
      "Full-fledged e-commerce engine - products, variants, inventory, multi-vendor admin, Stripe Connect, and a server-rendered storefront optimized for Core Web Vitals.",
    categories: ["Web"],
    tech: ["Next.js", "PostgreSQL", "Prisma", "Stripe", "Tailwind"],
    featured: false,
    published: true,
    year: 2024,
    thumbnailUrl: "https://picsum.photos/seed/ecomm/1200/800",
    gallery: [
      { type: "image", url: "https://picsum.photos/seed/ecomm-a/1600/1000", caption: "Storefront" },
      { type: "image", url: "https://picsum.photos/seed/ecomm-b/1600/1000", caption: "Vendor admin" },
    ],
    liveUrl: "https://shop.kalanalk.com",
    githubUrl: "https://github.com/kalanas210/ecomm",
    linkedinUrl: null,
    gradient: "from-brand-emerald via-brand-cyan to-brand-violet",
    sortOrder: 3,
  },
  {
    id: "seed-ai-chatbot",
    slug: "ai-chatbot",
    title: "AI Documentation Chatbot",
    description:
      "RAG-powered assistant that answers technical questions over private docs using FastAPI and embeddings.",
    longDescription:
      "FastAPI service that ingests Markdown/PDF docs, chunks and embeds them with OpenAI, and serves cited answers via a streaming chat UI. Postgres + pgvector for retrieval.",
    categories: ["AI"],
    tech: ["Python", "FastAPI", "OpenAI", "pgvector", "Docker"],
    featured: true,
    published: true,
    year: 2025,
    thumbnailUrl: "https://picsum.photos/seed/ai-chatbot/1200/800",
    gallery: [
      { type: "image", url: "https://picsum.photos/seed/ai-chatbot-a/1600/1000", caption: "Chat UI" },
    ],
    liveUrl: null,
    githubUrl: "https://github.com/kalanas210/docs-bot",
    linkedinUrl: null,
    gradient: "from-brand-amber via-brand-rose to-brand-fuchsia",
    sortOrder: 4,
  },
  {
    id: "seed-portfolio",
    slug: "portfolio",
    title: "Portfolio Website",
    description:
      "The site you're on - Next.js 16, Framer Motion, and a WebGL fluid simulation hero.",
    longDescription:
      "A handcrafted portfolio that doubles as a playground for shader work, motion design, and accessibility-first interaction. Built in the open.",
    categories: ["Web", "Open Source"],
    tech: ["Next.js", "Framer Motion", "Three.js", "Tailwind"],
    featured: false,
    published: true,
    year: 2026,
    thumbnailUrl: "https://picsum.photos/seed/portfolio/1200/800",
    gallery: [
      { type: "image", url: "https://picsum.photos/seed/portfolio-a/1600/1000", caption: "Hero" },
    ],
    liveUrl: "https://kalanalk.com",
    githubUrl: "https://github.com/kalanas210/portfolio",
    linkedinUrl: null,
    gradient: "from-brand-fuchsia via-brand-violet to-brand-cyan",
    sortOrder: 5,
  },
  {
    id: "seed-ems",
    slug: "ems",
    title: "University Event Management",
    description:
      "Spring Boot + React platform for managing campus events, registrations, ticketing, and analytics.",
    longDescription:
      "End-to-end event platform with role-based dashboards for organizers, an attendee app, QR check-in, and Grafana-style analytics.",
    categories: ["Web"],
    tech: ["React", "Spring Boot", "PostgreSQL", "Docker"],
    featured: false,
    published: true,
    year: 2024,
    thumbnailUrl: "https://picsum.photos/seed/ems/1200/800",
    gallery: [
      { type: "image", url: "https://picsum.photos/seed/ems-a/1600/1000", caption: "Organizer dashboard" },
    ],
    liveUrl: null,
    githubUrl: "https://github.com/kalanas210/uom-events",
    linkedinUrl: null,
    gradient: "from-brand-rose via-brand-amber to-brand-emerald",
    sortOrder: 6,
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "seed-t1",
    quote:
      "Kalana's work has this rare quality - every detail looks intentional. The product feels handmade, but ships like a machine.",
    name: "Dilshan Perera",
    role: "Lead Engineer, Bloomroom",
    avatarUrl: null,
    published: true,
    sortOrder: 1,
  },
  {
    id: "seed-t2",
    quote:
      "One of the most thoughtful junior engineers I've collaborated with. He treats the user, the codebase, and his teammates with the same care.",
    name: "Anjali Fernando",
    role: "Senior Designer, Surge",
    avatarUrl: null,
    published: true,
    sortOrder: 2,
  },
  {
    id: "seed-t3",
    quote:
      "Picked up Spring Boot in a weekend and shipped a clean microservice the following week. Curious, kind, and quick.",
    name: "Prof. R. Wickramasinghe",
    role: "University of Moratuwa",
    avatarUrl: null,
    published: true,
    sortOrder: 3,
  },
];

// ─────────────────────────────────────────────────────────────
//  STATIC CONTENT (not managed via the admin panel for now)
// ─────────────────────────────────────────────────────────────
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
      { name: "Java", level: 95 },
      { name: "JavaScript", level: 92 },
      { name: "TypeScript", level: 90 },
      { name: "Python", level: 60 },
    ],
  },
  {
    category: "Frontend",
    icon: Layout,
    accent: "from-brand-cyan to-brand-violet",
    items: [
      { name: "React", level: 94 },
      { name: "Next.js", level: 92 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Angular", level: 45 },
    ],
  },
  {
    category: "Backend & APIs",
    icon: Server,
    accent: "from-brand-emerald to-brand-cyan",
    items: [
      { name: "Spring Boot", level: 96 },
      { name: "Node.js", level: 85 },
      { name: "NestJS", level: 80 },
      { name: "REST APIs", level: 90 },
      { name: "GraphQL", level: 82 },
    ],
  },
  {
    category: "Databases",
    icon: Database,
    accent: "from-brand-amber to-brand-rose",
    items: [
      { name: "PostgreSQL", level: 90 },
      { name: "MySQL", level: 85 },
      { name: "MongoDB", level: 82 },
      { name: "Redis", level: 78 },
    ],
  },
  {
    category: "DevOps & Cloud",
    icon: Cloud,
    accent: "from-brand-violet to-brand-cyan",
    items: [
      { name: "Docker", level: 88 },
      { name: "Kubernetes", level: 76 },
      { name: "AWS", level: 78 },
      { name: "Terraform", level: 72 },
      { name: "CI / CD", level: 82 },
    ],
  },
  {
    category: "Platform & Tools",
    icon: Wrench,
    accent: "from-brand-rose to-brand-fuchsia",
    items: [
      { name: "Keycloak", level: 78 },
      { name: "WSO2 API Manager", level: 75 },
      { name: "Kafka", level: 78 },
      { name: "RabbitMQ", level: 78 },
      { name: "Git", level: 92 },
      { name: "IntelliJ IDEA", level: 90 },
      { name: "Figma", level: 80 },
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
    year: "2024 - Present",
    title: "B.Sc. (Hons) in Information Technology and Management",
    org: "University of Moratuwa",
    description:
      "Reading for an honours degree spanning software engineering, distributed systems, and the business of technology.",
    type: "education",
  },
  {
    year: "2026",
    title: "Software Engineering Intern",
    org: "Open to opportunities - actively looking",
    description:
      "Seeking a software engineering / full-stack internship for the 2026 industrial training cycle.",
    type: "experience",
  },
  {
    year: "2025",
    title: "Software Engineer · Part-time (Remote)",
    org: "Ryzera (Pvt) Ltd",
    description:
      "Building and shipping production features remotely while studying full-time.",
    type: "experience",
  },
  {
    year: "2022",
    title: "G.C.E. Advanced Level - Physical Science",
    org: "Z-score 1.498",
    description:
      "Physical Science stream - Combined Maths, Physics, and Chemistry.",
    type: "education",
  },
  {
    year: "2018",
    title: "G.C.E. Ordinary Level - 9 A's",
    org: "Nine A passes (A9)",
    description:
      "Straight A's including English Literature, Business & Accounting Studies, and ICT.",
    type: "education",
  },
];

export interface Hobby {
  name: string;
  icon: LucideIcon;
}

export const hobbies: Hobby[] = [
  { name: "Cricket", icon: Dumbbell },
  { name: "Travelling", icon: Plane },
  { name: "Animal welfare", icon: PawPrint },
  { name: "Leadership", icon: Users },
  { name: "Open source", icon: GitBranch },
  { name: "Reading", icon: BookOpen },
];

export const techMarquee = [
  "Java",
  "Spring Boot",
  "Node.js",
  "NestJS",
  "React",
  "Next.js",
  "Angular",
  "TypeScript",
  "JavaScript",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Terraform",
  "Kafka",
  "RabbitMQ",
  "Keycloak",
  "WSO2 API Manager",
  "GraphQL",
  "Git",
  "IntelliJ IDEA",
  "Figma",
  "CI / CD",
  "Python",
];

// ── Headline stats shown in the home "About" section ──────────────────────────
// These are the FALLBACK values. The live values come from the admin panel
// (site_settings.stats) so they can be edited without a deploy.
export const defaultStats: Stat[] = [
  { value: 3.7, suffix: " / 4.0", label: "Current GPA" },
  { value: 25, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "k", label: "Lines of OSS code" },
  { value: 2, suffix: "+", label: "Years writing code" },
];

// Professional / engineering practice - the IT-related "real" skills that
// aren't a single tool. Shown on /skills under "How I work" (click to expand).
export interface Practice {
  name: string;
  description: string;
}

export const professionalSkills: Practice[] = [
  {
    name: "Scalable microservices",
    description:
      "Designing systems as independently deployable services that scale out cleanly and fail in isolation.",
  },
  {
    name: "System design",
    description:
      "Mapping components, data flow, and trade-offs up front so the architecture holds as it grows.",
  },
  {
    name: "Event-driven architecture",
    description:
      "Decoupling services with Kafka and RabbitMQ so work flows asynchronously and stays reliable under load.",
  },
  {
    name: "REST API design",
    description:
      "Building clear, versioned, well-documented APIs that other teams can build on with confidence.",
  },
  {
    name: "Database design",
    description:
      "Modelling normalized schemas, indexing, and tuning queries across SQL and NoSQL stores.",
  },
  {
    name: "Team collaboration",
    description:
      "Communicating clearly, sharing ownership, and writing code teammates can pick up without friction.",
  },
  {
    name: "Agile / Scrum",
    description:
      "Working in short iterations with stand-ups, sprint planning, and continuous delivery.",
  },
  {
    name: "Code review",
    description:
      "Giving and receiving feedback that keeps the codebase consistent, readable, and safe to change.",
  },
  {
    name: "Problem solving",
    description:
      "Breaking ambiguous problems into small pieces and validating with the simplest thing that works.",
  },
  {
    name: "Mentoring",
    description:
      "Helping teammates level up through pairing, documentation, and patient explanation.",
  },
];

// ── Compact headline skills for the /about page (links out to /skills). ────────
export const topSkills: string[] = [
  "Java",
  "Spring Boot",
  "React",
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
];
