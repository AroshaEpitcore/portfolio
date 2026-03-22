"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";

// Use the same Markdown renderer as the admin editor preview
const MDPreview = dynamic(
  () => import("@uiw/react-md-editor").then((m) => m.default.Markdown),
  { ssr: false }
);

export function BlogContent({ content }: { content: string }) {
  return (
    <div data-color-mode="auto" className="wmde-markdown-var [&_.wmde-markdown]:bg-transparent [&_.wmde-markdown]:text-foreground [&_.w-md-editor-preview]:bg-transparent">
      <MDPreview source={content} />
    </div>
  );
}
