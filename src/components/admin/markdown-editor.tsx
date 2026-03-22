"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  { icon: Bold,        label: "Bold",         prefix: "**",    suffix: "**" },
  { icon: Italic,      label: "Italic",       prefix: "_",     suffix: "_" },
  { icon: Heading1,    label: "Heading 1",    prefix: "# ",    suffix: "", block: true },
  { icon: Heading2,    label: "Heading 2",    prefix: "## ",   suffix: "", block: true },
  { icon: Heading3,    label: "Heading 3",    prefix: "### ",  suffix: "", block: true },
  { icon: List,        label: "Bullet list",  prefix: "- ",    suffix: "", block: true },
  { icon: ListOrdered, label: "Ordered list", prefix: "1. ",   suffix: "", block: true },
  { icon: Quote,       label: "Blockquote",   prefix: "> ",    suffix: "", block: true },
  { icon: Code,        label: "Inline code",  prefix: "`",     suffix: "`" },
  { icon: Minus,       label: "Divider",      prefix: "\n---\n", suffix: "", block: true },
  { icon: Link,        label: "Link",         prefix: "[",     suffix: "](url)" },
  { icon: Image,       label: "Image",        prefix: "![alt](", suffix: ")" },
];

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
  minHeight = 480,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<ViewMode>("split");
  const [preview, setPreview] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Track whether the textarea is being edited (to avoid overwriting cursor)
  const isEditingRef = useRef(false);

  // Sync external value into the uncontrolled textarea (e.g. when loading saved post)
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta || isEditingRef.current) return;
    if (ta.value !== value) {
      ta.value = value;
      setPreview(value);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setPreview(v);
    onChange(v);
  }, [onChange]);

  // Tab key → insert 2 spaces instead of moving focus
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = ta;
    const spaces = "  ";
    const next = ta.value.slice(0, s) + spaces + ta.value.slice(end);
    ta.value = next;
    ta.setSelectionRange(s + spaces.length, s + spaces.length);
    setPreview(next);
    onChange(next);
  }, [onChange]);

  const insertMarkdown = useCallback((prefix: string, suffix: string, block: boolean) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = ta.value.slice(s, e);
    const insert = block
      ? prefix + (selected || "text")
      : prefix + (selected || "text") + suffix;
    const next = ta.value.slice(0, s) + insert + ta.value.slice(e);
    // Update DOM directly (uncontrolled)
    ta.value = next;
    const cursor = s + insert.length;
    ta.setSelectionRange(cursor, cursor);
    ta.focus();
    setPreview(next);
    onChange(next);
  }, [onChange]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
        {toolbar.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            onMouseDown={(e) => {
              // Prevent blur before insert runs
              e.preventDefault();
              insertMarkdown(item.prefix, item.suffix, item.block ?? false);
            }}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <item.icon className="h-3.5 w-3.5" />
          </button>
        ))}

        {/* View mode toggles */}
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
        {/* Textarea — uncontrolled, no value prop */}
        {(mode === "edit" || mode === "split") && (
          <div className={`flex flex-col ${mode === "split" ? "w-1/2 border-r border-border" : "w-full"}`}>
            <div className="shrink-0 border-b border-border/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Markdown
            </div>
            <textarea
              ref={textareaRef}
              defaultValue={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => { isEditingRef.current = true; }}
              onBlur={() => { isEditingRef.current = false; }}
              placeholder={placeholder}
              className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              style={{ minHeight: minHeight - 28, tabSize: 2 }}
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
              {preview ? (
                <div className="prose prose-sm dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:text-foreground
                  prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border
                  prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                  prose-hr:border-border prose-strong:text-foreground
                  prose-li:text-muted-foreground prose-ol:text-muted-foreground prose-ul:text-muted-foreground">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{preview}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground/50">Preview will appear here as you type…</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/50 px-3 py-1.5 text-[10px] text-muted-foreground">
        <span>{preview.split(/\s+/).filter(Boolean).length} words</span>
        <span>{preview.length} characters</span>
      </div>
    </div>
  );
}
