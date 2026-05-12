"use client";

import Button from "@/app/ui/button/Button";
import Image from "next/image";
import React from "react";
import { useLanguage } from "@/app/context/LanguageContext"; // Adjust path

const NeedCall = () => {
  // 1. Get data from context
  const { ctaData } = useLanguage();

  // 2. Safety check
  if (!ctaData) return null;

  return (
    <div className="z-10">
      {/* --- Need Help Card --- */}
      <div className="bg-linear-to-r mb-5 from-[#FFFFFF] to-[#C7EAFF] rounded-[30px]">
        <div className="flex justify-between">
          <div className="pl-5 md:py-1.5">
            <div className="md:py-2 pt-5">
              <h4 className="text-[#F3066E] text-3xl font-semibold leading-7 tracking-normal mt-1.5">
                {ctaData.needHelp.title} <br className="hidden md:block" />
                {/* Note: The space inside the string handled by HTML logic in original, keeping it intact */}
              </h4>
              <p className="text-[#2D2D2D] text-sm leading-3.5 mt-2">
                {ctaData.needHelp.desc}
              </p>
              <div className="flex">
                <div className="flex flex-col">
                  {/* CTA Button inside card */}
                  <a href="tel:01740176774" className="bg-primary text-xs px-1.25 py-1 md:text-xl font-medium flex items-center md:px-6 md:py-3.5 rounded mt-4 md:rounded-xl md:mt-8">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.3706 14.6C17.8244 14.1419 14.6206 12.1131 14.0881 12.2063C13.8381 12.2506 13.6469 12.4638 13.135 13.0744C12.8983 13.3749 12.6383 13.6564 12.3575 13.9163C11.843 13.792 11.345 13.6074 10.8738 13.3663C9.0258 12.4666 7.53289 10.9732 6.63375 9.125C6.39265 8.65379 6.20804 8.15576 6.08375 7.64125C6.34358 7.36044 6.62507 7.10047 6.92563 6.86375C7.53562 6.35188 7.74938 6.16187 7.79375 5.91062C7.88688 5.37687 5.85625 2.17437 5.4 1.62813C5.20875 1.40188 5.035 1.25 4.8125 1.25C4.1675 1.25 1.25 4.8575 1.25 5.325C1.25 5.36313 1.3125 9.11875 6.05562 13.9444C10.8813 18.6875 14.6369 18.75 14.675 18.75C15.1425 18.75 18.75 15.8325 18.75 15.1875C18.75 14.965 18.5981 14.7913 18.3706 14.6Z"
                        fill="white"
                      />
                      <path
                        d="M14.375 9.375H15.625C15.6235 8.04937 15.0962 6.77847 14.1589 5.84111C13.2215 4.90375 11.9506 4.37649 10.625 4.375V5.625C11.6193 5.62599 12.5725 6.0214 13.2756 6.72445C13.9786 7.42749 14.374 8.38074 14.375 9.375Z"
                        fill="white"
                      />
                      <path
                        d="M17.5 9.375H18.75C18.7475 7.22088 17.8907 5.15569 16.3675 3.6325C14.8443 2.1093 12.7791 1.25248 10.625 1.25V2.5C12.4477 2.50215 14.1951 3.22717 15.484 4.51602C16.7728 5.80486 17.4978 7.5523 17.5 9.375Z"
                        fill="white"
                      />
                    </svg>
                    {ctaData.needHelp.cta}
                  </a>
                  <div>
                    <p className="text-[#2D2D2D]/50 leading-4 mt-2 text-sm">
                      {ctaData.needHelp.subCta}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bottom-0 md:hidden flex">
                  <Image
                    src={"/girls.png"}
                    width={240}
                    height={225}
                    alt="girls image"
                    className="rounded-xl "
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl relative bottom-0 hidden md:flex">
            <Image
              src={"/Call.png"}
              width={320}
              height={225}
              alt="girls image"
              className="rounded-xl "
            />
          </div>
        </div>
      </div>

      {/* --- Bottom Section (Video + Facebook) --- */}
      <div className="md:flex gap-5 z-10 md:mt-9 space-y-6 md:space-y-0">
        {/* Video Library Card */}
        <div className="bg-linear-to-r p-3 pb-5 md:w-[45%] from-[#FFD0CD] to-[#FFC9C9] md:px-5 pt-5 rounded-2xl">
          <div className="flex z-10">
            <div>
              <h4 className="text-secondary font-semibold text-lg leading-8">
                {ctaData.videoLibrary.title}
              </h4>
              <div className="mt-5.5">
                <a href="https://www.youtube.com/@chalakchamps" target="_blank">
                  <Button textSize="sm" px="px-6">
                    {ctaData.videoLibrary.cta}
                  </Button>
                </a>
              </div>
            </div>
            <div>
              <Image
                src={"/rington.png"}
                width={20}
                height={20}
                alt="ring ton icon"
              />
            </div>
            <div>
              <Image
                src={"/youtubeicon.png"}
                width={86}
                height={75}
                alt="youtube icon"
              />
            </div>
          </div>
        </div>

        {/* Facebook Card */}
        <div className="md:w-[55%] z-10 bg-linear-to-r from-[#C8E4FF] to-[#C9DBFF] rounded-3xl p-5">
          <div className="flex z-10">
            <div>
              <div className="flex gap-3 items-center">
                <h5 className="text-lg font-semibold leading-8 text-[#232C6A]">
                  {ctaData.facebook.title}
                </h5>
                <svg
                  width="21"
                  height="25"
                  viewBox="0 0 21 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_627_3148)">
                    <path
                      d="M12.4935 10.0251L8.33638 12.4253C8.11973 12.5503 7.84622 12.515 7.66845 12.339C7.49068 12.1631 7.45263 11.8899 7.57547 11.672C8.76881 9.55603 8.98883 7.76439 8.24806 6.19476C7.99118 5.6499 8.21447 4.96731 8.74407 4.67072C9.28536 4.36963 9.91196 4.29451 10.5088 4.4591C11.1061 4.62388 11.6059 5.01019 11.916 5.54687C11.916 5.54681 11.916 5.54693 11.916 5.54687L12.0094 5.70854C12.7664 7.01981 12.8607 8.08013 12.77 9.57801C12.7587 9.76411 12.6549 9.93201 12.4935 10.0251Z"
                      fill="#F4F4F4"
                    />
                    <path
                      d="M17.9032 7.62818C17.4238 6.79779 16.3582 6.51223 15.5278 6.99167L7.78197 11.4637C7.69591 11.5134 7.62474 11.5853 7.576 11.6719C7.21788 12.3073 6.82167 12.8889 6.50335 13.3563C6.3923 13.5193 6.28743 13.6733 6.1934 13.8157C6.07759 13.9911 6.07081 14.2169 6.17593 14.399L9.72783 20.551C9.83295 20.7331 10.0319 20.8401 10.2417 20.8276C12.7443 20.6772 14.4264 19.8626 16.3089 18.7757C16.6004 18.6074 16.897 18.4324 17.2019 18.2526C17.5391 18.0536 17.8877 17.8479 18.2553 17.6357L19.7747 16.7584C20.6051 16.279 20.8907 15.2134 20.4112 14.383C20.25 14.1038 20.0226 13.8862 19.7601 13.7385C20.0398 13.2238 20.0537 12.5797 19.7399 12.0363C19.5787 11.7571 19.3513 11.5395 19.0888 11.3918C19.3685 10.8771 19.3824 10.233 19.0686 9.68956C18.8431 9.29899 18.488 9.02896 18.0886 8.90239C18.193 8.4677 18.1277 8.01698 17.9032 7.62818Z"
                      fill="white"
                    />
                    <path
                      d="M14.4829 4.01397L13.4576 4.60596C13.1922 4.7592 12.8527 4.66824 12.6995 4.40282C12.5462 4.1374 12.6372 3.79794 12.9026 3.6447L13.928 3.05271C14.1934 2.89947 14.5328 2.99043 14.6861 3.25585C14.8393 3.52127 14.7484 3.86071 14.4829 4.01397Z"
                      fill="#29CCB1"
                    />
                    <path
                      d="M7.30517 8.15825L6.27982 8.75023C6.0144 8.90348 5.67494 8.81252 5.5217 8.5471C5.36846 8.28168 5.45942 7.94222 5.72484 7.78898L6.75019 7.19699C7.01561 7.04375 7.35507 7.13471 7.50831 7.40013C7.66155 7.66555 7.57066 8.00497 7.30517 8.15825Z"
                      fill="#29CCB1"
                    />
                    <path
                      d="M7.30565 4.606C7.1395 4.70192 6.92823 4.70898 6.7502 4.60618L5.72485 4.01419C5.45941 3.86096 5.36846 3.5215 5.5217 3.2561C5.67493 2.99066 6.01439 2.89971 6.27979 3.05295L7.30515 3.64494C7.57058 3.79817 7.66154 4.13763 7.50829 4.40303C7.45786 4.49044 7.38717 4.55893 7.30565 4.606Z"
                      fill="#29CCB1"
                    />
                    <path
                      d="M10.3819 2.83074C10.3003 2.87782 10.2057 2.90478 10.1048 2.90475C9.79828 2.90473 9.5498 2.65626 9.54982 2.34977L9.5498 1.16579C9.54979 0.859323 9.79826 0.610757 10.1048 0.61084C10.4113 0.610858 10.6598 0.859328 10.6598 1.16582V2.3498C10.6598 2.55533 10.548 2.73483 10.3819 2.83074Z"
                      fill="#29CCB1"
                    />
                    <path
                      d="M8.04149 20.1652L9.50296 22.6965L8.54365 23.2505L7.08219 20.7202C6.92902 20.4549 7.01808 20.1152 7.28337 19.9621C7.54867 19.8089 7.88833 19.8999 8.04149 20.1652Z"
                      fill="#73C3FF"
                    />
                    <path
                      d="M14.4829 4.01397L13.4576 4.60596C13.1922 4.7592 12.8527 4.66824 12.6995 4.40282C12.5462 4.1374 12.6372 3.79794 12.9026 3.6447L13.928 3.05271C14.1934 2.89947 14.5328 2.99043 14.6861 3.25585C14.8393 3.52127 14.7484 3.86071 14.4829 4.01397Z"
                      fill="#6981BD"
                    />
                    <path
                      d="M7.30517 8.15825L6.27982 8.75023C6.0144 8.90348 5.67494 8.81252 5.5217 8.5471C5.36846 8.28168 5.45942 7.94222 5.72484 7.78898L6.75019 7.19699C7.01561 7.04375 7.35507 7.13471 7.50831 7.40013C7.66155 7.66555 7.57066 8.00497 7.30517 8.15825Z"
                      fill="#6981BD"
                    />
                    <path
                      d="M7.30565 4.606C7.1395 4.70192 6.92823 4.70898 6.7502 4.60618L5.72485 4.01419C5.45941 3.86096 5.36846 3.5215 5.5217 3.2561C5.67493 2.99066 6.01439 2.89971 6.27979 3.05295L7.30515 3.64494C7.57058 3.79817 7.66154 4.13763 7.50829 4.40303C7.45786 4.49044 7.38717 4.55893 7.30565 4.606Z"
                      fill="#6981BD"
                    />
                    <path
                      d="M10.3819 2.83074C10.3003 2.87782 10.2057 2.90478 10.1048 2.90475C9.79828 2.90473 9.5498 2.65626 9.54982 2.34977L9.5498 1.16579C9.54979 0.859323 9.79826 0.610757 10.1048 0.61084C10.4113 0.610858 10.6598 0.859328 10.6598 1.16582V2.3498C10.6598 2.55533 10.548 2.73483 10.3819 2.83074Z"
                      fill="#6981BD"
                    />
                    <path
                      d="M8.04345 20.1642L9.50193 22.6964L8.54367 23.2513L7.08219 20.7202C6.92902 20.4549 7.02003 20.1152 7.28533 19.9621C7.55062 19.8079 7.89028 19.8999 8.04345 20.1642Z"
                      fill="#73C3FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_627_3148">
                      <rect width="21" height="25" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="mt-4">
                <a
                  href="https://www.facebook.com/chalakchampsbd"
                  target="_blank"
                >
                  <Button
                    bgColor="#F3056D"
                    highlightColor="#FF8FCA"
                    darkShadowColor="#F3066E"
                    hoverTextColor="#F3056D"
                  >
                    {ctaData.facebook.cta}
                  </Button>
                </a>
              </div>
            </div>
            <div>
              <Image
                src={"/Facebookicon.webp"}
                width={83}
                height={76}
                alt="facebook icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedCall;
