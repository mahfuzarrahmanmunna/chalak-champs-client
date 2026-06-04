// "use client";

// import React, { useState, useCallback, useRef, useEffect } from "react"; // Import useEffect
// import { createReactEditorJS } from "react-editor-js";

// // Import Tools
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import ImageTool from "@editorjs/image";
// import Table from "@editorjs/table";
// import Quote from "@editorjs/quote";
// import Code from "@editorjs/code";
// import Marker from "@editorjs/marker";
// import InlineCode from "@editorjs/inline-code";
// // @ts-ignore
// // import LinkTool from "@editorjs/link";

// const ReactEditorJS = createReactEditorJS();

// interface CourseEditorProps {
//   editorRef: React.MutableRefObject<any>;
//   placeholder?: string;
//   data?: any;
//   onEditorReady?: () => void;
// }

// export default function CourseEditor({
//   editorRef,
//   placeholder,
//   data,
//   onEditorReady,
// }: CourseEditorProps) {
//   const [holderId] = useState(
//     () => `editorjs-${Math.random().toString(36).substring(2, 9)}`,
//   );

//   const editorTools: any = {
//     header: {
//       class: Header,
//       config: { levels: [1, 2, 3, 4], defaultLevel: 2 },
//       shortcut: "CMD+SHIFT+H",
//     },
//     list: {
//       class: List,
//       inlineToolbar: true,
//       config: { defaultStyle: "unordered" },
//     },
//     image: {
//       class: ImageTool,
//       config: {
//         uploader: {
//           uploadByFile(file: File) {
//             return new Promise((resolve) => {
//               const reader = new FileReader();
//               reader.readAsDataURL(file);
//               reader.onload = () => {
//                 resolve({
//                   success: 1,
//                   file: { url: reader.result as string },
//                 });
//               };
//             });
//           },
//         },
//       },
//     },
//     table: {
//       class: Table as any,
//       inlineToolbar: true,
//       config: { rows: 2, cols: 3 },
//     },
//     quote: {
//       class: Quote,
//       inlineToolbar: true,
//       shortcut: "CMD+SHIFT+O",
//       config: {
//         quotePlaceholder: "Enter a quote",
//         captionPlaceholder: "Quote's author",
//       },
//     },
//     code: {
//       class: Code,
//       config: {
//         languages: {
//           javascript: "JavaScript",
//           html: "HTML",
//           css: "CSS",
//         },
//       },
//     },
//     marker: { class: Marker, shortcut: "CMD+SHIFT+M" },
//     inlineCode: { class: InlineCode, shortcut: "CMD+SHIFT+C" },
//   };

//   const handleReady = useCallback(
//     (instance: any) => {
//       if (instance) {
//         editorRef.current = instance;
//         // Optional: Wrap in timeout to ensure render cycle is complete
//         setTimeout(() => {
//             if (onEditorReady) onEditorReady();
//         }, 100);
//       }
//     },
//     [editorRef, onEditorReady],
//   );

//   // --- CRITICAL FIX: CLEANUP ---
//   // This ensures the editor is properly destroyed when the component unmounts
//   // (e.g., navigating away or Strict Mode remounting)
//   useEffect(() => {
//     return () => {
//       if (editorRef.current?.destroy) {
//         editorRef.current.destroy();
//         editorRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div className="border rounded-md bg-white shadow-sm">
//       <style>{`
//         .ce-code__content {
//           background-color: #1e1e1e;
//           color: #1a1211; /* Note: This text color is very dark on a dark background. You might want #ffffff */
//           padding: 16px;
//           border-radius: 6px;
//           font-family: 'Courier New', Courier, monospace;
//           font-size: 14px;
//           line-height: 1.5;
//           min-height: 60px;
//         }
//       `}</style>
//       <ReactEditorJS
//         holder={holderId}
//         tools={editorTools}
//         defaultValue={data}
//         placeholder={placeholder}
//         onReady={handleReady}
//       >
//         <div id={holderId} className="min-h-[300px] p-4" />
//       </ReactEditorJS>
//     </div>
//   );
// }

"use client";

import React, { useState, useCallback, useEffect } from "react";
import { createReactEditorJS } from "react-editor-js";

// Import only the basic Header tool for testing
import Header from "@editorjs/header";
import List from "@editorjs/list";

const ReactEditorJS = createReactEditorJS();

interface CourseEditorProps {
  editorRef: React.MutableRefObject<any>;
  placeholder?: string;
  data?: any;
  onEditorReady?: () => void;
}

export default function CourseEditor({
  editorRef,
  onEditorReady,
}: CourseEditorProps) {
  const [holderId] = useState(() => `editorjs-${Date.now()}`);

  // --- SAFE MODE CONFIGURATION ---
  // We removed Image, Table, Quote, Code, etc. to test if they are the cause.
  const editorTools: any = {
    header: {
      class: Header,
      config: { levels: [1, 2, 3], defaultLevel: 2 },
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
  };

  const handleReady = useCallback(
    (instance: any) => {
      console.log("Editor Ready Fired!"); // Debugging log
      if (instance) {
        editorRef.current = instance;
        if (onEditorReady) {
          onEditorReady();
        }
      }
    },
    [editorRef, onEditorReady],
  );

  useEffect(() => {
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="border rounded-md bg-white shadow-sm relative"
      style={{ minHeight: "300px" }}
    >
      {/* Critical: Ensure cursor is text and user can select */}
      <div className="pointer-events-auto user-select-auto">
        <ReactEditorJS
          holder={holderId}
          tools={editorTools}
          // Remove placeholder prop as it is not native to ReactEditorJS
          onReady={handleReady}
        >
          <div
            id={holderId}
            className="p-4 focus:outline-none"
            style={{ minHeight: "300px" }}
          />
        </ReactEditorJS>
      </div>
    </div>
  );
}