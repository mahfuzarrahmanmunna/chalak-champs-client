// src/app/[lang]/products/productData.ts

import { Product } from "./types";

export function getProducts(isBangla: boolean): Product[] {
  return [
    {
      id: 1,
      title: "KIDS' অনর্গল ENGLISH",
      category: isBangla ? "বই" : "Book",
      subtitle: isBangla ? "বই + ই-বুক" : "Book + eBook",
      description: isBangla
        ? "শৈশবে ভাষা শেখার সেরা সময়। ধাপে ধাপে সাজানো লেসন, গাইডলাইন ও অনুশীলন কৌশল।"
        : "Best time to learn a language is childhood. Step-by-step lessons, guidelines & practice techniques.",
      image: "",
      fee: "৳ 550",
      badge: isBangla ? "বেস্ট সেলার" : "Best Seller",
      highlights: [
        isBangla ? "ধাপে ধাপে সাজানো লেসন" : "Step-by-step lessons",
        isBangla ? "ফ্রি ই-বুক ভার্সন সহ" : "Free eBook included",
        isBangla ? "ক্লাস ১-৮ এর জন্য" : "For Class 1-8",
        isBangla ? "১২০ পৃষ্ঠা" : "120 Pages",
      ],
      author: "Limon Hasan & Noore Jannat Meem",
      pages: "120",
      publisher: "Lingual Academy",
      edition: isBangla ? "১ম সংস্করণ" : "1st Edition",
      country: isBangla ? "বাংলাদেশ" : "Bangladesh",
      language: isBangla ? "বাংলা" : "Bangla",
      fullDescription: isBangla
        ? "ভাষা শেখার সেরা সময় শৈশব। বয়স বাড়ার সঙ্গে সঙ্গে শেখার ক্ষমতা কমে। প্রতিটি বাবা-মার স্বপ্ন, সন্তান যেন অনর্গল ইংরেজি বলতে পারে এবং বিভিন্ন প্রতিযোগিতায় সফল হয়। কিন্তু অনেকেই এই গুরুত্বপূর্ণ সময়টি কাজে লাগাতে পারেন না। সঠিক পদ্ধতি ও গাইডলাইনে ইংরেজি শেখা খুবই সহজ। এই বইটি আপনার শিশুর জন্য একটি Home Tutor-এর মতো কাজ করবে যেখানে রয়েছে ধাপে ধাপে সাজানো লেসন, প্রয়োজনীয় গাইডলাইন এবং কার্যকর অনুশীলন কৌশল।"
        : "Childhood is the best time to learn a language. As age increases, learning ability decreases. Every parent dreams that their child can speak fluent English and succeed in various competitions. But many fail to utilize this crucial time. With the right method and guidelines, learning English is very easy. This book will work like a Home Tutor for your child, with step-by-step lessons, essential guidelines, and effective practice techniques.",
      fullDescriptionSecond: isBangla
        ? "তবে শুধু পড়লেই হবে না; নিয়মিত চর্চা ও বাস্তব জীবনে ব্যবহারই ভাষা শেখার মূল চাবিকাঠি। প্রতিদিন ইংরেজিতে কথা বলার অভ্যাস গড়ে তুললে এই বইটি আপনার শিশুকে আত্মবিশ্বাসী ও দক্ষ করে তুলতে সহায়তা করবে। আমাদের লক্ষ্য ইংরেজি শেখাকে সহজ, মজাদার ও কার্যকর করা।"
        : "But just reading is not enough; regular practice and real-life use is the main key to learning a language. If you build the habit of speaking English every day, this book will help make your child confident and skilled. Our goal is to make learning English easy, fun, and effective.",
      features: [
        {
          icon: "📋",
          title: isBangla ? "ধাপে ধাপে সাজানো লেসন" : "Step-by-Step Lessons",
          desc: isBangla
            ? "প্রতিটি লেসন সহজ থেকে কঠিনে সাজানো, যাতে বাচ্চারা সহজেই অগ্রসর হতে পারে।"
            : "Each lesson is arranged from easy to difficult, so children can progress easily.",
        },
        {
          icon: "🎯",
          title: isBangla ? "গাইডলাইন ও কৌশল" : "Guidelines & Techniques",
          desc: isBangla
            ? "প্রতিটি অধ্যায়ে প্রয়োজনীয় গাইডলাইন এবং কার্যকর অনুশীলন কৌশল দেওয়া আছে।"
            : "Each chapter includes essential guidelines and effective practice techniques.",
        },
        {
          icon: "👨‍🏫",
          title: isBangla ? "Home Tutor-এর মতো কাজ" : "Works Like a Home Tutor",
          desc: isBangla
            ? "এই বইটি আপনার শিশুর জন্য একটি Home Tutor-এর মতো কাজ করবে।"
            : "This book will work like a Home Tutor for your child.",
        },
        {
          icon: "💪",
          title: isBangla ? "আত্মবিশ্বাস বাড়ায়" : "Boosts Confidence",
          desc: isBangla
            ? "নিয়মিত চর্চায় শিশুর ইংরেজি বলার আত্মবিশ্বাস বাড়বে।"
            : "Regular practice will increase your child's confidence in speaking English.",
        },
      ],
      whyPoints: [
        isBangla
          ? "শৈশবকালে ভাষা শেখার সেরা সময়, এই বইটি সেই সময়টি কাজে লাগায়"
          : "Childhood is the best time to learn a language, this book utilizes that time",
        isBangla
          ? "শূন্য থেকে শুরু করে অনর্গল ইংরেজি বলার পথ দেখায়"
          : "Shows the path from zero to fluent English speaking",
        isBangla
          ? "বিভিন্ন প্রতিযোগিতায় সফল হওয়ার জন্য প্রস্তুতি করে"
          : "Prepares for success in various competitions",
        isBangla
          ? "মজাদার ও কার্যকর পদ্ধতিতে ইংরেজি শেখায়"
          : "Teaches English in a fun and effective way",
      ],
    },
    {
      id: 2,
      title: isBangla ? "চালাক চ্যাম্পস টি-শার্ট" : "Chalak Champs T-Shirt",
      category: isBangla ? "পোশাক" : "Apparel",
      subtitle: isBangla ? "পোশাক" : "Apparel",
      description: isBangla
        ? "চালাক চ্যাম্পস ব্রান্ডেড টি-শার্ট। আরামদায়ক কাপড় দিয়ে তৈরি।"
        : "Chalak Champs branded T-Shirt. Made from comfortable fabric.",
      image: "",
      fee: isBangla ? "কল করুন" : "Call for Price",
      badge: isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
      highlights: [
        isBangla ? "কটন ফ্যাব্রিক" : "Cotton Fabric",
        isBangla ? "শিশুদের জন্য" : "For Kids",
        isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
      ],
    },
    {
      id: 3,
      title: isBangla
        ? "চালাক চ্যাম্পস স্কুল ব্যাগ"
        : "Chalak Champs School Bag",
      category: isBangla ? "ব্যাগ" : "Bags",
      subtitle: isBangla ? "ব্যাগ" : "Bags",
      description: isBangla
        ? "চালাক চ্যাম্পস স্কুল ব্যাগ। উন্নতমানের ম্যাটেরিয়াল, টেকসই ও আরামদায়ক।"
        : "Chalak Champs School Bag. High-quality material, durable & comfortable.",
      image: "",
      fee: "৳ 500",
      highlights: [
        isBangla ? "প্রিমিয়াম কোয়ালিটি" : "Premium Quality",
        isBangla ? "টেকসই ম্যাটেরিয়াল" : "Durable Material",
        isBangla ? "শিশুদের জন্য আরামদায়ক" : "Comfortable for Kids",
        isBangla ? "চালাক চ্যাম্পস ব্রান্ডেড" : "Chalak Champs Branded",
      ],
      fullDescription: isBangla
        ? "চালাক চ্যাম্পস স্কুল ব্যাগ উন্নতমানের ম্যাটেরিয়াল দিয়ে তৈরি। এটি টেকসই এবং শিশুদের জন্য আরামদায়ক। ব্যাগে রয়েছে পর্যাপ্ত স্টোরেজ স্পেস, এরগোনোমিক ডিজাইন এবং চালাক চ্যাম্পসের বিশেষ ব্রান্ডিং। আপনার সন্তানের স্কুল যাত্রাকে আরও আনন্দময় করতে এই ব্যাগটি পারফেক্ট।"
        : "Chalak Champs School Bag is made from high-quality material. It is durable and comfortable for children. The bag features ample storage space, ergonomic design, and special Chalak Champs branding. Perfect to make your child's school journey more enjoyable.",
      specs: [
        {
          label: isBangla ? "ধরন" : "Type",
          value: isBangla ? "স্কুল ব্যাগ" : "School Bag",
        },
        {
          label: isBangla ? "মান" : "Quality",
          value: isBangla ? "প্রিমিয়াম কোয়ালিটি" : "Premium Quality",
        },
        {
          label: isBangla ? "উপযোগী" : "Suitable For",
          value: isBangla ? "শিশুদের জন্য" : "For Kids",
        },
        { label: isBangla ? "ব্রান্ড" : "Brand", value: "Chalak Champs" },
        { label: isBangla ? "দাম" : "Price", value: "৳ 500" },
        {
          label: isBangla ? "ডেলিভারি" : "Delivery",
          value: isBangla ? "সারা বাংলাদেশে" : "Nationwide",
        },
      ],
    },
    {
      id: 4,
      title: isBangla ? "চালাক চ্যাম্পস স্টেশনারি" : "Chalak Champs Stationary",
      category: isBangla ? "স্টেশনারি" : "Stationary",
      subtitle: isBangla ? "স্টেশনারি" : "Stationary",
      description: isBangla
        ? "চালাক চ্যাম্পস ব্রান্ডেড স্টেশনারি আইটেম। শেখাকে মজাদার করতে ডিজাইন করা।"
        : "Chalak Champs branded stationary items. Designed to make learning fun.",
      image: "",
      fee: isBangla ? "কল করুন" : "Call for Price",
      badge: isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
      highlights: [
        isBangla ? "ব্রান্ডেড আইটেম" : "Branded Items",
        isBangla ? "শিশুদের জন্য" : "For Kids",
        isBangla ? "শীঘ্রই আসছে" : "Coming Soon",
      ],
    },
  ];
}

export function getProductTabs(isBangla: boolean): string[] {
  return [
    isBangla ? "বই" : "Book",
    isBangla ? "পোশাক" : "Apparel",
    isBangla ? "ব্যাগ" : "Bags",
    isBangla ? "স্টেশনারি" : "Stationary",
  ];
}
