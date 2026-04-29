// components/types.ts
import { LucideIcon } from "lucide-react";

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string; // e.g., "bg-purple-100 text-purple-600"
  image: string | null;
  age: string;
  duration: string;
  schedule: string;
  mode: string;
  features: string[];
  syllabus: string[];
  fee: string;
  installment?: string;
  contact: string;
  buttonText: string;
}

export interface FeatureItem {
  icon: LucideIcon;
  text: string;
}
