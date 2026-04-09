"use client";
import Banner from "./components/Banner/Banner";
import ChalakCourses from "./components/ChalakCourses/ChalakCourses";
import EmailSignup from "./components/EmailSignup/EmailSignup";
import FAQ from "./components/FAQ/FAQ";
import FeatureCourses from "./components/FeatureCourses/FeatureCourses";
import HeroBanner from "./components/Hero/Hero";
import PopularCourse from "./components/PopularCourse/PopularCourse";

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
      }}
      className="overflow-hidden space-y-20"
    >
      {/* <HeroBanner /> */}
      <Banner />
      <FeatureCourses />
      <PopularCourse />
      <ChalakCourses/>
      <FAQ />
      <EmailSignup />
    </div>
  );
}
