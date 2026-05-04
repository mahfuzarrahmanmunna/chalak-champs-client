"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Heart,
  Lightbulb,
  ChevronRight,
  Search,
} from "lucide-react";

// Types for Job Listings
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

// Dummy Data for Jobs
const jobListings: Job[] = [
  {
    id: "1",
    title: "Senior English Instructor",
    department: "Education",
    location: "Dhanmondi, Dhaka",
    type: "Full-time",
    description:
      "We are looking for an experienced English instructor to lead advanced courses and mentor junior teachers.",
  },
  {
    id: "2",
    title: "Frontend Developer (React/Next.js)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Join our tech team to build scalable features for our learning platform using Next.js and TypeScript.",
  },
  {
    id: "3",
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    description:
      "Drive our content strategy to attract students worldwide. Experience in SEO and social media is a must.",
  },
  {
    id: "4",
    title: "IELTS Course Creator",
    department: "Content",
    location: "Remote",
    type: "Contract",
    description:
      "Create comprehensive IELTS preparation materials and practice tests for our student portal.",
  },
];

// Why Join Us Data
const benefits = [
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Innovation Driven",
    description:
      "Work with cutting-edge tools to shape the future of education.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaborative Culture",
    description: "A supportive environment where every voice matters.",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Health & Wellness",
    description: "Comprehensive health insurance and wellness allowances.",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Flexible Hours",
    description:
      "Work-life balance with flexible schedules and remote options.",
  },
];

export default function CareerContent() {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Hero Section - Contains the MAIN H1 TAG */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Team collaboration at Chalak Champs office"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          {/* SEO H1 TAG: Only one H1 on the page */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join Our Team at Chalak Champs
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            We are on a mission to make language learning accessible and fun.
            Join us in empowering students across Bangladesh and beyond.
          </p>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* H2 for Section Title */}
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: colors.foreground }}
            >
              Why Build Your Career With Us?
            </h2>
            <p
              className="max-w-2xl mx-auto"
              style={{ color: colors.foreground, opacity: 0.8 }}
            >
              We believe in nurturing talent and providing an environment where
              you can thrive professionally and personally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border text-center transition-transform hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: colors.primary + "15",
                    color: colors.primary,
                  }}
                >
                  {benefit.icon}
                </div>
                {/* H3 for Subsection Titles */}
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: colors.foreground }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: colors.foreground, opacity: 0.7 }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              {/* H2 for Section Title */}
              <h2
                className="text-3xl font-bold"
                style={{ color: colors.foreground }}
              >
                Current Openings
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: colors.foreground, opacity: 0.7 }}
              >
                Find your perfect role
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50"
                style={{ color: colors.foreground }}
              />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-1"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
              />
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center transition-shadow hover:shadow-md"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                >
                  <div className="mb-4 md:mb-0">
                    {/* H3 for Job Titles */}
                    <h3
                      className="text-xl font-semibold mb-1"
                      style={{ color: colors.foreground }}
                    >
                      {job.title}
                    </h3>
                    <p
                      className="text-sm mb-2"
                      style={{ color: colors.foreground, opacity: 0.7 }}
                    >
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: colors.primary + "15",
                          color: colors.primary,
                        }}
                      >
                        <Briefcase className="h-3 w-3" /> {job.department}
                      </span>
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.foreground,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <MapPin className="h-3 w-3" /> {job.location}
                      </span>
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.foreground,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <Clock className="h-3 w-3" /> {job.type}
                      </span>
                    </div>
                  </div>

                  {/* FIX: Changed /careers/ to /career/ to match your folder structure */}
                  <Link
                    href={`/career/${job.id}`}
                    className="flex items-center font-medium text-sm px-5 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: colors.primary,
                      color: "white",
                    }}
                  >
                    View Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))
            ) : (
              <div
                className="text-center py-12"
                style={{ color: colors.foreground }}
              >
                <p className="text-lg">No jobs found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4">
        <div
          className="max-w-4xl mx-auto text-center p-10 rounded-2xl border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          {/* H2 for CTA Title */}
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: colors.foreground }}
          >
            Don&apos;t See the Right Role?
          </h2>
          <p
            className="mb-6"
            style={{ color: colors.foreground, opacity: 0.8 }}
          >
            We are always looking for talented individuals. Send your resume and
            portfolio to our talent pool, and we will contact you when a
            suitable position opens up.
          </p>
          <a
            href="mailto:careers@chalakchamps.com"
            className="inline-flex items-center px-6 py-3 rounded-lg font-medium border transition-colors"
            style={{
              color: colors.primary,
              borderColor: colors.primary,
            }}
          >
            Send Your CV
          </a>
        </div>
      </section>
    </div>
  );
}
