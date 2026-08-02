"use client";

import { useRef, useMemo, lazy } from "react";
import type { JoditEditorProps } from "jodit-react";

// Dynamic import for Jodit to avoid SSR issues
const JoditEditor = lazy(() => import("jodit-react"));

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  height?: number;
  onBlur?: (value: string) => void;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = "",
  readOnly = false,
  height = 400,
  onBlur,
}: RichTextEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const editorConfig: JoditEditorProps["config"] = useMemo(
    () => ({
      tabIndex: 1,
      readonly: readOnly,
      placeholder: placeholder || "Nhập nội dung...",
      language: "vi",
      height,
      enter: "p" as "p" | "div" | "br" | undefined,
      direction: "ltr" as "rtl" | "ltr" | "",
      defaultMode: 1,
      defaultLineHeight: 1.5,
      inline: false,
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
      },
      useNativeTooltip: true,
      showTooltip: true,
      showTooltipDelay: 0,
      statusbar: false,
      toolbarAdaptive: false,
      buttons:
        "bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,lineHeight,superscript,subscript,file,video,cut,copy,paste,selectall,copyformat,hr,table,link,symbols,indent,outdent,align,brush,undo,redo,find,source,fullsize,preview,print",
      disablePlugins: ["spellcheck"],
      textIcons: false,
      iframe: false,
      defaultActionOnPaste: "insert_as_html",
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      removeButtons: [],
      events: {
        afterInit: (editor: unknown) => {
          editorRef.current = editor;
        },
      },
    }),
    [readOnly, placeholder, height],
  );

  return (
    <div className={`rich-text-editor ${className}`}>
      <style jsx global>{`
        .jodit-container {
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-family: inherit;
        }

        .jodit-toolbar__box {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          border-radius: 6px 6px 0 0;
        }

        .jodit-workplace {
          border-radius: 0 0 6px 6px;
        }

        .jodit-wysiwyg {
          min-height: 200px;
          font-size: 14px;
          line-height: 1.6;
          padding: 12px;
        }

        .jodit-wysiwyg h1,
        .jodit-wysiwyg h2,
        .jodit-wysiwyg h3,
        .jodit-wysiwyg h4,
        .jodit-wysiwyg h5,
        .jodit-wysiwyg h6 {
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }

        .jodit-wysiwyg p {
          margin-bottom: 0.75em;
        }

        .jodit-wysiwyg ul,
        .jodit-wysiwyg ol {
          margin-bottom: 0.75em;
          padding-left: 1.5em;
        }

        .jodit-wysiwyg blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #64748b;
        }

        .jodit-wysiwyg code {
          background-color: #f1f5f9;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: "Monaco", "Consolas", "Courier New", monospace;
          font-size: 0.9em;
        }

        .jodit-wysiwyg pre {
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 1em;
          margin: 1em 0;
          overflow-x: auto;
        }

        .jodit-wysiwyg img {
          display: block !important;
          max-width: 100% !important;
          height: auto !important;
          border-radius: 6px;
          margin: 1em 0;
        }

        .jodit-wysiwyg a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .jodit-wysiwyg a:hover {
          color: #1d4ed8;
        }

        .jodit-wysiwyg table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }

        .jodit-wysiwyg table td,
        .jodit-wysiwyg table th {
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          min-width: 50px;
        }

        .jodit-wysiwyg table th {
          background-color: #f8fafc;
          font-weight: 600;
        }

        .jodit-wysiwyg table tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .jodit-wysiwyg table tr:hover {
          background-color: #f1f5f9;
        }

        .rich-text-editor {
          border-radius: 6px;
        }

        .jodit-placeholder {
          color: #94a3b8;
          font-style: normal;
        }
      `}</style>

      <JoditEditor
        ref={editorRef}
        value={value}
        config={editorConfig}
        onBlur={onBlur || ((newContent) => onChange(newContent))}
        onChange={() => {}}
      />
    </div>
  );
}

export default RichTextEditor;
