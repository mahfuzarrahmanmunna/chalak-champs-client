"use client";
import Banner from "./components/Banner/Banner";
import ChalakCourses from "./components/ChalakCourses/ChalakCourses";
import ChalakLibrary from "./components/ChalakLibrary/ChalakLibrary";
import EmailSignup from "./components/EmailSignup/EmailSignup";
import FAQ from "./components/FAQ/FAQ";
import FeatureCourses from "./components/FeatureCourses/FeatureCourses";
import FreebookingForm from "./components/FreebookingForm/FreebookingForm";
import GallerySlider from "./components/GallerySlider/GallerySlider";
import HeroBanner from "./components/Hero/Hero";
import ImageSlider from "./components/ImageSlider/ImageSlider";
import OfflineCourses from "./components/OfflineCourses/OfflineCourses";
import PopularCourse from "./components/PopularCourse/PopularCourse";
import TestimonialSlider from "./components/TestimonialSlider/TestimonialSlider";

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
      }}
      className="overflow-hidden space-y-20 tracking-normal px-2 leading-5"
    >
      {/* <HeroBanner /> */}
      <Banner />
      <FeatureCourses />
      {/* <FreebookingForm/> */}
      <PopularCourse />
      <ChalakCourses/>
      <ChalakLibrary/>
      <OfflineCourses/>
      <ImageSlider/>
      <GallerySlider/>
      <TestimonialSlider/>
      {/* <FAQ /> */}
      {/* <EmailSignup /> */}
    </div>
  );
}
