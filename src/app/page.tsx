"use client";
import Banner from "./components/Banner/Banner";
import ChalakCourses from "./components/ChalakCourses/ChalakCourses";
import ChalakLibrary from "./components/ChalakLibrary/ChalakLibrary";
import CTA from "./components/CTA/CTA";
// import EmailSignup from "./components/EmailSignup/EmailSignup";
// import FAQ from "./components/FAQ/FAQ";
import FeatureCourses from "./components/FeatureCourses/FeatureCourses";
// import FreebookingForm from "./components/FreebookingForm/FreebookingForm";
import GallerySlider from "./components/GallerySlider/GallerySlider";
// import HeroBanner from "./components/Hero/Hero";
import ImageSlider from "./components/ImageSlider/ImageSlider";
import FirstLogo from "./components/LittleChamps/FirstLogo";
import LittleChamps from "./components/LittleChamps/LittleChamps";
import OfflineCourses from "./components/OfflineCourses/OfflineCourses";
import PopularCourse from "./components/PopularCourse/PopularCourse";
import TestimonialSlider from "./components/TestimonialSlider/TestimonialSlider";

export default function Home() {
  return (
    <div
      className="overflow-hidden bg-white space-y-20 tracking-normal px-2 leading-5 min-h-[calc(100vh-500px)]"
    >
      {/* <HeroBanner /> */}
      <Banner />
      <FeatureCourses />
      {/* <FreebookingForm/> */}
      <PopularCourse />
      <ChalakCourses />
      <ChalakLibrary />
      <LittleChamps/>
      <OfflineCourses />
      {/* <FirstLogo/> */}
      <ImageSlider />
      <GallerySlider />
      <TestimonialSlider />
      <CTA />
      {/* <FAQ /> */}
      {/* <EmailSignup /> */}
    </div>
  );
}
