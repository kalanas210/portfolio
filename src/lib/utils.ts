import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Kalana Sandakelum",
  shortName: "Kalana",
  role: "Full Stack Developer",
  university: "University of Moratuwa",
  location: "Moratuwa, Sri Lanka",
  email: "kalana@example.com",
  url: "https://kalana.dev",
  description:
    "Undergraduate software engineer at the University of Moratuwa crafting fast, beautiful, and accessible web experiences.",
  social: {
    github: "https://github.com/kalanas210",
    linkedin: "https://linkedin.com/in/kalana-sandakelum",
    twitter: "https://twitter.com/kalanasandakelum",
    instagram: "https://instagram.com/kalanasandakelum",
  },
} as const;
