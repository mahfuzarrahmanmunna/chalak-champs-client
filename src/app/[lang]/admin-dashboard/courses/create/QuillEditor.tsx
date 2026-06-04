"use client";

import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import type { Quill as QuillType } from "quill";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = "Type content here...",
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);
  const isSettingHtml = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeEditor = async () => {
      if (!editorRef.current) return;

      const { default: Quill } = await import("quill");

      // Re-check ref after async import in case component unmounted
      if (!editorRef.current) return;

      const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = () => {
          const file = input.files?.[0];
          if (!file || !quillRef.current) return;

          const reader = new FileReader();
          reader.onload = () => {
            const quill = quillRef.current;
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, "image", reader.result);
              quill.setSelection(range.index + 1);
            }
          };
          reader.readAsDataURL(file);
        };
      };

      const modules = {
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["code-block"],
            ["clean"],
          ],
          handlers: {
            image: imageHandler,
          },
        },
        clipboard: {
          matchVisual: false,
        },
      };

      let quill: QuillType;
      try {
        quill = new Quill(editorRef.current as HTMLElement, {
          theme: "snow",
          modules,
          placeholder,
        });
      } catch (err) {
        console.error("Failed to initialize Quill:", err);
        return;
      }

      quill.on("text-change", () => {
        if (isSettingHtml.current) return;
        onChange(quill.root.innerHTML);
      });

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      if (isMounted) quillRef.current = quill;
    };

    initializeEditor();

    return () => {
      isMounted = false;
      quillRef.current = null;
    };
  }, [onChange, placeholder]);

  useEffect(() => {
    if (!quillRef.current) return;
    const html = quillRef.current.root.innerHTML;
    if (value === html) return;

    isSettingHtml.current = true;
    quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
    isSettingHtml.current = false;
  }, [value]);

  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
      <style jsx global>{`
        .ql-editor {
          min-height: 300px;
          font-size: 16px;
          font-family: sans-serif;
        }
        .ql-toolbar {
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
      `}</style>
      <div ref={editorRef} />
    </div>
  );
}
