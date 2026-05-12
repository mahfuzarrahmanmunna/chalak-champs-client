"use client";

import Banner from "../components/Banner/Banner";
import ChalakCourses from "../components/ChalakCourses/ChalakCourses";
import ChalakLibrary from "../components/ChalakLibrary/ChalakLibrary";
import CTA from "../components/CTA/CTA";
import FeatureCourses from "../components/FeatureCourses/FeatureCourses";
import GallerySlider from "../components/GallerySlider/GallerySlider";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import LittleChamps from "../components/LittleChamps/LittleChamps";
import OfflineCourses from "../components/OfflineCourses/OfflineCourses";
import PopularCourse from "../components/PopularCourse/PopularCourse";
import TestimonialSlider from "../components/TestimonialSlider/TestimonialSlider";
import { useLanguage } from "@/app/context/LanguageContext";
import VideoTestomonial from "../components/VideoTestomonial/VideoTestomonial";

export default function HomeContent() {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden bg-white space-y-25 tracking-normal px-2 leading-5 min-h-[calc(100vh-500px)]">
      <Banner />
      <FeatureCourses />
      <PopularCourse />
      <ChalakCourses />
      <ChalakLibrary />
      <LittleChamps />
      <OfflineCourses />
      <ImageSlider />
      <GallerySlider />
      <VideoTestomonial/>
      <TestimonialSlider />
      <CTA />
    </div>
  );
}
