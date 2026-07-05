"use client";

import React from "react";
import { Award, Download, Target, Video, Zap } from "lucide-react";

const IncludesCard = () => {
  const includes = [
    { icon: <Video className="w-5 h-5" />, text: "24 hours on-demand video" },
    {
      icon: <Download className="w-5 h-5" />,
      text: "10 downloadable resources",
    },
    { icon: <Target className="w-5 h-5" />, text: "10 articles" },
    { icon: <Zap className="w-5 h-5" />, text: "Access on mobile and TV" },
    { icon: <Award className="w-5 h-5" />, text: "Certificate of completion" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
        This course includes:
      </h3>
      <div className="space-y-3">
        {includes.map((item, index) => (
          <div
            key={index}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300"
          >
            <div className="mr-3">{item.icon}</div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncludesCard;
