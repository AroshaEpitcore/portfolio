"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Minus,
  Eye,
  Edit3,
  Columns,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
}

type ViewMode = "edit" | "preview" | "split";

const toolbar: {
  icon: React.ElementType;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}[] = [
  { icon: Bold,         label: "Bold",          prefix: "**",  suffix: "**" },
  { icon: Italic,       label: "Italic",        prefix: "_",   suffix: "_" },
  { icon: Heading1,     label: "Heading 1",     prefix: "# ",  suffix: "",  block: true },
  { icon: Heading2,     label: "Heading 2",     prefix: "## ", suffix: "",  block: true },
  { icon: Heading3,     label: "Heading 3",     prefix: "### ",suffix: "",  block: true },
  { icon: List,         label: "Bullet list",   prefix: "- ",  suffix: "",  block: true },
  { icon: ListOrdered,  label: "Ordered list",  prefix: "1. ", suffix: "",  block: true },
  { icon: Quote,        label: "Blockquote",    prefix: "> ",  suffix: "",  block: true },
  { icon: Code,         label: "Inline code",   prefix: "`",   suffix: "`" },
  { icon: Minus,        label: "Divider",       prefix: "\n---\n", suffix: "", block: true },
  { icon: Link,         label: "Link",          prefix: "[", suffix: "](url)" },
  { icon: Image,        label: "Image",         prefix: "![alt](", suffix: ")" },
];

function insertMarkdown(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string,
  block: boolean,
  value: string,
  onChange: (v: string) => void
) {
  const { selectionStart: start, selectionEnd: end } = textarea;
  const selected = value.slice(start, end);
  let insert: string;

  if (block) {
    insert = prefix + (selected || "text");
  } else {
    insert = prefix + (selected || "text") + suffix;
  }

  const next = value.slice(0, start) + insert + value.slice(end);
  onChange(next);

  // Restore cursor after React re-render
  setTimeout(() => {
    textarea.focus();
    const cursor = start + insert.length;
    textarea.setSelectionRange(cursor, cursor);
  }, 0);
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
  minHeight = 480,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<ViewMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5 flex-wrap">
        {toolbar.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            onClick={() => {
              if (textareaRef.current) {
                insertMarkdown(textareaRef.current, item.prefix, item.suffix, item.block ?? false, value, onChange);
              }
            }}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <item.icon className="h-3.5 w-3.5" />
          </button>
        ))}

        {/* Spacer */}
        <div className="ml-auto flex items-center gap-0.5 border-l border-border pl-2">
          {(["edit", "split", "preview"] as ViewMode[]).map((m) => (
            <button
              key={m}
              type="button"
              title={m === "edit" ? "Editor only" : m === "split" ? "Split view" : "Preview only"}
              onClick={() => setMode(m)}
              className={`flex h-7 items-center gap-1.5 rounded px-2 text-xs transition-colors ${
                mode === m
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              }`}
            >
              {m === "edit" ? <Edit3 className="h-3 w-3" /> : m === "split" ? <Columns className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              <span className="hidden sm:inline capitalize">{m}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex" style={{ minHeight }}>
        {/* Textarea */}
        {(mode === "edit" || mode === "split") && (
          <div className={`flex flex-col ${mode === "split" ? "w-1/2 border-r border-border" : "w-full"}`}>
            <div className="shrink-0 border-b border-border/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Markdown
            </div>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              style={{ minHeight: minHeight - 28 }}
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {(mode === "preview" || mode === "split") && (
          <div className={`flex flex-col ${mode === "split" ? "w-1/2" : "w-full"}`}>
            <div className="shrink-0 border-b border-border/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Preview
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {value ? (
                <div className="prose prose-sm dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:text-foreground
                  prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border
                  prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                  prose-hr:border-border prose-strong:text-foreground
                  prose-li:text-muted-foreground prose-ol:text-muted-foreground prose-ul:text-muted-foreground">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">Preview will appear here as you type…</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer: word count */}
      <div className="flex items-center justify-between border-t border-border/50 px-3 py-1.5 text-[10px] text-muted-foreground">
        <span>{value.split(/\s+/).filter(Boolean).length} words</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
}
