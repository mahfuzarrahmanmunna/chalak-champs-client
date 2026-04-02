"use client";

import React, { useRef } from "react";

// We might need to install the core editor types if not present,
// but 'any' is fine for practice.
import EditorJs from "react-editor-js";

// Import Tools
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Marker from "@editorjs/marker";
import SimpleImage from "@editorjs/simple-image";

const InputPage = () => {
  // Fix Error 5: Explicitly type the ref as 'any' to avoid implicit any errors
  const editorRef = useRef<any>(null);

  // 1. Define Tools
  const EDITOR_JS_TOOLS = {
    header: {
      class: Header,
      config: {
        placeholder: "Enter a header",
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 2,
      },
    },
    list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: "unordered",
      },
    },
    image: {
      class: SimpleImage,
      config: {},
    },
    code: CodeTool,
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: "Enter a quote",
        // Fix Error 6: Removed the apostrophe to avoid escaping issues in some TS configs
        captionPlaceholder: "Quotes author",
      },
    },
    marker: Marker,
    delimiter: Delimiter,
  };

  const initialData = {
    time: new Date().getTime(),
    blocks: [
      {
        type: "header",
        data: {
          text: "Hello! This is a practice page.",
          level: 2,
        },
      },
      {
        type: "paragraph",
        data: {
          text: "Try adding a list, an image, or some code below!",
        },
      },
    ],
  };

  const handleSave = async () => {
    if (editorRef.current) {
      const savedData = await editorRef.current.save();
      console.log("Saved Data:", savedData);
      alert("Check your console (F12) to see the JSON output!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editor.js Practice</h1>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save Data (Check Console)
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white">
        {/* 
           Fix Error 4: If TypeScript still complains that EditorJs is not a JSX component,
           we can cast it as 'any' temporarily for the sake of the exercise.
        */}
        <EditorJs
          instanceRef={(instance: any) => (editorRef.current = instance)}
          tools={EDITOR_JS_TOOLS}
          data={initialData}
          placeholder="Let`s write some awesome story!"
        />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>
            Click the &quot;Tab&quot; button or the &quot;+&quot; in the top left to
            see tools.
          </li>
          <li>
            Try uploading an image (it will convert to base64 for this demo).
          </li>
          <li>Highlight text to see the Marker or Inline Code options.</li>
          <li>
            Click &quot;Save Data&quot; to see the JSON object in the browser console.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InputPage;
