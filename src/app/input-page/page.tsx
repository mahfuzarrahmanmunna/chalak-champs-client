"use client";

import React, { useEffect, useRef } from "react";

// Core
import EditorJS from "@editorjs/editorjs";

// Tools (Stable versions)
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import SimpleImage from "@editorjs/simple-image";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Marker from "@editorjs/marker";

// ==========================================
// 1. TYPESCRIPT-SAFE CUSTOM FONT TOOL
// ==========================================
class FontFamilyTool {
  // 1. Declare properties to fix TS errors
  button!: HTMLButtonElement;
  state: boolean = false;
  selection: Selection | null = null;

  static get isInline() {
    return true;
  }

  static get title() {
    return "Serif Font";
  }

  static get toolbox() {
    return {
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>',
      title: "Change to Serif Font",
    };
  }

  render() {
    this.button = document.createElement("button");
    this.button.classList.add("ce-inline-tool");
    this.button.type = "button";

    // Use static reference to avoid TS error
    this.button.innerHTML = FontFamilyTool.toolbox.icon;
    this.button.title = FontFamilyTool.toolbox.title;

    // Style the button
    this.button.style.fontFamily = "serif";
    this.button.style.fontWeight = "bold";

    return this.button;
  }

  surround(range: Range) {
    if (!this.state) {
      // Apply Font
      const span = document.createElement("span");
      span.style.fontFamily = "Georgia, 'Times New Roman', Times, serif";
      span.style.fontSize = "1.1em";
      span.className = "custom-serif-font";

      try {
        range.surroundContents(span);
      } catch (e) {
        console.error("Range error (try selecting text inside one block):", e);
      }
    } else {
      // Remove Font (unwrap)
      if (this.selection) {
        const content = this.selection.getRangeAt(0).extractContents();
        this.selection.getRangeAt(0).deleteContents();
        this.selection.getRangeAt(0).insertNode(content);
      }
    }
  }

  checkState(selection: Selection) {
    const anchor = selection.anchorNode;
    if (!anchor) return;

    const parentElement = anchor.parentElement;
    // Check if the current node has our custom class
    this.state = parentElement?.closest(".custom-serif-font") !== null;

    if (this.state) {
      this.button.style.background = "#ffd700"; // Gold when active
      this.button.style.color = "#000";
    } else {
      this.button.style.background = "transparent";
      this.button.style.color = "inherit";
    }
  }

  save() {
    this.selection = window.getSelection();
  }

  clear() {
    this.state = false;
    this.button.style.background = "transparent";
  }
}

const Editor = () => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderId = "editorjs-tsafe-container";

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: holderId,
        tools: {
          header: {
            class: Header as any,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
          },

          // Custom Font Tool
          fontFamily: {
            class: FontFamilyTool as any,
          },

          list: {
            class: List as any,
            inlineToolbar: true,
          },

          image: {
            class: SimpleImage as any,
            config: {
              placeholder: "Paste image URL here...",
            },
          },

          quote: {
            class: Quote as any,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+O",
          },

          delimiter: Delimiter as any,

          marker: {
            class: Marker as any,
            config: { color: "#ffd700" },
          },

          code: {
            class: CodeTool as any,
          },
        },

        inlineToolbar: ["bold", "italic", "link", "marker", "fontFamily"],

        data: {
          blocks: [
            {
              type: "header",
              data: { text: "TypeScript Safe Editor", level: 1 },
            },
            {
              type: "paragraph",
              data: {
                text: "Select this text to see the Font tool (Icon: F) in the floating menu. It works with TypeScript now!",
              },
            },
            {
              type: "image",
              data: {
                url: "https://picsum.photos/seed/ts/800/400.jpg",
                caption: "Drag and drop an image here!",
              },
            },
          ],
        },

        placeholder: "Start typing...",
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();
        console.log("Article Data: ", outputData);
        alert("Saved! Check console for JSON.");
      } catch (error) {
        console.error("Saving failed: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#4169e1]">
        {/* Header Area */}
        <div className="bg-[#4169e1] p-6 flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Pro Editor</h1>
            <p className="text-[#ffd700] text-sm font-medium">
              Drag & Drop Images • Custom Fonts
            </p>
          </div>

          <button
            onClick={handleSave}
            className="bg-[#ff69b4] hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
          >
            Save Content
          </button>
        </div>

        {/* Editor Area */}
        <div className="p-8 md:p-12">
          <div
            id={holderId}
            className="min-h-[500px] prose prose-lg max-w-none focus:outline-none"
          ></div>
        </div>

        {/* Footer Area */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <span>
            Status: <span className="text-[#4169e1]">Ready</span>
          </span>
          <div className="flex space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#ff69b4]"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-[#4169e1]"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-[#ffd700]"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
