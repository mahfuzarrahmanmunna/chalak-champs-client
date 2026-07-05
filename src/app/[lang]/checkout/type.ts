export interface Course {
  id: string;
  title: string;
  image: string;
  dates: string;
  originalPrice: number;
  offerPrice: number;
  description?: string;
  instructor?: string;
  duration?: string;
  totalLectures?: number;
}


export interface Addon {
  id: number;
  name: string;
  price: number;
  icon: React.ReactNode;
  description: string;
}

export interface PricingResponse {
  course: Course;
  addons: Addon[];
}