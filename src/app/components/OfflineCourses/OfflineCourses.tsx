import Button from "@/app/ui/button/Button";
import Image from "next/image";
import React from "react";

const OfflineCourses = () => {
  return (
    <div className="relative overflow-hidden bg-linear-to-b mx-auto from-[#FF8FCA] to-[#010D3E]/11 container rounded-4xl p-0.5">
      <div className="absolute  -rotate-15 z-0 h-110 w-236 bg-[#ff268459] rounded-4xl top-80 -left-160 blur-[135.45px]"></div>
      <div className="bg-white pb-8 rounded-[30px] font-semibold leading-10">
        <div className="px-4">
          <h3 className="text-2xl md:text-5xl font-semibold text-center pt-6">
            <span className="text-[#00477C]">অফলাইনে শেখা,</span>{" "}
            <span className="text-[#F3066E]">আরও</span>{" "}
            <span className="relative inline-block px-2 py-3 md:px-3 md:py-4 group">
              <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
              <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
              <span className="bg-linear-to-r from-primary via-primary to-[#FC7CB4]-95 bg-clip-text text-transparent">
                {" "}
                ইন্টারঅ্যাকটিভভাবে!
              </span>
            </span>
          </h3>
        </div>

        <div className="z-10 px-4">
          <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:mt-12 gap-8 md:gap-12">
            {/* First Card */}
            <div className="w-full max-w-[290px]">
              <div className="bg-linear-to-br rounded-3xl from-[#FF8FCA] to-[#D9D9D9] p-1 overflow-hidden">
                <Image
                  src={"/groupchair.webp"}
                  width={290}
                  height={281}
                  alt="group chair image"
                  className="rounded-2xl w-full h-auto"
                />
              </div>
              <h4 className="text-[#F3066E] leading-7 tracking-normal text-lg md:text-xl mt-6 mb-3 text-center md:text-left">
                দেশসেরা টিচারদের প্যানেল
              </h4>
              <p className="leading-5 md:leading-4 font-normal text-sm text-[#000000]/70 text-center md:text-left">
                অনলাইন এবং অফলাইন উভয় ক্ষেত্রে বিশেষজ্ঞ শিক্ষক প্যানেল, যারা
                আপনার ইংরেজি ভীতি কাটিয়ে উঠতে মেন্টর হিসেবে কাজ করবেন।
              </p>
            </div>
            {/* second Card */}
            <div className="w-full max-w-[290px]">
              <div className="bg-linear-to-br rounded-3xl from-[#FF8FCA] to-[#D9D9D9] p-1 overflow-hidden">
                <Image
                  src={"/groupchair.webp"}
                  width={290}
                  height={281}
                  alt="group chair image"
                  className="rounded-2xl w-full h-auto"
                />
              </div>
              <h4 className="text-[#F3066E] leading-7 tracking-normal text-lg md:text-xl mt-6 mb-3 text-center md:text-left">
                দেশসেরা টিচারদের প্যানেল
              </h4>
              <p className="leading-5 md:leading-4 font-normal text-sm text-[#000000]/70 text-center md:text-left">
                অনলাইন এবং অফলাইন উভয় ক্ষেত্রে বিশেষজ্ঞ শিক্ষক প্যানেল, যারা
                আপনার ইংরেজি ভীতি কাটিয়ে উঠতে মেন্টর হিসেবে কাজ করবেন।
              </p>
            </div>
            {/* Third Card */}
            <div className="w-full max-w-[290px]">
              <div className="bg-linear-to-br rounded-3xl from-[#FF8FCA] to-[#D9D9D9] p-1 overflow-hidden">
                <Image
                  src={"/groupchair.webp"}
                  width={290}
                  height={281}
                  alt="group chair image"
                  className="rounded-2xl w-full h-auto"
                />
              </div>
              <h4 className="text-[#F3066E] leading-7 tracking-normal text-lg md:text-xl mt-6 mb-3 text-center md:text-left">
                দেশসেরা টিচারদের প্যানেল
              </h4>
              <p className="leading-5 md:leading-4 font-normal text-sm text-[#000000]/70 text-center md:text-left">
                অনলাইন এবং অফলাইন উভয় ক্ষেত্রে বিশেষজ্ঞ শিক্ষক প্যানেল, যারা
                আপনার ইংরেজি ভীতি কাটিয়ে উঠতে মেন্টর হিসেবে কাজ করবেন।
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-8 mb-12 md:mb-20">
            <Button className="px-5 py-2">ফ্রি ক্লাস বুক করুন</Button>
          </div>
        </div>

        <div className="px-4 md:px-6">
          <div>
            <h4 className="text-2xl md:text-3xl text-center font-semibold leading-15 tracking-[-5%] text-[#00477C]">
              আপনার সন্তানকে গড়ে তুলতে{" "}
              <span className="bg-linear-to-r from-[#F3066D]/52 to-[#FC7CB4]/84 bg-clip-text text-transparent">
                কেন
              </span>{" "}
              <br className="hidden md:block" />
              <span className="relative inline-block px-2 py-0.5 md:px-3 group">
                <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
                <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
                <span className="bg-linear-to-r from-primary to-[#FC7CB4] bg-clip-text text-transparent">
                  {" "}
                  আমরাই সেরা
                </span>
              </span>
            </h4>
          </div>
          <div className="mt-8  md:mt-12 border-2 border-[#F3066E33] rounded-4xl shadow-[0px_25px_50px_-12px_rgba(255,143,202,0.35)]">
            <div className="flex flex-col md:flex-row gap-1 justify-between p-4 md:p-8">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                {/* first card */}
                <div className="flex gap-3.5 p-3.5">
                  <div className="p-2 bg-radial from-[#FFFFFF]/60 to-[#FF8FCA]/25 rounded-lg shrink-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M29.3337 13.3333V21.3333M29.3337 13.3333L16.0003 6.66667L2.66699 13.3333L16.0003 20L29.3337 13.3333Z"
                        stroke="#2D2D2D"
                        strokeWidth="2.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 16V22.6667C8 25.3333 10.6667 26.6667 16 26.6667C21.3333 26.6667 24 25.3333 24 22.6667V16"
                        stroke="#2D2D2D"
                        strokeWidth="2.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-[#2D2D2D] leading-5 text-sm">
                    আমাদের প্রতিটি কোর্স{" "}
                    <span className="text-[#001D3A] font-semibold">
                      আন্তর্জাতিক মানসম্পন্ন ও বৈজ্ঞানিকভাবে প্রমাণিত শিক্ষণ
                    </span>{" "}
                    পদ্ধতি এবং শিশুদের বয়স অনুযায়ী উপযোগী শেখার কৌশল অনুসরণ
                    করে পরিকল্পিতভাবে তৈরি করা হয়েছে।
                  </p>
                </div>
                {/* second Card */}
                <div className="flex gap-3.5 p-3.5">
                  <div className="p-2 bg-radial from-[#FFFFFF]/60 to-[#FF8FCA]/25 rounded-lg shrink-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_627_2931)">
                        <path
                          d="M22.6663 28V25.3333C22.6663 23.9188 22.1044 22.5623 21.1042 21.5621C20.1041 20.5619 18.7475 20 17.333 20H6.66634C5.25185 20 3.8953 20.5619 2.89511 21.5621C1.89491 22.5623 1.33301 23.9188 1.33301 25.3333V28"
                          stroke="#2D2D2D"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.0003 14.6667C14.9458 14.6667 17.3337 12.2789 17.3337 9.33333C17.3337 6.38781 14.9458 4 12.0003 4C9.05481 4 6.66699 6.38781 6.66699 9.33333C6.66699 12.2789 9.05481 14.6667 12.0003 14.6667Z"
                          stroke="#2D2D2D"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M30.667 28V25.3333C30.6661 24.1516 30.2728 23.0037 29.5488 22.0698C28.8248 21.1358 27.8112 20.4688 26.667 20.1733"
                          stroke="#2D2D2D"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21.333 4.17334C22.4802 4.46707 23.4971 5.13427 24.2232 6.06975C24.9493 7.00523 25.3435 8.15578 25.3435 9.34001C25.3435 10.5242 24.9493 11.6748 24.2232 12.6103C23.4971 13.5457 22.4802 14.2129 21.333 14.5067"
                          stroke="#2D2D2D"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_627_2931">
                          <rect width="32" height="32" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-[#2D2D2D] leading-5 text-sm">
                    সমগ্র বিশ্বজুড়ে সমাদৃত এবং পরীক্ষিত সবচেয়ে ইফেক্টিভ শেখার
                    পদ্ধতি হচ্ছে{" "}
                    <span className="font-semibold text-[#1B386B]">
                      Learning by doing
                    </span>{" "}
                    - আমরা শুধু বইভিত্তিক জ্ঞানে সীমাবদ্ধ না রেখে বাচ্চাকে
                    প্রয়োগিক শিক্ষায় উদ্বুদ্ধ করি
                  </p>
                </div>
                {/* Third and big card */}
                <div className="flex flex-col gap-3.5 p-3.5 border border-[#00477C]/20 shadow-[0px_4px_20px_-5px_rgba(59,130,246,0.15)] rounded-xl">
                  <div className="flex gap-3.5">
                    <div className="shrink-0">
                      <div className="p-2 bg-radial from-[#FFFFFF]/60 to-[#FF8FCA]/25 rounded-lg">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 12L16 2.66666L28 12V26.6667C28 27.3739 27.719 28.0522 27.219 28.5523C26.7189 29.0524 26.0406 29.3333 25.3333 29.3333H6.66667C5.95942 29.3333 5.28115 29.0524 4.78105 28.5523C4.28095 28.0522 4 27.3739 4 26.6667V12Z"
                            stroke="#2D2D2D"
                            strokeWidth="2.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 29.3333V16H20V29.3333"
                            stroke="#2D2D2D"
                            strokeWidth="2.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[#2D2D2D] leading-5 text-sm">
                      সন্তানের অগ্রগতি গভীর থেকে বিস্তারিতভাবে বুঝতে পারা একজন
                      অভিভাবকের জন্য খুবই জরুরি। যাতে সঠিক সময়ে সঠিক সিদ্ধান্ত
                      নিতে পারে।
                    </p>
                  </div>
                  <p className="text-[#2D2D2D] leading-5 text-sm">
                    আমরা Provide করি{" "}
                    <span className="text-[#1B386B] font-semibold">
                      1-1 Guardian Counselling
                    </span>{" "}
                    সেশন, যার বাচ্চার সার্বিক উন্নতি, দুর্বলতা এবং শক্তিশালী
                    দিকগুলো সম্পর্কে অভিভাবককে বুঝতে সাহায্য করে।
                  </p>
                </div>

                {/* fourth card */}
                <div className="flex gap-3.5 p-3.5">
                  <div className="shrink-0">
                    <div className="p-2 bg-radial from-[#FFFFFF]/60 to-[#FF8FCA]/25 rounded-lg">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.0003 2.66666L2.66699 9.33332L16.0003 16L29.3337 9.33332L16.0003 2.66666Z"
                          stroke="#2D2D2D"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.66699 22.6667L16.0003 29.3333L29.3337 22.6667"
                          stroke="#2D2D2D"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.66699 16L16.0003 22.6667L29.3337 16"
                          stroke="#2D2D2D"
                          strokeWidth="2.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="">
                    <h5 className="text-[#C6005F] font-semibold text-base md:text-lg leading-6 tracking-normal">
                      &ldquo;আমাদের অভিজ্ঞ মেন্টর বানায় আগামীর
                      চ্যাম্প&ldquo;{" "}
                    </h5>
                    <p className="text-[#2D2D2D] leading-5 text-sm mt-4">
                      আমাদের অভিজ্ঞ শিক্ষকরা শুধু পড়ান না, তারা প্রতিটি শিশুর
                      সুপ্ত মেধাকে দক্ষতায় রূপান্তর করেন।সঠিক দিকনির্দেশনা আর
                      নিবিড় পরিচর্যায় আপনার সন্তান শিখবে জীবনের প্রতিটি ধাপে
                      এগিয়ে থাকার কৌশল
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-linear-to-b from-[#F3066E]/20 to-[#FFFFFF] w-full md:w-[35rem] rounded-4xl p-px shadow-[0px_4px_24px_-5px_rgba(243,6,110,0.3)] overflow-hidden mt-8 md:mt-0 mx-auto">
                <Image
                  src={"/kidsbook.jpg"}
                  width={600}
                  height={600}
                  alt="book with child"
                  className="w-full h-full rounded-[31px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineCourses;
