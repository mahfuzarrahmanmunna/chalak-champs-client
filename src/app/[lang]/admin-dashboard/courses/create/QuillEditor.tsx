"use client";

import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
// @ts-expect-error quill-better-table does not provide declarations for its stylesheet.
import "quill-better-table/dist/quill-better-table.css";
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

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) return;

    let isMounted = true;

    const initializeEditor = async () => {
      const { default: Quill } = await import("quill");
      const { default: quillBetterTable } = await import("quill-better-table");

      if (!editorRef.current || !isMounted) return;

      Quill.register("modules/betterTable", quillBetterTable, true);

      editorRef.current.innerHTML = "";

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

      const tableHandler = () => {
        const quill = quillRef.current;
        if (!quill) return;
        const tableModule = quill.getModule("betterTable");
        tableModule.insertTable(3, 3);
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
            ["table"],
            ["clean"],
          ],
          handlers: {
            image: imageHandler,
            table: tableHandler,
          },
        },
        betterTable: {
          operationMenu: {
            items: {
              unmergeCells: { text: "Unmerge cells" },
            },
          },
        },
        keyboard: {
          bindings: quillBetterTable.keyboardBindings,
        },
        clipboard: {
          matchVisual: false,
        },
      };

      const quill = new Quill(editorRef.current as HTMLElement, {
        theme: "snow",
        modules,
        placeholder,
      });

      quill.on("text-change", () => {
        if (isSettingHtml.current) return;
        onChangeRef.current(quill.root.innerHTML);
      });

      if (value) {
        isSettingHtml.current = true;
        quill.clipboard.dangerouslyPasteHTML(value);
        isSettingHtml.current = false;
      }

      if (isMounted) quillRef.current = quill;
    };

    initializeEditor();

    return () => {
      isMounted = false;
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    };
  }, [placeholder]);

  useEffect(() => {
    if (!quillRef.current) return;
    const html = quillRef.current.root.innerHTML;
    if (value === html) return;

    isSettingHtml.current = true;
    quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
    isSettingHtml.current = false;
  }, [value]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#F3056D]/20 focus-within:border-[#F3056D] transition-all">
      <style jsx global>{`
        .ql-editor {
          min-height: 300px;
          font-size: 16px;
          font-family: system-ui, sans-serif;
          color: #1f2937;
          padding: 1.25rem;
        }
        .ql-toolbar {
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        .ql-toolbar .ql-stroke {
          stroke: #4b5563 !important;
        }
        .ql-toolbar .ql-fill {
          fill: #4b5563 !important;
        }
        .ql-toolbar .ql-picker-label {
          color: #4b5563 !important;
        }
        .ql-toolbar button:hover .ql-stroke {
          stroke: #f3056d !important;
        }
        .ql-toolbar button:hover .ql-fill {
          fill: #f3056d !important;
        }
        .ql-toolbar .ql-active .ql-stroke {
          stroke: #f3056d !important;
        }
        .ql-toolbar .ql-active .ql-fill {
          fill: #f3056d !important;
        }
        .ql-toolbar .ql-active {
          color: #f3056d !important;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .ql-editor table {
          border-collapse: collapse;
          width: 100%;
        }
        .ql-editor td,
        .ql-editor th {
          border: 1px solid #e5e7eb;
          padding: 8px;
          min-width: 50px;
        }
      `}</style>
      <div ref={editorRef} />
    </div>
  );
}
