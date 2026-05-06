"use client"; // Next.js App router use korle aita lagbe

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; 

const AddsCard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isClosed = localStorage.getItem("adClosed");
    if (!isClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <section className="relative mt-12 max-w-268 max-h-91 mx-auto bg-linear-to-b from-[#FF8FCA] to-[#D9D9D9] rounded-[53px] group">
      {/* Cross Icon Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 cursor-pointer right-6 z-10 bg-black/20 hover:bg-black/50 text-white rounded-full p-1 transition-all"
        aria-label="Close ad"
      >
        <X size={24} />
      </button>

      <figure className="p-0.5 rounded-[51px] overflow-hidden">
        <Image
          src={"/videoimg.png"}
          alt="Adds section image"
          width={1073}
          height={365}
          className="w-full h-auto rounded-[51px]"
        />
      </figure>
    </section>
  );
};

export default AddsCard;
