// src/data/coursesData.ts

// TypeScript interfaces
export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription?: string; // Optional for listing page
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
  duration: string; // in hours
  enrolledCount: number;
  rating: number;
  reviewsCount?: number;
  price: number;
  originalPrice?: number;
  category: string;
  thumbnail: string;
  lessons: number; // For listing page
  isBestseller?: boolean;
  isNew?: boolean;
  previewVideo?: string; // For details page
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

// Mock course data (Merged and unified)
export const coursesData: Course[] = [
  {
    id: "1",
    title: "Complete English Grammar Course",
    description:
      "Master English grammar from basics to advanced concepts with practical examples and exercises.",
    fullDescription:
      "This comprehensive English grammar course is designed to take you from beginner to advanced level. We'll cover all aspects of English grammar including tenses, parts of speech, sentence structure, punctuation, and more. Each module includes detailed explanations, practical examples, and exercises to reinforce your learning.",
    instructor: {
      id: "inst-1",
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      bio: "Sarah is an experienced English language instructor with over 10 years of teaching experience.",
      rating: 4.8,
      studentsCount: 45678,
      coursesCount: 5,
    },
    level: "Beginner",
    duration: "12",
    enrolledCount: 15234,
    rating: 4.7,
    reviewsCount: 3456,
    price: 49.99,
    originalPrice: 89.99,
    category: "Grammar",
    thumbnail:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    lessons: 45,
    isBestseller: true,
    previewVideo:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    lastUpdated: "2023-10-15",
    requirements: [
      "Basic understanding of English",
      "Willingness to learn and practice",
      "Notebook for taking notes",
    ],
    whatYouLearn: [
      "Master all English grammar rules",
      "Improve writing skills",
      "Enhance speaking confidence",
      "Understand complex sentence structures",
      "Use punctuation correctly",
      "Avoid common grammar mistakes",
    ],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Grammar",
        duration: "1h 30m",
        lessons: [
          {
            id: "1.1",
            title: "What is Grammar?",
            duration: "15m",
            isPreview: true,
          },
          {
            id: "1.2",
            title: "Parts of Speech Overview",
            duration: "25m",
            isPreview: false,
          },
          {
            id: "1.3",
            title: "Sentence Structure",
            duration: "30m",
            isPreview: false,
          },
          {
            id: "1.4",
            title: "Basic Punctuation",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
      {
        id: "2",
        title: "Nouns and Pronouns",
        duration: "2h 15m",
        lessons: [
          {
            id: "2.1",
            title: "Types of Nouns",
            duration: "30m",
            isPreview: false,
          },
          {
            id: "2.2",
            title: "Countable and Uncountable Nouns",
            duration: "25m",
            isPreview: false,
          },
          {
            id: "2.3",
            title: "Pronoun Types",
            duration: "35m",
            isPreview: false,
          },
          {
            id: "2.4",
            title: "Pronoun Agreement",
            duration: "25m",
            isPreview: false,
          },
          {
            id: "2.5",
            title: "Possessive Nouns and Pronouns",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
      {
        id: "3",
        title: "Verbs and Tenses",
        duration: "3h 45m",
        lessons: [
          { id: "3.1", title: "Verb Types", duration: "30m", isPreview: false },
          {
            id: "3.2",
            title: "Present Tenses",
            duration: "45m",
            isPreview: false,
          },
          {
            id: "3.3",
            title: "Past Tenses",
            duration: "45m",
            isPreview: false,
          },
          {
            id: "3.4",
            title: "Future Tenses",
            duration: "45m",
            isPreview: false,
          },
          {
            id: "3.5",
            title: "Perfect Tenses",
            duration: "40m",
            isPreview: false,
          },
          {
            id: "3.6",
            title: "Conditional Sentences",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Business English Communication",
    description:
      "Develop professional English skills for meetings, presentations, and business correspondence.",
    fullDescription:
      "This course focuses on the specific English language skills needed in a business environment. You'll learn how to communicate effectively in meetings, write professional emails and reports, deliver compelling presentations, and network with confidence.",
    instructor: {
      id: "inst-2",
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      bio: "Michael is a business communication expert with 15 years of corporate training experience.",
      rating: 4.6,
      studentsCount: 23456,
      coursesCount: 3,
    },
    level: "Intermediate",
    duration: "8",
    enrolledCount: 8921,
    rating: 4.5,
    reviewsCount: 1234,
    price: 59.99,
    category: "Business",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    lessons: 32,
    language: "English",
    subtitles: ["English", "Chinese", "Japanese"],
    lastUpdated: "2023-09-20",
    requirements: [
      "Intermediate English proficiency",
      "Basic business knowledge",
      "Desire to improve professional communication",
    ],
    whatYouLearn: [
      "Write effective business emails",
      "Deliver engaging presentations",
      "Participate confidently in meetings",
      "Network with professionals",
      "Use appropriate business vocabulary",
      "Understand cross-cultural communication",
    ],
    curriculum: [
      {
        id: "1",
        title: "Business Writing Essentials",
        duration: "2h 30m",
        lessons: [
          {
            id: "1.1",
            title: "Email Etiquette",
            duration: "30m",
            isPreview: true,
          },
          {
            id: "1.2",
            title: "Report Writing",
            duration: "45m",
            isPreview: false,
          },
          {
            id: "1.3",
            title: "Proposals and Memos",
            duration: "35m",
            isPreview: false,
          },
          {
            id: "1.4",
            title: "Professional Tone",
            duration: "20m",
            isPreview: false,
          },
          {
            id: "1.5",
            title: "Editing and Proofreading",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
      {
        id: "2",
        title: "Presentation Skills",
        duration: "3h 15m",
        lessons: [
          {
            id: "2.1",
            title: "Structuring Presentations",
            duration: "30m",
            isPreview: false,
          },
          {
            id: "2.2",
            title: "Visual Aids",
            duration: "25m",
            isPreview: false,
          },
          {
            id: "2.3",
            title: "Body Language",
            duration: "40m",
            isPreview: false,
          },
          {
            id: "2.4",
            title: "Handling Q&A",
            duration: "30m",
            isPreview: false,
          },
          {
            id: "2.5",
            title: "Virtual Presentations",
            duration: "40m",
            isPreview: false,
          },
          {
            id: "2.6",
            title: "Practice Session",
            duration: "20m",
            isPreview: false,
          },
        ],
      },
    ],
  },
  // Add the rest of your mock courses here (items 3-8 from your original list)
  // I will add a placeholder for the 3rd one to ensure the build works,
  // but you should copy the rest from your original code.
  {
    id: "3",
    title: "IELTS Preparation Masterclass",
    description:
      "Comprehensive preparation for IELTS exam with practice tests and expert guidance.",
    instructor: {
      id: "inst-3",
      name: "Emily Watson",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      bio: "Emily is an IELTS examiner with 15 years of experience.",
      rating: 4.9,
      studentsCount: 12000,
      coursesCount: 4,
    },
    level: "Advanced",
    duration: "15",
    enrolledCount: 12054,
    rating: 4.8,
    reviewsCount: 2500,
    price: 79.99,
    originalPrice: 129.99,
    category: "Test Preparation",
    thumbnail:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    lessons: 58,
    isBestseller: true,
    fullDescription: "Full description for IELTS...",
    requirements: ["Intermediate English", "Target band score 7.0+"],
    whatYouLearn: ["Master all 4 sections", "Time management strategies"],
    curriculum: [],
  },
];

// Categories for filter
export const categories = [
  "All",
  "Grammar",
  "Business",
  "Test Preparation",
  "Speaking",
  "Writing",
  "Literature",
  "Vocabulary",
];

export const levels = ["All", "Beginner", "Intermediate", "Advanced"];

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Smith",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    comment:
      "This course exceeded my expectations! The instructor explains complex grammar concepts in a very clear and simple way.",
    date: "2023-10-20",
    helpfulCount: 24,
    isHelpful: false,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Emily Johnson",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    comment:
      "Great course with comprehensive content. I've learned a lot about English grammar.",
    date: "2023-10-15",
    helpfulCount: 18,
    isHelpful: true,
  },
];
