"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Upload,
  X,
  BookOpen,
  Video,
  FileText,
} from "lucide-react";
import EditorJS, { OutputData } from "@editorjs/editorjs"; // Import OutputData
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";

// --- ZOD SCHEMA FOR COURSE INFO ---
const courseFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description is required"),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.string().min(1, "Duration is required"),
  tags: z.string().optional(),
  objectives: z.string().optional(),
  requirements: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

// --- TYPES FOR CURRICULUM ---
// Use the official OutputData type from EditorJS
type Lesson = {
  id: string;
  title: string;
  content?: OutputData;
  order: number;
};

type Module = {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  isExpanded: boolean;
  activeLessonId: string | null;
};

// --- EDITOR COMPONENT ---
const LessonEditor = ({
  data,
  onSave,
  onCancel,
}: {
  data: OutputData | undefined; // Allow undefined initially
  onSave: (data: OutputData) => void;
  onCancel: () => void;
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs-container",
        placeholder: "Let's write an awesome lesson! Start with a header...",
        // FIX 1: Ensure data always has a blocks array to satisfy OutputData
        data: data || { blocks: [], time: Date.now(), version: "2.22.0" },
        tools: {
          // FIX 2: Cast tool config to 'any' to resolve type conflicts with plugins
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3],
              defaultLevel: 2,
            },
          } as any,
          list: {
            class: List,
            inlineToolbar: true,
          } as any,
          code: CodeTool as any,
          delimiter: Delimiter as any,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "http://localhost:5000/api/upload/editor",
              },
              uploader: {
                uploadByFile(file: File) {
                  console.log("Uploading file:", file);
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve({
                        success: 1,
                        file: {
                          url: "https://picsum.photos/800/400",
                        },
                      });
                    }, 1000);
                  });
                },
              },
            },
          } as any,
        },
        autofocus: true,
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // NOTE: We intentionally omit 'data' from dependency array to prevent re-initializing
    // the editor every time the parent updates, which would lose focus.
    // If you need to update data externally, use editor.render(data).
  }, []);

  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    try {
      const outputData = await editorRef.current.save();
      onSave(outputData);
    } catch (error) {
      console.error("Saving failed: ", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border-l-4 border-blue-500 bg-blue-50/50 p-4 my-4 rounded-r-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-blue-700">
          Editing Content
        </span>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center gap-1"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={12} /> Save Content
              </>
            )}
          </button>
        </div>
      </div>
      <div
        id="editorjs-container"
        className="bg-white p-4 rounded border min-h-[300px]"
      ></div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function AddCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modules, setModules] = useState<Module[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
  });

  const addModule = () => {
    const newModule: Module = {
      id: crypto.randomUUID(),
      title: `Module ${modules.length + 1}`,
      description: "",
      order: modules.length + 1,
      lessons: [],
      isExpanded: true,
      activeLessonId: null,
    };
    setModules([...modules, newModule]);
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  const toggleModule = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m,
      ),
    );
  };

  const addLesson = (moduleId: string) => {
    const lessonId = crypto.randomUUID();
    const newLesson: Lesson = {
      id: lessonId,
      title: `Lesson 1`,
      // Initialize with empty valid data
      content: { blocks: [], time: Date.now(), version: "2.22.0" },
      order: 1,
    };

    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: [...m.lessons, newLesson],
            isExpanded: true,
            activeLessonId: lessonId,
          };
        }
        return m;
      }),
    );
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.filter((l) => l.id !== lessonId),
            activeLessonId:
              m.activeLessonId === lessonId ? null : m.activeLessonId,
          };
        }
        return m;
      }),
    );
  };

  const updateLessonTitle = (
    moduleId: string,
    lessonId: string,
    newTitle: string,
  ) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, title: newTitle } : l,
            ),
          };
        }
        return m;
      }),
    );
  };

  const handleLessonContentSave = (
    moduleId: string,
    lessonId: string,
    data: OutputData,
  ) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lessonId ? { ...l, content: data } : l,
            ),
            activeLessonId: null,
          };
        }
        return m;
      }),
    );
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Handle Optional Fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // Handle Thumbnail
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const courseRes = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!courseRes.ok) throw new Error("Failed to create course");
      const courseData = await courseRes.json();
      const courseId = courseData.data._id;

      for (const mod of modules) {
        const modRes = await fetch(
          `http://localhost:5000/api/courses/${courseId}/modules`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              title: mod.title,
              description: mod.description,
            }),
          },
        );

        if (!modRes.ok) continue;
        const modData = await modRes.json();
        const moduleId = modData.data._id;

        for (const lesson of mod.lessons) {
          await fetch(
            `http://localhost:5000/api/courses/modules/${moduleId}/lessons`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                title: lesson.title,
                content: lesson.content,
                duration: 10,
              }),
            },
          );
        }
      }

      alert("Course Created Successfully!");
      router.push("/instructor/courses");
    } catch (error) {
      console.error(error);
      alert("Error creating course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Create New Course
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* --- SECTION 1: BASIC INFO --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="e.g. Complete Web Development Bootcamp"
                className="w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="What will students learn?"
                className="w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category & Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                <option value="Grammar">Grammar</option>
                <option value="Business">Business</option>
                <option value="Speaking">Speaking</option>
                <option value="Writing">Writing</option>
                <option value="Vocabulary">Vocabulary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                {...register("level")}
                className="w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("price")}
                placeholder="49.99"
                className="w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price ($)
              </label>
              <input
                type="number"
                {...register("originalPrice")}
                placeholder="99.99"
                className="w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Duration & Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Duration (Hours)
              </label>
              <input
                type="text"
                {...register("duration")}
                placeholder="12h 30m"
                className="w-full px-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Thumbnail
              </label>
              <div className="flex items-center gap-4">
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded border"
                  />
                )}
                <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 text-sm flex items-center gap-2">
                  <Upload size={16} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: CURRICULUM BUILDER --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Curriculum & Content
            </h2>
            <button
              type="button"
              onClick={addModule}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} /> Add Module
            </button>
          </div>

          <div className="space-y-4">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Module Header */}
                <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      {mod.isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const newModules = [...modules];
                        newModules.find((m) => m.id === mod.id)!.title =
                          e.target.value;
                        setModules(newModules);
                      }}
                      className="bg-transparent font-semibold text-gray-800 outline-none w-full md:w-1/3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => addLesson(mod.id)}
                      className="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Lesson
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteModule(mod.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Module Content (Lessons) */}
                {mod.isExpanded && (
                  <div className="p-4 space-y-4">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border-l-2 border-gray-300 pl-4 relative"
                      >
                        {/* Lesson Header */}
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <Video className="w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLessonTitle(
                                  mod.id,
                                  lesson.id,
                                  e.target.value,
                                )
                              }
                              className="text-sm text-gray-700 bg-transparent outline-none w-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteLesson(mod.id, lesson.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {/* EditorJS Instance (Active Lesson Only) */}
                        {mod.activeLessonId === lesson.id && (
                          <LessonEditor
                            data={lesson.content}
                            onSave={(data) =>
                              handleLessonContentSave(mod.id, lesson.id, data)
                            }
                            onCancel={() => {
                              const newModules = [...modules];
                              newModules.find(
                                (m) => m.id === mod.id,
                              )!.activeLessonId = null;
                              setModules(newModules);
                            }}
                          />
                        )}

                        {/* Edit Button (if not active) */}
                        {mod.activeLessonId !== lesson.id && (
                          <button
                            type="button"
                            onClick={() => {
                              const newModules = [...modules];
                              newModules.find(
                                (m) => m.id === mod.id,
                              )!.activeLessonId = lesson.id;
                              setModules(newModules);
                            }}
                            className="text-xs text-blue-600 hover:underline mt-1"
                          >
                            {lesson.content &&
                            lesson.content.blocks &&
                            lesson.content.blocks.length > 0
                              ? "Edit Content"
                              : "Add Content"}
                          </button>
                        )}
                      </div>
                    ))}
                    {mod.lessons.length === 0 && (
                      <p className="text-sm text-gray-400 pl-6 italic">
                        No lessons yet. Add one to start writing.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- SUBMIT BUTTON --- */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin">...</span>
            ) : (
              <>
                <Save size={20} /> Publish Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
