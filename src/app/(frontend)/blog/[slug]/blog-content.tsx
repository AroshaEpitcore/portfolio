"use client";

import ReactMarkdown from "react-markdown";

export function BlogContent({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none
      prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
      prose-p:leading-relaxed prose-p:text-muted-foreground
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-foreground
      prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono
      prose-pre:rounded-xl prose-pre:bg-muted prose-pre:border prose-pre:border-border
      prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
      prose-li:text-muted-foreground
      prose-img:rounded-xl prose-img:shadow-md">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
