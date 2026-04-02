// src/types/course.ts

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    rating: number;
    studentsCount: number;
    coursesCount: number;
  };
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  enrolledCount: number;
  rating: number;
  reviewsCount?: number;
  price: number;
  originalPrice?: number;
  category: string;
  thumbnail: string;
  lessons: number;
  isBestseller?: boolean;
  isNew?: boolean;
  previewVideo?: string;
  language?: string;
  subtitles?: string[];
  lastUpdated?: string;
  requirements?: string[];
  whatYouLearn?: string[];
  curriculum?: {
    id: string;
    title: string;
    duration: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      isPreview: boolean;
    }[];
  }[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isHelpful?: boolean;
}
