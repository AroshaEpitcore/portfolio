"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  minHeight?: number;
}

export function MarkdownEditor({ value, onChange, minHeight = 520 }: MarkdownEditorProps) {
  return (
    <div data-color-mode="auto">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        height={minHeight}
        preview="live"
        style={{ borderRadius: "0.75rem", overflow: "hidden" }}
      />
    </div>
  );
}
