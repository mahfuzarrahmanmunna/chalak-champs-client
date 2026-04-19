"use client";

import React, { useState, useEffect, useRef } from "react";
import type { OutputData } from "@editorjs/editorjs";
import { Save } from "lucide-react";

const LessonEditor = ({
  data,
  onSave,
  onCancel,
}: {
  data: OutputData | undefined;
  onSave: (data: OutputData) => void;
  onCancel: () => void;
}) => {
  const editorRef = useRef<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let editor: any;

    const initEditor = async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const ImageTool = (await import("@editorjs/image")).default;
      const CodeTool = (await import("@editorjs/code")).default;
      const Delimiter = (await import("@editorjs/delimiter")).default;

      editor = new EditorJS({
        holder: "editorjs-container",
        placeholder: "Let's write an awesome lesson! Start with a header...",
        data: data || { blocks: [], time: Date.now(), version: "2.22.0" },
        tools: {
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
                byFile: "/api/upload/editor",
              },
              uploader: {
                uploadByFile(file: File) {
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
    };

    initEditor();

    return () => {
      if (editor && editor.destroy) {
        editor.destroy();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default LessonEditor;
