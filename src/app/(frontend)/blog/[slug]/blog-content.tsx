"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export function BlogContent({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none
      prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
      prose-p:leading-relaxed prose-p:text-muted-foreground
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-foreground
      prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-foreground
      prose-pre:rounded-xl prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border prose-pre:p-0
      prose-pre:overflow-x-auto
      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-blockquote:not-italic
      prose-li:text-muted-foreground
      prose-table:border-collapse prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2
      prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
      prose-img:rounded-xl prose-img:shadow-md
      prose-hr:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
