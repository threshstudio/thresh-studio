"use client"

import React, { useState, useEffect } from "react"
import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  UploadCloud,
  Undo,
  Redo,
  RemoveFormatting,
  Loader2,
} from "lucide-react"

interface EditorToolbarProps {
  editor: Editor
  isUploadingImage: boolean
  onOpenUploadDialog: () => void
  onOpenImageUrlModal: () => void
  onOpenLinkModal: () => void
}

export function EditorToolbar({
  editor,
  isUploadingImage,
  onOpenUploadDialog,
  onOpenImageUrlModal,
  onOpenLinkModal,
}: EditorToolbarProps) {
  // Force toolbar re-render on editor transaction/selection updates so active states stay in sync
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!editor) return
    const update = () => setTick((t) => t + 1)
    editor.on("transaction", update)
    editor.on("selectionUpdate", update)
    return () => {
      editor.off("transaction", update)
      editor.off("selectionUpdate", update)
    }
  }, [editor])

  const isLinkActive = editor.isActive("link")

  const toggleHeading = (level: 1 | 2 | 3) => {
    if (editor.isActive("heading", { level })) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().clearNodes().toggleHeading({ level }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-800 bg-neutral-900/80 p-2 backdrop-blur-md">
      {/* Headings */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleHeading(1)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("heading", { level: 1 })
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleHeading(2)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("heading", { level: 2 })
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleHeading(3)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("heading", { level: 3 })
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-[1px] bg-neutral-800" />

      {/* Formatting */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("bold")
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("italic")
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("strike")
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-[1px] bg-neutral-800" />

      {/* Lists & Quotes */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("bulletList")
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("orderedList")
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          editor.isActive("blockquote")
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        title="Horizontal Rule"
      >
        <Minus className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-[1px] bg-neutral-800" />

      {/* Link Actions */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onOpenLinkModal}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
          isLinkActive
            ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
        }`}
        title={isLinkActive ? "Edit Link" : "Insert Link"}
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      {isLinkActive && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-red-400"
          title="Remove Link"
        >
          <Unlink className="h-4 w-4" />
        </button>
      )}

      <div className="mx-1 h-5 w-[1px] bg-neutral-800" />

      {/* Image Actions (Cloudinary upload & URL) */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onOpenUploadDialog}
        disabled={isUploadingImage}
        className="flex items-center gap-1.5 rounded-lg border border-neutral-700/80 bg-neutral-800/60 px-2.5 py-1 text-xs font-medium text-neutral-200 transition-all hover:border-brand-400 hover:bg-neutral-800 hover:text-brand-300 disabled:opacity-50"
        title="Upload Image via Cloudinary"
      >
        {isUploadingImage ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-300" />
        ) : (
          <UploadCloud className="h-3.5 w-3.5" />
        )}
        <span>Upload Image</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onOpenImageUrlModal}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        title="Insert Image by URL"
      >
        <ImageIcon className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-[1px] bg-neutral-800" />

      {/* Undo/Redo & Clean */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-30"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-30"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-amber-400"
        title="Clear Formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </button>
    </div>
  )
}
