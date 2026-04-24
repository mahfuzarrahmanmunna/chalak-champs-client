import Image from "next/image";
import React from "react";

const LittleChamps = () => {
  return (
    <div className="max-w-292 mx-auto space-y-16 overflow-clip">
      {/* Header */}
      <div>
        <h3 className="text-2xl leading-auto md:text-5xl font-bold tracking-[-5%] text-center">
          <span className="text-[#00477C]">আমাদের</span> {' '}
          <span className="relative inline-block px-2 py-3 group">
            <span className="absolute inset-0 border-[3px] border-dashed border-pink-500"></span>
            <span className="absolute -top-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -top-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -left-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="absolute -bottom-0.75 -right-0.75 w-1.5 h-1.5 bg-pink-600"></span>
            <span className="text-primary"> Little Champs&lsquo;রা</span>
          </span>
{' '}
          <span className="bg-linear-to-r from-[#F3066D] to-[#FC7CB4] bg-clip-text text-transparent">
            পাচ্ছে
          </span>
        </h3>
      </div>

      {/* main contain cards  */}
      <div className="md:flex gap-6 space-y-6 md:space-y-0">
        {/* first column */}
        <div className="flex flex-col gap-6">
          {/* first column first card */}
          <div className="md:w-100 flex justify-center items-center h-46  gap-6 rounded-[40px] bg-[radial-gradient(circle,#001D3A,#214187)] relative overflow-hidden">
            <div className="absolute -top-3 left-0">
              <Image
                src={"/giftIcon.webp"}
                height={149}
                width={149}
                alt="gift Icon"
              />
            </div>
            <div className="text-center ">
              <h4 className="text-xl font-semibold">দেশ সেরা</h4>
              <h3 className="text-2xl font-bold">Teacher Panel</h3>
            </div>
          </div>

          {/* first column second card */}
          <div className="bg-linear-to-b md:w-100 h-97.25 from-[#00477C] to-[#FF8FCA]/30 p-1 rounded-[40px]">
            <div className="bg-[radial-gradient(circle,#DD2675,#00477C)]  w-full h-full rounded-[36px] ">
              <div className="w-full mx-auto p-5.5 relative">
                <Image
                  src={"/groupimg.png"}
                  height={229}
                  width={351}
                  alt="group Meeting"
                  className="object-cover rounded-[26px]"
                />
                <div className="absolute -bottom-8">
                  <Image
                    src={"/liveicon.webp"}
                    height={120}
                    width={120}
                    alt="live icon"
                  />
                </div>
              </div>
              <h4 className="md:text-2xl text-3xl font-semibold text-center mt-12">
                হাই কোয়ালিটি লাইভ ক্লাস
              </h4>
            </div>
          </div>
        </div>

        {/* second column */}
        <div className="flex flex-col gap-6 ">
          {/* second column first card*/}
          <div className="bg-linear-to-b from-[#F3066E] to-[#FFFFFF] md:h-75 md:w-79 rounded-[40px] p-0.5 overflow-hidden">
            <div className="flex ">
              <Image
                src={"/topic.webp"}
                width={300}
                height={300}
                alt="topic with a girl"
                className="w-full"
              />
            </div>
          </div>
          {/* second column first card*/}
          <div className="bg-[radial-gradient(circle,_#DD2675_0%,_#DD2675_30%,_#371826_100%)] md:h-67 md:w-79 rounded-[40px] p-0.5 overflow-hidden">
            <div className="flex items-center justify-center py-7">
              <Image
                src={"/books.webp"}
                width={148}
                height={148}
                alt="books image"
                className="h-37 w-37 mx-auto "
              />
            </div>
            <div className="text-center text-2xl font-semibold pb-3 md:pb-0">
              রঙ্গিন নোট এবং ওয়ার্কশিট
            </div>
          </div>
        </div>

        {/* Third card */}
        <div className="flex flex-col gap-6">
          {/* third column first card */}
          <div className="w-full md:w-100 h-82.5 bg-gradient-to-br from-[#06F32E] to-[#ffffff] rounded-[40px] p-0.5">
            <div className="flex h-full w-full overflow-hidden relative  bg-[radial-gradient(circle_at_bottom_left,_#084400_0%,_#33C745_100%)] rounded-[39px] p-2 text-white">
              <div className="absolute top-0 right-0">
                <Image
                  src={"/whatsapp.webp"}
                  width={250}
                  height={250}
                  alt="whats app icon"
                  className="h-62 w-62"
                />
              </div>
              <div className="flex items-end md:ps-8 ps-2 pb-8">
                <h1 className="text-2xl leading-7 font-semibold">
                  ২৪ ঘন্টাই শিক্ষক <br />
                  সাথে, ডাউট সলভ হবে <br />
                  <span className="text-green-300">WhatsApp</span> Secret <br />
                  Group এ
                </h1>
              </div>
            </div>
          </div>
          {/* third card second card */}
          <div className="w-full md:w-100 h-60.5 bg-gradient-to-br from-[#F36D06] to-[#ffffff] rounded-[40px] p-0.5">
            <div className="flex h-full w-full overflow-hidden relative  bg-[radial-gradient(circle,_#EDC16B_0%,_#F1AF1B_100%)] rounded-[39px] p-2 text-white">
              <div className="absolute top-0 left-0">
                <Image
                  src={"/image216.webp"}
                  width={250}
                  height={250}
                  alt="whats app icon"
                  className="h-62 w-62"
                />
              </div>
              <div className="flex text-right justify-end w-full md:pr-8 md:pb-8 pb-3 pr-3 items-end">
                <h1 className="text-2xl text-white leading-7 font-semibold">
                  অনিবার্য কারণে <br />
                  ক্লাস মিস? <br />
                  <span className="text-green-300">রেকর্ডেড</span> ক্লাসতো{" "}
                  <br />
                  আছেই
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LittleChamps;
