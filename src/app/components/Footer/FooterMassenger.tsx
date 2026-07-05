import React, { useState } from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import MessangerIcon from "./MessangerIcon";

const FooterMassenger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // এখানে container সরিয়ে w-fit ব্যবহার করা হয়েছে
    <div className="fixed bottom-25 right-6 z-50 flex flex-col items-end gap-3 w-fit">
      <div
        className={`flex flex-col gap-3 transition-all duration-500 transform ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-10 scale-0 pointer-events-none"
        }`}
      >
        {/* WhatsApp Option */}
        <a
          href="https://wa.me/8801740176774?text=Hello!%20I%20want%20to%20know%20more%20about%20Chalak%20Champs."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group/wa"
        >
          <span className="bg-white text-primary text-xs font-medium px-2 py-1 rounded shadow-md opacity-0 group-hover/wa:opacity-100 transition-opacity whitespace-nowrap">
            WhatsApp
          </span>
          <div className="bg-[#25D366] p-3 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
            <FaWhatsapp size={24} />
          </div>
        </a>

        {/* Messenger Option */}
        <a
          href="https://m.me/chalakchamps"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group/msg"
        >
          <span className="bg-white text-primary text-xs font-medium px-2 py-1 rounded shadow-md opacity-0 group-hover/msg:opacity-100 transition-opacity">
            Messenger
          </span>
          <div className="bg-[#0084FF] p-3 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
            <FaFacebookMessenger size={24} />
          </div>
        </a>
      </div>

      <div className="flex justify-end items-center gap-3 group">
        {!isOpen && (
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 pointer-events-none">
            <div className="bg-gradient-to-r from-[#FF8FCA] to-[#D9D9D9] p-[1.5px] w-fit rounded-lg shadow-lg">
              <h5 className="text-[#F3066EB2] bg-white px-3 py-2 text-sm font-semibold rounded-[7px] flex items-center gap-2 whitespace-nowrap">
                কিভাবে সহযোগিতা করতে পারি <HiArrowLongRight size={20} />
              </h5>
            </div>
          </div>
        )}

        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-md`}
        >
          <MessangerIcon />
        </div>
      </div>
    </div>
  );
};

export default FooterMassenger;
