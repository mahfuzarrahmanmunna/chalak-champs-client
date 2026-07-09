"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  Plus,
  Loader2,
  BookOpen,
  Globe,
  Upload,
  X,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  User,
  Megaphone,
  HelpCircle,
  Image,
  Film,
  CreditCard,
  Award,
  ListChecks,
  Target,
  Layers,
  FileText,
  Link as LinkIcon,
  Star,
  GraduationCap,
  LayoutGrid,
} from "lucide-react";
import QuillEditor from "./QuillEditor";
import Link from "next/link";

/* ─────────────────────── TYPES ─────────────────────── */

interface BilingualText {
  en: string;
  bn: string;
}

interface CourseFormData {
  slug: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  originalPrice?: number;
  thumbnail: FileList;
  youtubeLink: string;

  breadcrumb: BilingualText;
  breadcrumbs: BilingualText;

  hero: {
    title: BilingualText;
    subtitle: BilingualText;
  };

  quickInfo: {
    title: BilingualText;
    items: BilingualText[];
    offerPrice: string;
    offerText: BilingualText;
    cta1: BilingualText;
    cta2: BilingualText;
    ctaBelow: BilingualText;
  };

  overview: {
    title: BilingualText;
    content: BilingualText;
  };

  levels: {
    title: BilingualText;
    intro: BilingualText;
    level1: {
      title: BilingualText;
      for: BilingualText;
      intro: BilingualText;
      items: BilingualText[];
    };
    level2: {
      title: BilingualText;
      for: BilingualText;
      intro: BilingualText;
      items: BilingualText[];
    };
  };

  whoIsThisFor: {
    title: BilingualText;
    intro: BilingualText;
    items: BilingualText[];
    boldStatement: BilingualText;
  };

  features: {
    title: BilingualText;
    cards: { title: BilingualText; body: BilingualText }[];
  };

  syllabus: {
    title: BilingualText;
  };

  finalCta: {
    title: BilingualText;
    body: BilingualText;
    cta1: BilingualText;
    cta2: BilingualText;
    cta3: string;
    ctaBelow: BilingualText;
  };

  payment: {
    title: BilingualText;
    description: BilingualText;
  };

  instructor: {
    title: BilingualText;
    name: string;
    designation: BilingualText;
    bio: BilingualText;
    experience: BilingualText;
    studentsCount: number;
    rating: number;
    specializations: BilingualText[];
    achievements: BilingualText[];
    education: BilingualText;
    image: FileList;
    facebook: string;
    linkedin: string;
  };

  review: {
    title: BilingualText;
  };

  faq: {
    title: BilingualText;
    items: { q: BilingualText; a: BilingualText }[];
  };

  mediaAssets: { type: "image" | "video"; src: string; poster: string }[];

  resources: {
    type: "pdf" | "video" | "link" | "image";
    title: string;
    url?: string;
    file?: FileList;
  }[];

  contentEn: string;
  contentBn: string;
}

/* ─────────────────── HELPER COMPONENTS ─────────────────── */

const inputClass =
  "w-full border border-gray-300 p-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white text-sm";
const fileClass =
  "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";

function BiInput({
  label,
  enName,
  bnName,
  register,
  type = "text",
  enPlaceholder,
  bnPlaceholder,
  textarea = false,
  rows = 3,
  required = false,
}: {
  label: string;
  enName: string;
  bnName: string;
  register: any;
  type?: string;
  enPlaceholder?: string;
  bnPlaceholder?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const Tag = textarea ? "textarea" : "input";
  const extraClass = textarea ? " !min-h-[80px] resize-y" : "";
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
        {label}
        {required && <span className="text-[#F3056D]">*</span>}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tag
          {...register(enName, { required })}
          type={textarea ? undefined : type}
          rows={textarea ? rows : undefined}
          className={inputClass + extraClass}
          placeholder={enPlaceholder || "English..."}
        />
        <Tag
          {...register(bnName, { required })}
          type={textarea ? undefined : type}
          rows={textarea ? rows : undefined}
          className={inputClass + extraClass}
          placeholder={bnPlaceholder || "বাংলায়..."}
          lang="bn"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  number,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  number: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-gray-50/80 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-[#F3056D] text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
            {number}
          </span>
          {icon && <span className="text-[#214187]">{icon}</span>}
          <span className="font-bold text-gray-900 text-left">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>
      {isOpen && <div className="p-6 space-y-5 border-t">{children}</div>}
    </div>
  );
}

function AddButton({
  label,
  onClick,
  color = "pink",
}: {
  label: string;
  onClick: () => void;
  color?: "pink" | "blue";
}) {
  const cls =
    color === "pink"
      ? "bg-[#F3056D]/10 text-[#F3056D] hover:bg-[#F3056D]/20"
      : "bg-[#214187]/10 text-[#214187] hover:bg-[#214187]/20";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm font-semibold ${cls} px-4 py-2 rounded-lg transition flex items-center gap-1.5`}
    >
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition shrink-0"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

export default function CoursesClient() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get("/api/courses");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/api/courses", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      alert("Course Created Successfully!");
      reset();
    },
    onError: (err: any) => {
      console.error(err);
      alert(
        "Error creating course: " +
          (err.response?.data?.message || err.message),
      );
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: {
      slug: "",
      category: "",
      level: "",
      duration: "",
      price: 0,
      originalPrice: 0,
      youtubeLink: "",

      breadcrumb: { en: "", bn: "" },
      breadcrumbs: { en: "", bn: "" },

      hero: { title: { en: "", bn: "" }, subtitle: { en: "", bn: "" } },

      quickInfo: {
        title: { en: "", bn: "" },
        items: [{ en: "", bn: "" }],
        offerPrice: "",
        offerText: { en: "", bn: "" },
        cta1: { en: "", bn: "" },
        cta2: { en: "", bn: "" },
        ctaBelow: { en: "", bn: "" },
      },

      overview: { title: { en: "", bn: "" }, content: { en: "", bn: "" } },

      levels: {
        title: { en: "", bn: "" },
        intro: { en: "", bn: "" },
        level1: {
          title: { en: "", bn: "" },
          for: { en: "", bn: "" },
          intro: { en: "", bn: "" },
          items: [{ en: "", bn: "" }],
        },
        level2: {
          title: { en: "", bn: "" },
          for: { en: "", bn: "" },
          intro: { en: "", bn: "" },
          items: [{ en: "", bn: "" }],
        },
      },

      whoIsThisFor: {
        title: { en: "", bn: "" },
        intro: { en: "", bn: "" },
        items: [{ en: "", bn: "" }],
        boldStatement: { en: "", bn: "" },
      },

      features: {
        title: { en: "", bn: "" },
        cards: [{ title: { en: "", bn: "" }, body: { en: "", bn: "" } }],
      },

      syllabus: { title: { en: "", bn: "" } },

      finalCta: {
        title: { en: "", bn: "" },
        body: { en: "", bn: "" },
        cta1: { en: "", bn: "" },
        cta2: { en: "", bn: "" },
        cta3: "",
        ctaBelow: { en: "", bn: "" },
      },

      payment: { title: { en: "", bn: "" }, description: { en: "", bn: "" } },

      instructor: {
        title: { en: "", bn: "" },
        name: "",
        designation: { en: "", bn: "" },
        bio: { en: "", bn: "" },
        experience: { en: "", bn: "" },
        studentsCount: 0,
        rating: 0,
        specializations: [{ en: "", bn: "" }],
        achievements: [{ en: "", bn: "" }],
        education: { en: "", bn: "" },
        facebook: "",
        linkedin: "",
      },

      review: { title: { en: "", bn: "" } },

      faq: {
        title: { en: "", bn: "" },
        items: [{ q: { en: "", bn: "" }, a: { en: "", bn: "" } }],
      },

      mediaAssets: [{ type: "image", src: "", poster: "" }],

      resources: [],

      contentEn: "",
      contentBn: "",
    },
  });

  /* ── useFieldArray hooks ── */
  const {
    fields: qiItems,
    append: appendQi,
    remove: removeQi,
  } = useFieldArray({ control, name: "quickInfo.items" });
  const {
    fields: l1Items,
    append: appendL1,
    remove: removeL1,
  } = useFieldArray({ control, name: "levels.level1.items" });
  const {
    fields: l2Items,
    append: appendL2,
    remove: removeL2,
  } = useFieldArray({ control, name: "levels.level2.items" });
  const {
    fields: witfItems,
    append: appendWitf,
    remove: removeWitf,
  } = useFieldArray({ control, name: "whoIsThisFor.items" });
  const {
    fields: featureCards,
    append: appendCard,
    remove: removeCard,
  } = useFieldArray({ control, name: "features.cards" });
  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "instructor.specializations" });
  const {
    fields: achFields,
    append: appendAch,
    remove: removeAch,
  } = useFieldArray({ control, name: "instructor.achievements" });
  const {
    fields: faqItems,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: "faq.items" });
  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia,
  } = useFieldArray({ control, name: "mediaAssets" });
  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({ control, name: "resources" });

  const watchedMedia = useWatch({ control, name: "mediaAssets" });
  const watchedResources = useWatch({ control, name: "resources" });

  /* ── Auto-generate slug from English title ── */
  const heroTitleEn = watch("hero.title.en");
  React.useEffect(() => {
    if (heroTitleEn && !watch("slug")) {
      const slug = heroTitleEn
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [heroTitleEn, setValue, watch]);

  /* ── Submit handler ── */
  const onSubmit = async (data: CourseFormData) => {
    try {
      const formData = new FormData();

      // Files
      if (data.thumbnail?.[0]) formData.append("thumbnail", data.thumbnail[0]);
      if (data.instructor?.image?.[0])
        formData.append("instructorImage", data.instructor.image[0]);

      // Build course data matching the JSON structure exactly
      const courseData = {
        slug: data.slug,
        breadcrumb: data.breadcrumb.en,
        breadcrumbs: data.breadcrumbs.en,

        hero: {
          title: data.hero.title,
          subtitle: data.hero.subtitle,
        },

        quickInfo: {
          title: data.quickInfo.title,
          items: data.quickInfo.items,
          offerPrice: data.quickInfo.offerPrice,
          offerText: data.quickInfo.offerText,
          cta1: data.quickInfo.cta1,
          cta2: data.quickInfo.cta2,
          ctaBelow: data.quickInfo.ctaBelow,
        },

        overview: {
          title: data.overview.title,
          content: data.overview.content,
        },

        levels: {
          title: data.levels.title,
          intro: data.levels.intro,
          level1: {
            title: data.levels.level1.title,
            for: data.levels.level1.for,
            intro: data.levels.level1.intro,
            items: data.levels.level1.items,
          },
          level2: {
            title: data.levels.level2.title,
            for: data.levels.level2.for,
            intro: data.levels.level2.intro,
            items: data.levels.level2.items,
          },
        },

        whoIsThisFor: {
          title: data.whoIsThisFor.title,
          intro: data.whoIsThisFor.intro,
          items: data.whoIsThisFor.items,
          boldStatement: data.whoIsThisFor.boldStatement,
        },

        features: {
          title: data.features.title,
          cards: data.features.cards,
        },

        syllabus: {
          title: data.syllabus.title,
        },

        finalCta: {
          title: data.finalCta.title,
          body: data.finalCta.body,
          cta1: data.finalCta.cta1,
          cta2: data.finalCta.cta2,
          cta3: data.finalCta.cta3,
          ctaBelow: data.finalCta.ctaBelow,
        },

        payment: {
          title: data.payment.title,
          description: data.payment.description,
        },

        instructor: {
          title: data.instructor.title,
          name: data.instructor.name,
          designation: data.instructor.designation,
          bio: data.instructor.bio,
          experience: data.instructor.experience,
          studentsCount: data.instructor.studentsCount,
          rating: data.instructor.rating,
          specializations: data.instructor.specializations,
          achievements: data.instructor.achievements,
          education: data.instructor.education,
          facebook: data.instructor.facebook,
          linkedin: data.instructor.linkedin,
        },

        review: {
          title: data.review.title,
        },

        faq: {
          title: data.faq.title,
          items: data.faq.items,
        },

        mediaAssets: data.mediaAssets.filter((m) => m.src.trim() !== ""),

        // Extra dashboard fields
        category: data.category,
        level: data.level,
        duration: data.duration,
        price: data.price,
        originalPrice: data.originalPrice,
        youtubeLink: data.youtubeLink,
        resources: data.resources,
        contentEn: data.contentEn,
        contentBn: data.contentBn,
      };

      formData.append("courseData", JSON.stringify(courseData));

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Course Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Create new courses and manage existing ones.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ─── SECTION 1: BASIC INFORMATION ─── */}
          <Section
            title="Basic Information"
            number={1}
            icon={<BookOpen className="w-5 h-5" />}
            defaultOpen={true}
          >
            <BiInput
              label="Course Title"
              enName="hero.title.en"
              bnName="hero.title.bn"
              register={register}
              required
              enPlaceholder="Kids Fluent English Course"
              bnPlaceholder="Kids অনর্গল English Course"
            />

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Slug (URL)
              </label>
              <input
                {...register("slug")}
                className={inputClass}
                placeholder="auto-generated-from-title"
              />
            </div>

            <BiInput
              label="Breadcrumb"
              enName="breadcrumb.en"
              bnName="breadcrumb.bn"
              register={register}
              enPlaceholder="Home, Courses, Kids Fluent English Course"
              bnPlaceholder="Home , Courses , Kids অনর্গল English Course"
            />
            <BiInput
              label="Breadcrumbs (Short)"
              enName="breadcrumbs.en"
              bnName="breadcrumbs.bn"
              register={register}
              enPlaceholder="Kids Fluent English Course"
              bnPlaceholder="Kids অনর্গল English Course"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Category
                </label>
                <select {...register("category")} className={inputClass}>
                  <option value="">Select</option>
                  <option value="spoken-english">Spoken English</option>
                  <option value="art">Art & Drawing</option>
                  <option value="math">Math</option>
                  <option value="science">Science</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Level</label>
                <select {...register("level")} className={inputClass}>
                  <option value="">Select</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Duration
                </label>
                <input
                  {...register("duration")}
                  className={inputClass}
                  placeholder="6 Months"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  For Classes
                </label>
                <input
                  {...register("level")}
                  className={inputClass}
                  placeholder="Class 1 to 8"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Price (BDT) <span className="text-[#F3056D]">*</span>
                </label>
                <input
                  type="number"
                  {...register("price", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                  placeholder="15000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Original Price (BDT)
                </label>
                <input
                  type="number"
                  {...register("originalPrice", { valueAsNumber: true })}
                  className={inputClass}
                  placeholder="18000 (Optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  {...register("thumbnail")}
                  className={fileClass}
                  accept="image/*"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-red-500" />
                  YouTube Video Link
                </label>
                <input
                  type="url"
                  {...register("youtubeLink")}
                  className={inputClass}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Paste the full YouTube URL for the promo/intro video
                </p>
              </div>
            </div>
          </Section>

          {/* ─── SECTION 2: HERO SECTION ─── */}
          <Section
            title="Hero Section"
            number={2}
            icon={<Megaphone className="w-5 h-5" />}
          >
            <BiInput
              label="Hero Title"
              enName="hero.title.en"
              bnName="hero.title.bn"
              register={register}
              textarea
              rows={3}
              enPlaceholder="Kids Fluent English Course, Start from Zero..."
              bnPlaceholder="KIDS' অনর্গল English, শূন্য থেকে শুরু..."
            />
            <BiInput
              label="Hero Subtitle"
              enName="hero.subtitle.en"
              bnName="hero.subtitle.bn"
              register={register}
              textarea
              rows={3}
              enPlaceholder="Fluent English speaking with correct pronunciation..."
              bnPlaceholder="শুদ্ধ উচ্চারণে অনর্গল ইংরেজি বলা এবং..."
            />
          </Section>

          {/* ─── SECTION 3: QUICK INFO ─── */}
          <Section
            title="Quick Info"
            number={3}
            icon={<ListChecks className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="quickInfo.title.en"
              bnName="quickInfo.title.bn"
              register={register}
              enPlaceholder="This course includes"
              bnPlaceholder="এই কোর্সে যা থাছে"
            />

            {/* Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Info Items
                </label>
                <AddButton
                  label="Add Item"
                  onClick={() => appendQi({ en: "", bn: "" })}
                />
              </div>
              {qiItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-3 items-start bg-gray-50 p-3 rounded-xl"
                >
                  <input
                    {...register(`quickInfo.items.${idx}.en`)}
                    className={inputClass + " !py-2.5"}
                    placeholder="64 Live Classes/Recorded Classes"
                  />
                  <input
                    {...register(`quickInfo.items.${idx}.bn`)}
                    className={inputClass + " !py-2.5"}
                    placeholder="৬৪ টি লাইভ ক্লাস/রেকর্ডেড ক্লাস"
                    lang="bn"
                  />
                  <RemoveButton onClick={() => removeQi(idx)} />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Offer Price Text
              </label>
              <input
                {...register("quickInfo.offerPrice")}
                className={inputClass}
                placeholder="৳ ১৮,০০০ ৳ ১৫,০০০"
              />
            </div>

            <BiInput
              label="Offer Text"
              enName="quickInfo.offerText.en"
              bnName="quickInfo.offerText.bn"
              register={register}
              textarea
              rows={2}
              enPlaceholder="(৳3,000 OFF on full upfront payment) Or Monthly..."
              bnPlaceholder="(একসাথে পরিশোধে ৳৩,০০০ ছাড় অথবা মাসিক কিস্তি...)"
            />
            <BiInput
              label="CTA Button 1"
              enName="quickInfo.cta1.en"
              bnName="quickInfo.cta1.bn"
              register={register}
              enPlaceholder="Enroll Now →"
              bnPlaceholder="এখনই ভর্তি হন →"
            />
            <BiInput
              label="CTA Button 2"
              enName="quickInfo.cta2.en"
              bnName="quickInfo.cta2.bn"
              register={register}
              enPlaceholder="Book a Free Demo Class →"
              bnPlaceholder="ফ্রি ডেমো ক্লাস বুক করুন →"
            />
            <BiInput
              label="CTA Below Text"
              enName="quickInfo.ctaBelow.en"
              bnName="quickInfo.ctaBelow.bn"
              register={register}
              enPlaceholder="Call us for any needs: 01740176774 (24/7)"
              bnPlaceholder="যেকোনো প্রয়োজনে কল করুন: 01740176774 (24/7)"
            />
          </Section>

          {/* ─── SECTION 4: OVERVIEW ─── */}
          <Section
            title="Overview"
            number={4}
            icon={<FileText className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="overview.title.en"
              bnName="overview.title.bn"
              register={register}
              enPlaceholder="Course Details"
              bnPlaceholder="কোর্স সম্পর্কে বিস্তারিত"
            />
            <BiInput
              label="Overview Content"
              enName="overview.content.en"
              bnName="overview.content.bn"
              register={register}
              textarea
              rows={5}
              enPlaceholder="The Kids অনর্গল English Course is Chalak Champs' most popular..."
              bnPlaceholder="এই কোর্সটি ৬ থেকে ১১ বছর বয়সী শিশুদের জন্য..."
            />
          </Section>

          {/* ─── SECTION 5: LEVELS ─── */}
          <Section
            title="Course Levels"
            number={5}
            icon={<Layers className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="levels.title.en"
              bnName="levels.title.bn"
              register={register}
              enPlaceholder="Two Course Levels, Pick the Right One"
              bnPlaceholder="কোর্সের দুটি লেভেল"
            />
            <BiInput
              label="Section Intro"
              enName="levels.intro.en"
              bnName="levels.intro.bn"
              register={register}
              enPlaceholder="Join the level that matches your child's class..."
              bnPlaceholder="আপনার সন্তানের ক্লাস অনুযায়ী সঠিক লেভেলে যুক্ত হোন।"
            />

            {/* LEVEL 1 */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-[#214187] text-base flex items-center gap-2">
                <span className="w-6 h-6 bg-[#214187] text-white rounded flex items-center justify-center text-xs">
                  1
                </span>
                Level 1
              </h4>
              <BiInput
                label="Level 1 Title"
                enName="levels.level1.title.en"
                bnName="levels.level1.title.bn"
                register={register}
                enPlaceholder="Level 1, Basic Phonetics + Basic Spoken"
                bnPlaceholder="Level 1, Basic Phonetics + Basic Spoken"
              />
              <BiInput
                label="For (Target)"
                enName="levels.level1.for.en"
                bnName="levels.level1.for.bn"
                register={register}
                enPlaceholder="For: Class 1 to 4"
                bnPlaceholder="For: Class 1 থেকে Class 4"
              />
              <BiInput
                label="Intro Text"
                enName="levels.level1.intro.en"
                bnName="levels.level1.intro.bn"
                register={register}
                enPlaceholder="At this level, children will learn,"
                bnPlaceholder="এই লেভেলে বাচ্চারা শিখবে,"
              />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700">
                    Level 1 Items
                  </label>
                  <AddButton
                    label="Add"
                    onClick={() => appendL1({ en: "", bn: "" })}
                    color="blue"
                  />
                </div>
                {l1Items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-3 items-start bg-white p-3 rounded-xl border border-blue-100"
                  >
                    <input
                      {...register(`levels.level1.items.${idx}.en`)}
                      className={inputClass + " !py-2.5"}
                      placeholder="Foundation of correct pronunciation"
                    />
                    <input
                      {...register(`levels.level1.items.${idx}.bn`)}
                      className={inputClass + " !py-2.5"}
                      placeholder="Basic Phonetics, শুদ্ধ উচ্চারণের ভিত্তি"
                      lang="bn"
                    />
                    <RemoveButton onClick={() => removeL1(idx)} />
                  </div>
                ))}
              </div>
            </div>

            {/* LEVEL 2 */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-emerald-800 text-base flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-700 text-white rounded flex items-center justify-center text-xs">
                  2
                </span>
                Level 2
              </h4>
              <BiInput
                label="Level 2 Title"
                enName="levels.level2.title.en"
                bnName="levels.level2.title.bn"
                register={register}
                enPlaceholder="Level 2, Advanced Phonetics + Spoken + Accent + Grammar"
                bnPlaceholder="Level 2, Advanced Phonetics + Spoken + Accent + Grammar"
              />
              <BiInput
                label="For (Target)"
                enName="levels.level2.for.en"
                bnName="levels.level2.for.bn"
                register={register}
                enPlaceholder="For: Class 5 to 8"
                bnPlaceholder="For: Class 5 থেকে Class 8"
              />
              <BiInput
                label="Intro Text"
                enName="levels.level2.intro.en"
                bnName="levels.level2.intro.bn"
                register={register}
                enPlaceholder="At this level, children will learn,"
                bnPlaceholder="এই লেভেলে বাচ্চারা শিখবে,"
              />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700">
                    Level 2 Items
                  </label>
                  <AddButton
                    label="Add"
                    onClick={() => appendL2({ en: "", bn: "" })}
                    color="blue"
                  />
                </div>
                {l2Items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-3 items-start bg-white p-3 rounded-xl border border-emerald-100"
                  >
                    <input
                      {...register(`levels.level2.items.${idx}.en`)}
                      className={inputClass + " !py-2.5"}
                      placeholder="Deep pronunciation mastery"
                    />
                    <input
                      {...register(`levels.level2.items.${idx}.bn`)}
                      className={inputClass + " !py-2.5"}
                      placeholder="Advanced Phonetics, গভীর উচ্চারণ দক্ষতা"
                      lang="bn"
                    />
                    <RemoveButton onClick={() => removeL2(idx)} />
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ─── SECTION 6: WHO IS THIS FOR ─── */}
          <Section
            title="Who Is This For"
            number={6}
            icon={<Target className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="whoIsThisFor.title.en"
              bnName="whoIsThisFor.title.bn"
              register={register}
              enPlaceholder="Course is Designed For"
              bnPlaceholder="কোর্সটি যাদের জন্য"
            />
            <BiInput
              label="Intro Text"
              enName="whoIsThisFor.intro.en"
              bnName="whoIsThisFor.intro.bn"
              register={register}
              enPlaceholder="Does your child relate to any of these?"
              bnPlaceholder="আপনার সন্তান কি এরকম?"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Items</label>
                <AddButton
                  label="Add Item"
                  onClick={() => appendWitf({ en: "", bn: "" })}
                />
              </div>
              {witfItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-3 items-start bg-gray-50 p-3 rounded-xl"
                >
                  <input
                    {...register(`whoIsThisFor.items.${idx}.en`)}
                    className={inputClass + " !py-2.5"}
                    placeholder="Can't speak English or freezes up when trying"
                  />
                  <input
                    {...register(`whoIsThisFor.items.${idx}.bn`)}
                    className={inputClass + " !py-2.5"}
                    placeholder="ইংলিশ একদমই বলতে পারে না বা বলতে গেলে আটকে যায়"
                    lang="bn"
                  />
                  <RemoveButton onClick={() => removeWitf(idx)} />
                </div>
              ))}
            </div>
            <BiInput
              label="Bold Statement"
              enName="whoIsThisFor.boldStatement.en"
              bnName="whoIsThisFor.boldStatement.bn"
              register={register}
              enPlaceholder="This course was built exactly for your child."
              bnPlaceholder="তাহলে এই কোর্সটা ঠিক তার জন্যই।"
            />
          </Section>

          {/* ─── SECTION 7: FEATURES ─── */}
          <Section
            title="Features"
            number={7}
            icon={<Star className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="features.title.en"
              bnName="features.title.bn"
              register={register}
              enPlaceholder="Course Exclusive Features"
              bnPlaceholder="কোর্সটি কেন সেরা?"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Feature Cards
                </label>
                <AddButton
                  label="Add Feature"
                  onClick={() =>
                    appendCard({
                      title: { en: "", bn: "" },
                      body: { en: "", bn: "" },
                    })
                  }
                />
              </div>
              {featureCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Feature #{idx + 1}
                    </span>
                    <RemoveButton onClick={() => removeCard(idx)} />
                  </div>
                  <BiInput
                    label="Card Title"
                    enName={`features.cards.${idx}.title.en`}
                    bnName={`features.cards.${idx}.title.bn`}
                    register={register}
                    enPlaceholder="Colorful Course Material"
                    bnPlaceholder="Colorful Course Material"
                  />
                  <BiInput
                    label="Card Body"
                    enName={`features.cards.${idx}.body.en`}
                    bnName={`features.cards.${idx}.body.bn`}
                    register={register}
                    textarea
                    rows={2}
                    enPlaceholder="Every topic is presented through colorful..."
                    bnPlaceholder="প্রতিটি বিষয় রঙিন ও আকর্ষণীয়..."
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* ─── SECTION 8: SYLLABUS ─── */}
          <Section
            title="Syllabus"
            number={8}
            icon={<LayoutGrid className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="syllabus.title.en"
              bnName="syllabus.title.bn"
              register={register}
              enPlaceholder="Course Syllabus/Curriculum"
              bnPlaceholder="কোর্স সিলেবাস/কারিকুলাম"
            />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Note:</strong> Syllabus content is managed via the Modules
              page after course creation. This uses a tab system.
            </div>
          </Section>

          {/* ─── SECTION 9: FINAL CTA ─── */}
          <Section
            title="Final CTA"
            number={9}
            icon={<Megaphone className="w-5 h-5" />}
          >
            <BiInput
              label="Title"
              enName="finalCta.title.en"
              bnName="finalCta.title.bn"
              register={register}
              enPlaceholder="Any More Questions?"
              bnPlaceholder="আরও কোন জিজ্ঞাসা আছে?"
            />
            <BiInput
              label="Body"
              enName="finalCta.body.en"
              bnName="finalCta.body.bn"
              register={register}
              textarea
              rows={3}
              enPlaceholder="Start Your Child's Fluent English Journey, Today..."
              bnPlaceholder="আজই শুরু হোক আপনার সন্তানের অনর্গল English যাত্রা।..."
            />
            <BiInput
              label="CTA Button 1"
              enName="finalCta.cta1.en"
              bnName="finalCta.cta1.bn"
              register={register}
              enPlaceholder="Book My Free Class →"
              bnPlaceholder="ফ্রি ডেমো ক্লাস বুক করুন →"
            />
            <BiInput
              label="CTA Button 2"
              enName="finalCta.cta2.en"
              bnName="finalCta.cta2.bn"
              register={register}
              enPlaceholder="Enroll Now →"
              bnPlaceholder="এখনই ভর্তি হন →"
            />
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                CTA Button 3 (Phone Number)
              </label>
              <input
                {...register("finalCta.cta3")}
                className={inputClass}
                placeholder="01740176774 (24/7)"
              />
            </div>
            <BiInput
              label="CTA Below Text"
              enName="finalCta.ctaBelow.en"
              bnName="finalCta.ctaBelow.bn"
              register={register}
              enPlaceholder="Limited seats, confirm today"
              bnPlaceholder="সীমিত আসন, আজই নিশ্চিত করুন"
            />
          </Section>

          {/* ─── SECTION 10: PAYMENT ─── */}
          <Section
            title="Payment"
            number={10}
            icon={<CreditCard className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="payment.title.en"
              bnName="payment.title.bn"
              register={register}
              enPlaceholder="Payment Process"
              bnPlaceholder="ভর্তি হওয়ার প্রক্রিয়া"
            />
            <BiInput
              label="Description"
              enName="payment.description.en"
              bnName="payment.description.bn"
              register={register}
              textarea
              rows={2}
              enPlaceholder="Watch This Video To Learn More About How To Make A Payment."
              bnPlaceholder="কীভাবে পেমেন্ট করবেন তা বিস্তারিত জানতে এই ভিডিওটি দেখুন"
            />
          </Section>

          {/* ─── SECTION 11: INSTRUCTOR ─── */}
          <Section
            title="Instructor"
            number={11}
            icon={<User className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="instructor.title.en"
              bnName="instructor.title.bn"
              register={register}
              enPlaceholder="Chalak Champs Spoken English Instructor"
              bnPlaceholder="চালাক চ্যাম্পস স্পোকেন ইংরেজি ইন্সট্রাক্টর"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Instructor Name
                </label>
                <input
                  {...register("instructor.name")}
                  className={inputClass}
                  placeholder="Md. Rafi Islam"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Instructor Photo
                </label>
                <input
                  type="file"
                  {...register("instructor.image")}
                  className={fileClass}
                  accept="image/*"
                />
              </div>
            </div>

            <BiInput
              label="Designation"
              enName="instructor.designation.en"
              bnName="instructor.designation.bn"
              register={register}
              enPlaceholder="Spoken English Instructor & Pronunciation Expert"
              bnPlaceholder="Spoken English Instructor & Pronunciation Expert"
            />

            <BiInput
              label="Bio"
              enName="instructor.bio.en"
              bnName="instructor.bio.bn"
              register={register}
              textarea
              rows={4}
              enPlaceholder="6 years of experience in teaching children spoken English..."
              bnPlaceholder="শিশুদের স্পোকেন ইংরেজি শেখানোর ক্ষেত্রে ৬ বছরের দীর্ঘ অভিজ্ঞতা।..."
            />

            <BiInput
              label="Experience"
              enName="instructor.experience.en"
              bnName="instructor.experience.bn"
              register={register}
              enPlaceholder="6 years"
              bnPlaceholder="৬ বছর"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Students Count
                </label>
                <input
                  type="number"
                  {...register("instructor.studentsCount", {
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                  placeholder="1449"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("instructor.rating", { valueAsNumber: true })}
                  className={inputClass}
                  placeholder="4.9"
                />
              </div>
            </div>

            <BiInput
              label="Education"
              enName="instructor.education.en"
              bnName="instructor.education.bn"
              register={register}
              enPlaceholder="B.A. (Honours) in English — University of Dhaka"
              bnPlaceholder="B.A. (Honours) in English — University of Dhaka"
            />

            {/* Specializations */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Specializations
                </label>
                <AddButton
                  label="Add"
                  onClick={() => appendSpec({ en: "", bn: "" })}
                  color="blue"
                />
              </div>
              {specFields.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-3 items-start bg-gray-50 p-3 rounded-xl"
                >
                  <input
                    {...register(`instructor.specializations.${idx}.en`)}
                    className={inputClass + " !py-2.5"}
                    placeholder="Phonetics & Pronunciation"
                  />
                  <input
                    {...register(`instructor.specializations.${idx}.bn`)}
                    className={inputClass + " !py-2.5"}
                    placeholder="Phonetics & Pronunciation"
                    lang="bn"
                  />
                  <RemoveButton onClick={() => removeSpec(idx)} />
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Achievements
                </label>
                <AddButton
                  label="Add"
                  onClick={() => appendAch({ en: "", bn: "" })}
                />
              </div>
              {achFields.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_40px] gap-3 items-start bg-gray-50 p-3 rounded-xl"
                >
                  <input
                    {...register(`instructor.achievements.${idx}.en`)}
                    className={inputClass + " !py-2.5"}
                    placeholder="1,400+ students successfully completed"
                  />
                  <input
                    {...register(`instructor.achievements.${idx}.bn`)}
                    className={inputClass + " !py-2.5"}
                    placeholder="১,৪০০+ শিক্ষার্থী সফলভাবে কোর্স সম্পন্ন"
                    lang="bn"
                  />
                  <RemoveButton onClick={() => removeAch(idx)} />
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" /> Facebook
                </label>
                <input
                  {...register("instructor.facebook")}
                  type="url"
                  className={inputClass}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" /> LinkedIn
                </label>
                <input
                  {...register("instructor.linkedin")}
                  type="url"
                  className={inputClass}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </Section>

          {/* ─── SECTION 12: REVIEW ─── */}
          <Section
            title="Review Section"
            number={12}
            icon={<Star className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="review.title.en"
              bnName="review.title.bn"
              register={register}
              enPlaceholder="Course Review"
              bnPlaceholder="কোর্স Review"
            />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Note:</strong> Reviews are managed separately after course
              creation.
            </div>
          </Section>

          {/* ─── SECTION 13: FAQ ─── */}
          <Section
            title="FAQ"
            number={13}
            icon={<HelpCircle className="w-5 h-5" />}
          >
            <BiInput
              label="Section Title"
              enName="faq.title.en"
              bnName="faq.title.bn"
              register={register}
              enPlaceholder="Frequently Asked Questions"
              bnPlaceholder="সাধারণ জিজ্ঞাসা"
            />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  FAQ Items
                </label>
                <AddButton
                  label="Add FAQ"
                  onClick={() =>
                    appendFaq({ q: { en: "", bn: "" }, a: { en: "", bn: "" } })
                  }
                />
              </div>
              {faqItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      FAQ #{idx + 1}
                    </span>
                    <RemoveButton onClick={() => removeFaq(idx)} />
                  </div>
                  <BiInput
                    label="Question"
                    enName={`faq.items.${idx}.q.en`}
                    bnName={`faq.items.${idx}.q.bn`}
                    register={register}
                    enPlaceholder="My child has zero English knowledge, can they still join?"
                    bnPlaceholder="আমার বাচ্চার ইংলিশ একদমই নেই, সে কি এই কোর্স করতে পারবে?"
                  />
                  <BiInput
                    label="Answer"
                    enName={`faq.items.${idx}.a.en`}
                    bnName={`faq.items.${idx}.a.bn`}
                    register={register}
                    textarea
                    rows={3}
                    enPlaceholder="Absolutely yes. This course is built to start from zero..."
                    bnPlaceholder="একদম হ্যাঁ। এই কোর্সটি শূন্য থেকে শুরু করার জন্যই তৈরি..."
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* ─── SECTION 14: MEDIA ASSETS ─── */}
          <Section
            title="Media Assets"
            number={14}
            icon={<Image className="w-5 h-5" />}
          >
            <p className="text-sm text-gray-500">
              Add images and YouTube video links that appear on the course page.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Assets
                </label>
                <AddButton
                  label="Add Asset"
                  onClick={() =>
                    appendMedia({ type: "image", src: "", poster: "" })
                  }
                  color="blue"
                />
              </div>
              {mediaFields.map((field, idx) => {
                const currentType = watchedMedia?.[idx]?.type || "image";
                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr_40px] gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-100"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Type
                      </label>
                      <select
                        {...register(`mediaAssets.${idx}.type`)}
                        className="w-full border border-gray-300 p-2 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#F3056D]/20 outline-none"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video (YouTube)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        {currentType === "video" ? "YouTube URL" : "Image URL"}
                      </label>
                      <input
                        {...register(`mediaAssets.${idx}.src`)}
                        className={inputClass + " !py-2.5"}
                        placeholder={
                          currentType === "video"
                            ? "https://www.youtube.com/watch?v=..."
                            : "/courses.png"
                        }
                      />
                    </div>
                    {currentType === "video" && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">
                          Poster Image URL
                        </label>
                        <input
                          {...register(`mediaAssets.${idx}.poster`)}
                          className={inputClass + " !py-2.5"}
                          placeholder="/courses.png"
                        />
                      </div>
                    )}
                    {currentType === "image" && <div />}
                    <div className="pt-5">
                      <RemoveButton onClick={() => removeMedia(idx)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ─── SECTION 15: RESOURCES ─── */}
          <Section
            title="Resources"
            number={15}
            icon={<FileText className="w-5 h-5" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Course Resources
                </label>
                <AddButton
                  label="Add Resource"
                  onClick={() =>
                    appendResource({ type: "pdf", title: "", url: "" })
                  }
                />
              </div>
              {resourceFields.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No resources added yet.
                </p>
              )}
              {resourceFields.map((field, idx) => {
                const currentType = watchedResources?.[idx]?.type || "pdf";
                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_40px] gap-3 p-3 bg-gray-50 rounded-xl items-start border border-gray-100"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Type
                      </label>
                      <select
                        {...register(`resources.${idx}.type`)}
                        className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#F3056D]/20 outline-none"
                      >
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                        <option value="link">Link</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Title
                      </label>
                      <input
                        {...register(`resources.${idx}.title`)}
                        className={inputClass + " !py-2.5"}
                        placeholder="Resource Title"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        {currentType === "pdf" || currentType === "image"
                          ? "Upload File"
                          : "URL"}
                      </label>
                      {currentType === "pdf" || currentType === "image" ? (
                        <input
                          type="file"
                          {...register(`resources.${idx}.file`)}
                          className="w-full text-xs text-gray-500"
                          accept={currentType === "pdf" ? ".pdf" : "image/*"}
                        />
                      ) : (
                        <input
                          {...register(`resources.${idx}.url`)}
                          className={inputClass + " !py-2.5"}
                          placeholder="https://..."
                        />
                      )}
                    </div>
                    <div className="pt-5">
                      <RemoveButton onClick={() => removeResource(idx)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ─── SECTION 16: COURSE CONTENT (QUILL) ─── */}
          <Section
            title="Course Content (Rich Text)"
            number={16}
            icon={<GraduationCap className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#214187]">
                  <Globe className="w-4 h-4" /> English Content
                </label>
                <Controller
                  name="contentEn"
                  control={control}
                  render={({ field }) => (
                    <QuillEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type in English..."
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#214187]">
                  <Globe className="w-4 h-4" /> বাংলা কন্টেন্ট
                </label>
                <Controller
                  name="contentBn"
                  control={control}
                  render={({ field }) => (
                    <QuillEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="বাংলায় লিখুন..."
                    />
                  )}
                />
              </div>
            </div>
          </Section>

          {/* ─── SUBMIT BUTTONS ─── */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-end gap-3 z-50">
            <button
              type="button"
              onClick={() => reset()}
              disabled={mutation.isPending}
              className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`px-10 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-all shadow-lg ${
                mutation.isPending
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"
              }`}
            >
              {mutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              {mutation.isPending ? "Creating Course..." : "Create Course"}
            </button>
          </div>
        </form>

        {/* ─── EXISTING COURSES ─── */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-[#214187] mb-8">
            Existing Courses
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-[#F3056D]" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 font-medium">
              Failed to load courses.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data?.data?.map((course: any) => (
                <Link
                  href={`/dashboard/courses/${course._id}/modules`}
                  key={course._id}
                  className="group"
                >
                  <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#F3056D]/20 transition-all duration-300 flex flex-col h-full bg-white">
                    <div className="h-52 bg-gray-100 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title?.en}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <BookOpen className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#214187] transition-colors line-clamp-2">
                        {course.title?.en || course.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">
                        {course.heroSubtitle?.en || course.heroSubtitle}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-[#F3056D] font-extrabold text-xl">
                          {course.price === 0 ? "Free" : `৳${course.price}`}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${
                            course.isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {course.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Draft
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {data?.data?.length === 0 && (
                <div className="col-span-3 text-center py-20 text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-2xl">
                  No courses found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
