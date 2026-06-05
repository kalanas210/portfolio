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
  email: "kalanasandakelum210@gmail.com",
  url: "https://kalanalk.com",
  description:
    "Kalana Sandakelum — full-stack & Java (Spring Boot) developer and University of Moratuwa undergraduate in Sri Lanka, building fast, modern web applications.",
  social: {
    github: "https://github.com/kalanas210",
    linkedin: "https://www.linkedin.com/in/kalanasandakelum",
    facebook: "https://www.facebook.com/profile.php?id=61559175435939",
    instagram: "https://www.instagram.com/kalana_s5",
  },
} as const;
