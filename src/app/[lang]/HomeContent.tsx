"use client";

import Banner from "../components/Banner/Banner";
import ChalakCourses from "../components/ChalakCourses/ChalakCourses";
import CTA from "../components/CTA/CTA";
import FeatureCourses from "../components/FeatureCourses/FeatureCourses";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import OfflineCourses from "../components/OfflineCourses/OfflineCourses";
import PopularCourse from "../components/PopularCourse/PopularCourse";
import { useLanguage } from "@/app/context/LanguageContext";
import VideoGallerySlider1 from "../components/GallerySlider/GallerySlider1";
import ChalakLibraryDynamic from "../components/ChalakLibrary/ChalakLibraryDynamic";
import BannerHero from "../components/Banner/HeroBanner";
// import HeroBanner from "../components/Hero/Hero";

export default function HomeContent() {
  // This component already knows the language from your Context!
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden bg-white space-y-20 md:space-y-25 tracking-normal px-2 leading-5 min-h-[calc(100vh-500px)]">
      {/* <Banner /> */}
      <BannerHero/>
      <FeatureCourses />8520/
      <PopularCourse />
      <ChalakCourses />
      <ChalakLibraryDynamic />
      <OfflineCourses />
      <ImageSlider />
      <VideoGallerySlider1 />
      <CTA />
    </div>
  );
}
