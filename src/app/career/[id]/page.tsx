// import CareerDetailClient from "./CareerDetailClient";

import CareerDetailClient from "./CareerDetailClient";

// Mock function to get job data (Replace with API/Database call in production)
const getJobDetails = (id: string) => {
  const jobs: { [key: string]: any } = {
    "1": {
      id: "1",
      title: "Senior English Instructor",
      department: "Education",
      location: "Dhanmondi, Dhaka",
      type: "Full-time",
      description:
        "We are looking for an experienced English instructor to lead advanced courses and mentor junior teachers.",
      requirements: [
        "Master's degree in English or related field",
        "3+ years of teaching experience",
        "Excellent communication skills",
        "IELTS/Business English experience is a plus",
      ],
      responsibilities: [
        "Conduct engaging online and offline classes",
        "Prepare course materials and curriculum",
        "Assess student progress and provide feedback",
      ],
    },
    "2": {
      id: "2",
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description:
        "Join our tech team to build scalable features for our learning platform.",
      requirements: [
        "React/Next.js proficiency",
        "TypeScript experience",
        "Tailwind CSS skills",
      ],
      responsibilities: ["Develop new features", "Fix bugs", "Code reviews"],
    },
    // Add other jobs here...
  };

  return jobs[id] || null;
};

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = getJobDetails(params.id);

  if (!job) {
    return { title: "Job Not Found" };
  }

  return {
    title: `Apply for ${job.title} | Chalak Champs Careers`,
    description: job.description,
    openGraph: {
      title: `Job Opening: ${job.title} at Chalak Champs`,
      description: job.description,
      url: `https://chalakchamps.com/career/${params.id}`,
    },
  };
}

const CareerDetailPage = ({ params }: { params: { id: string } }) => {
  const job = getJobDetails(params.id);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Job Not Found</h1>
      </div>
    );
  }

  return <CareerDetailClient job={job} />;
};

export default CareerDetailPage;
