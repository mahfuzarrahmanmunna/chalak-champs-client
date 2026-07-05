"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Plus, Loader2, BookOpen, Clock, Upload, Trash2 } from "lucide-react";
import QuillEditor from "../create/QuillEditor";
// import QuillEditor from "./QuillEditor";

// --- TYPES ---

interface BilingualText {
  en: string;
  bn: string;
}

interface QuestionData {
  id: string;
  type: "mcq" | "fill-blank" | "short-answer";
  text: BilingualText;
  options?: { en: string; bn: string }[];
  correctAnswer: string;
  marks: number;
}

interface ExamFormData {
  title: BilingualText;
  description: BilingualText;
  duration: number;
  passingMarks: number;
  negativeMarking: number;
  isProctored: boolean;
  thumbnail?: FileList;
  questions: QuestionData[];
}

const ManageExam = () => {
  const queryClient = useQueryClient();

  // --- FETCH EXAMS ---
  const { data, isLoading } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await axios.get("/api/exam");
      return response.data;
    },
  });

  // --- CREATE EXAM MUTATION ---
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/api/exam", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      alert("Exam Created Successfully!");
      reset();
    },
    onError: (err: any) => {
      console.error(err);
      alert(
        "Error creating exam: " + (err.response?.data?.message || err.message),
      );
    },
  });

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExamFormData>({
    defaultValues: {
      title: { en: "", bn: "" },
      description: { en: "", bn: "" },
      duration: 60,
      passingMarks: 50,
      negativeMarking: 0,
      isProctored: true,
      questions: [
        {
          id: "q1",
          type: "mcq",
          text: { en: "", bn: "" },
          options: Array(4).fill({ en: "", bn: "" }),
          correctAnswer: "",
          marks: 1,
        },
      ],
    },
  });

  // --- FIELD ARRAY FOR QUESTIONS ---
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedQuestions = watch("questions");

  // --- ON SUBMIT ---
  const onSubmit = async (data: ExamFormData) => {
    try {
      const formData = new FormData();

      // Basic Metadata
      formData.append("title", JSON.stringify(data.title));
      formData.append("description", JSON.stringify(data.description));
      formData.append("duration", data.duration.toString());
      formData.append("passingMarks", data.passingMarks.toString());
      formData.append("negativeMarking", data.negativeMarking.toString());
      formData.append("isProctored", data.isProctored.toString());

      // Handle File Upload
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      // Transform Questions
      const questionsPayload = data.questions.map((q) => {
        const isMcq = q.type === "mcq";
        return {
          type: q.type,
          text: q.text,
          marks: q.marks,
          correctAnswer: q.correctAnswer,
          options: isMcq
            ? q.options?.map((opt: any) => opt.en || "")
            : undefined,
        };
      });

      formData.append("questions", JSON.stringify(questionsPayload));

      mutation.mutate(formData);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  // --- HELPER: Add New Question ---
  const handleAddQuestion = () => {
    appendQuestion({
      id: `q${Date.now()}`,
      type: "mcq",
      text: { en: "", bn: "" },
      options: Array(4).fill({ en: "", bn: "" }),
      correctAnswer: "",
      marks: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- PAGE HEADER --- */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Exam Management
            </h1>
            <p className="text-gray-500">
              Create exams and manage your question bank.
            </p>
          </div>
        </div>

        {/* --- CREATE EXAM FORM --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Create New Exam
            </h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* SECTION 1: EXAM CONFIGURATION */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                  1. Exam Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Exam Title (EN)
                    </label>
                    <input
                      {...register("title.en", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter Exam Title"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      পরীক্ষার শিরোনাম (BN)
                    </label>
                    <input
                      {...register("title.bn", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="পরীক্ষার নাম লিখুন"
                      lang="bn"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      <Clock className="inline w-4 h-4 mr-1" /> Duration (Mins)
                    </label>
                    <input
                      type="number"
                      {...register("duration", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="60"
                    />
                  </div>

                  {/* Passing Marks */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Passing Marks
                    </label>
                    <input
                      type="number"
                      {...register("passingMarks", { required: true })}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="50"
                    />
                  </div>

                  {/* Negative Marking */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">
                      Negative Marking
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      {...register("negativeMarking")}
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="0.25"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Proctoring Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isProctored")}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">
                      Enable AI Proctoring
                    </span>
                  </label>

                  {/* Thumbnail */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail (Optional)
                    </label>
                    <input
                      type="file"
                      {...register("thumbnail")}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2: EXAM INSTRUCTIONS (Quill Editor) */}
              <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">
                  2. Exam Instructions
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-blue-700 flex items-center gap-2">
                      English Instructions
                    </label>
                    <Controller
                      name="description.en"
                      control={control}
                      render={({ field }) => (
                        <QuillEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="e.g. Do not use a calculator."
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-green-700 flex items-center gap-2">
                      বাংলা নির্দেশনা
                    </label>
                    <Controller
                      name="description.bn"
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
              </section>

              {/* SECTION 3: QUESTIONS BUILDER */}
              <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    3. Questions
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {questionFields.map((item, index) => {
                    const questionType = watch(`questions.${index}.type`);
                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative group"
                      >
                        {/* Header / Type Selector */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-4 items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                              Q{index + 1}
                            </span>
                            <select
                              {...register(`questions.${index}.type`)}
                              className="border border-gray-300 rounded-md text-sm p-1 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              <option value="mcq">MCQ</option>
                              <option value="fill-blank">
                                Fill in the Blank
                              </option>
                              <option value="short-answer">Short Answer</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Question Text (Bilingual) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-xs text-gray-500 font-bold mb-1 block">
                              Question (EN)
                            </label>
                            <input
                              {...register(`questions.${index}.text.en`)}
                              className="w-full border border-gray-300 p-2 rounded-md text-sm text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              placeholder="Type question..."
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-bold mb-1 block">
                              প্রশ্ন (BN)
                            </label>
                            <input
                              {...register(`questions.${index}.text.bn`)}
                              className="w-full border border-gray-300 p-2 rounded-md text-sm text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              placeholder="বাংলায় লিখুন..."
                            />
                          </div>
                        </div>

                        {/* Question Options (MCQ Only) */}
                        {questionType === "mcq" && (
                          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <label className="text-xs font-bold text-gray-500 block">
                              Options (Select Correct One below)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[0, 1, 2, 3].map((optIdx) => (
                                <div
                                  key={optIdx}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                  <input
                                    {...register(
                                      `questions.${index}.options.${optIdx}.en`,
                                    )}
                                    className="flex-1 text-sm border border-gray-300 p-1.5 rounded text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Correct Answer */}
                        <div className="mt-4 pt-4 border-t">
                          <label className="text-sm font-bold text-green-700 block mb-2">
                            Correct Answer:
                          </label>
                          {questionType === "mcq" ? (
                            <select
                              {...register(`questions.${index}.correctAnswer`)}
                              className="w-full md:w-1/2 border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                              <option value="">Select Option</option>
                              <option value="0">Option A</option>
                              <option value="1">Option B</option>
                              <option value="2">Option C</option>
                              <option value="3">Option D</option>
                            </select>
                          ) : (
                            <input
                              {...register(`questions.${index}.correctAnswer`)}
                              className="w-full md:w-1/2 border border-gray-300 rounded-md p-2 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              placeholder="Type correct answer..."
                            />
                          )}
                        </div>

                        {/* Marks */}
                        <div className="mt-2">
                          <label className="text-xs text-gray-500">
                            Marks:
                          </label>
                          <input
                            type="number"
                            {...register(`questions.${index}.marks`)}
                            className="w-20 border p-1 rounded text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            defaultValue={1}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SUBMIT BUTTON */}
              <div className="pt-6 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={mutation.isPending}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition ${
                    mutation.isPending
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  }`}
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {mutation.isPending ? "Creating..." : "Create Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- EXAMS LIST SECTION --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Existing Exams
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data?.data?.map((exam: any) => (
                <div
                  key={exam._id}
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  {exam.thumbnail && (
                    <img
                      src={exam.thumbnail}
                      alt={exam.title?.en}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                      {exam.title?.en || exam.title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{exam.duration}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passing:</span>
                        <span className="font-medium">{exam.passingMarks}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          exam.isProctored
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {exam.isProctored ? "Proctored" : "Open"}
                      </span>
                      <button className="text-blue-600 font-bold text-sm hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {data?.data?.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400">
                  No exams found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageExam;
