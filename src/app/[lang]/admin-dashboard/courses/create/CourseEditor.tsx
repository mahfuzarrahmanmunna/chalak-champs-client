"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { createReactEditorJS } from "react-editor-js";
import Header from "@editorjs/header";
import List from "@editorjs/list";

const ReactEditorJS = createReactEditorJS();

interface CourseEditorProps {
  editorRef: React.MutableRefObject<any>;
  placeholder?: string;
  data?: any;
  onEditorReady?: () => void;
  onEditorDestroy?: () => void;
}

export default function CourseEditor({
  editorRef,
  onEditorReady,
  onEditorDestroy,
}: CourseEditorProps) {
  const [holderId] = useState(
    () => `editorjs-${Math.random().toString(36).slice(2, 9)}`,
  );

  const onReadyRef = useRef(onEditorReady);
  const onDestroyRef = useRef(onEditorDestroy);
  onReadyRef.current = onEditorReady;
  onDestroyRef.current = onEditorDestroy;

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
      if (instance) {
        editorRef.current = instance;
        onReadyRef.current?.();
      }
    },
    [editorRef],
  );

  useEffect(() => {
    return () => {
      onDestroyRef.current?.();
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [editorRef]);

  return (
    <div
      className="border rounded-md bg-white shadow-sm relative"
      style={{ minHeight: "300px" }}
    >
      <ReactEditorJS holder={holderId} tools={editorTools} onReady={handleReady}>
        <div
          id={holderId}
          className="p-4 focus:outline-none"
          style={{ minHeight: "300px" }}
        />
      </ReactEditorJS>
    </div>
  );
}
