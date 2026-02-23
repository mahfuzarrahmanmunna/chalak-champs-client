// src/app/about-us/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  BookOpen,
  Globe,
  CheckCircle,
} from "lucide-react";

// SEO Metadata for the About Us page
export const metadata = {
  title: "About Us - Chalak Champs | Empowering English Learners Worldwide",
  description:
    "Discover the story behind Chalak Champs. We are dedicated to providing high-quality English language education to students across the globe. Learn about our mission, vision, and expert team.",
  keywords:
    "about Chalak Champs, English learning platform, online English courses, our mission, education team, language school",
  openGraph: {
    title: "About Us - Chalak Champs",
    description:
      "Discover the story behind Chalak Champs. Dedicated to providing high-quality English language education.",
    url: "https://yourdomain.com/about-us",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Team Chalak Champs",
      },
    ],
  },
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div
    className="p-6 rounded-xl border transition-all duration-300 hover:shadow-lg"
    style={{
      backgroundColor: "var(--color-card)",
      borderColor: "var(--color-border)",
    }}
  >
    <div
      className="w-12 h-12 flex items-center justify-center rounded-lg mb-4"
      style={{ backgroundColor: "var(--color-primary)", color: "white" }}
    >
      {icon}
    </div>
    <h3
      className="text-xl font-semibold mb-2"
      style={{ color: "var(--color-foreground)" }}
    >
      {title}
    </h3>
    <p style={{ color: "var(--color-foreground)", opacity: 0.8 }}>
      {description}
    </p>
  </div>
);

// Team Member Card Component
interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

const TeamMember = ({ name, role, image }: TeamMemberProps) => (
  <div className="text-center">
    <div
      className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4"
      style={{ borderColor: "var(--color-border)" }}
    >
      <Image src={image} alt={name} fill className="object-cover" />
    </div>
    <h4
      className="text-lg font-semibold"
      style={{ color: "var(--color-foreground)" }}
    >
      {name}
    </h4>
    <p className="text-sm" style={{ color: "var(--color-secondary)" }}>
      {role}
    </p>
  </div>
);

export default function AboutUsPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(243,6,110)] to-[rgb(33,65,135)] opacity-90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          {/* Unique H1 Tag for SEO */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Empowering Your Voice, <br /> One Word at a Time
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Welcome to Chalak Champs. We believe that language is the bridge to
            opportunity. Our mission is to make high-quality English education
            accessible, engaging, and effective for everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: "var(--color-foreground)" }}
              >
                Our Story
              </h2>
              <p
                className="mb-4 text-lg leading-relaxed"
                style={{ color: "var(--color-foreground)", opacity: 0.85 }}
              >
                Founded in 2020, Chalak Champs started with a simple idea: to
                break down language barriers. We noticed that traditional
                education often left students unprepared for real-world
                communication.
              </p>
              <p
                className="mb-6 text-lg leading-relaxed"
                style={{ color: "var(--color-foreground)", opacity: 0.85 }}
              >
                Today, we are a community of over 50,000 learners from 40+
                countries. We combine cutting-edge technology with pedagogical
                expertise to create a learning experience that is both flexible
                and deeply personal.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    className="h-6 w-6 flex-shrink-0"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <div>
                    <h3
                      className="font-semibold text-lg"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      Student-Centric Approach
                    </h3>
                    <p
                      style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                    >
                      Curriculum designed around your goals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle
                    className="h-6 w-6 flex-shrink-0"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <div>
                    <h3
                      className="font-semibold text-lg"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      Global Standards
                    </h3>
                    <p
                      style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                    >
                      Aligned with CEFR and IELTS standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students learning English"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--color-foreground)" }}
            >
              Why Choose Chalak Champs?
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--color-foreground)", opacity: 0.7 }}
            >
              We are more than just a course provider; we are your partners in
              success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Our Mission"
              description="To democratize English education and empower individuals to achieve their personal and professional dreams."
            />
            <FeatureCard
              icon={<Eye className="h-6 w-6" />}
              title="Our Vision"
              description="A world where language is no longer a barrier to connection, opportunity, or understanding."
            />
            <FeatureCard
              icon={<Heart className="h-6 w-6" />}
              title="Passion for Teaching"
              description="Our instructors are not just teachers; they are mentors dedicated to your growth."
            />
            <FeatureCard
              icon={<Award className="h-6 w-6" />}
              title="Excellence"
              description="We maintain the highest standards in course content, video production, and student support."
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className="p-8 md:p-12 rounded-2xl text-white text-center"
            style={{
              background:
                "linear-gradient(135deg, rgb(243,6,110), rgb(33,65,135))",
            }}
          >
            <h2 className="text-3xl font-bold mb-10">Our Impact in Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 opacity-80" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-1">50K+</h3>
                <p className="text-sm opacity-80">Active Students</p>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <BookOpen className="h-8 w-8 opacity-80" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-1">120+</h3>
                <p className="text-sm opacity-80">Video Courses</p>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Globe className="h-8 w-8 opacity-80" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-1">45+</h3>
                <p className="text-sm opacity-80">Countries Reached</p>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Award className="h-8 w-8 opacity-80" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-1">98%</h3>
                <p className="text-sm opacity-80">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            Meet Our Experts
          </h2>
          <p
            className="mb-12 max-w-xl mx-auto"
            style={{ color: "var(--color-foreground)", opacity: 0.7 }}
          >
            Our team consists of certified educators and industry professionals.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <TeamMember
              name="Sarah Johnson"
              role="Lead Instructor - Grammar"
              image="https://randomuser.me/api/portraits/women/32.jpg"
            />
            <TeamMember
              name="Michael Chen"
              role="Business English Coach"
              image="https://randomuser.me/api/portraits/men/45.jpg"
            />
            <TeamMember
              name="Emily Watson"
              role="IELTS Specialist"
              image="https://randomuser.me/api/portraits/women/67.jpg"
            />
            <TeamMember
              name="David Brown"
              role="Pronunciation Expert"
              image="https://randomuser.me/api/portraits/men/22.jpg"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-16 px-4 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            Ready to Start Your Journey?
          </h2>
          <p
            className="mb-8"
            style={{ color: "var(--color-foreground)", opacity: 0.8 }}
          >
            Join thousands of students who have transformed their English skills
            with Chalak Champs.
          </p>
          <Link
            href="/all-courses"
            className="inline-block px-8 py-4 rounded-lg font-semibold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Explore Our Courses
          </Link>
        </div>
      </section>
    </div>
  );
}
