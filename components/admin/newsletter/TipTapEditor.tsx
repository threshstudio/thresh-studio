"use client"

import React, { useRef, useState, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { toast } from "sonner"
import { uploadToCloudinary } from "@/lib/uploadToCloudinary"
import { EditorToolbar } from "./EditorToolbar"
import { LinkModal } from "./LinkModal"
import { ImageUrlModal } from "./ImageUrlModal"
import { ImageUploadPreviewModal } from "./ImageUploadPreviewModal"

interface TipTapEditorProps {
  content?: string
  onChange: (html: string, json: Record<string, unknown>) => void
  placeholder?: string
}

export function TipTapEditor({ content = "", onChange }: TipTapEditorProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isImageUrlModalOpen, setIsImageUrlModalOpen] = useState(false)
  const [selectedFileForUpload, setSelectedFileForUpload] =
    useState<File | null>(null)
  const [isUploadPreviewModalOpen, setIsUploadPreviewModalOpen] =
    useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-brand-300 underline font-medium hover:text-brand-200 transition-colors",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class:
            "rounded-xl border border-neutral-700/80 my-4 max-w-full h-auto shadow-md block",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[300px] text-neutral-200 leading-relaxed font-sans",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON() as Record<string, unknown>)
    },
  })

  // Triggered when user selects a file from dialog or drop
  const handleSelectFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.")
      return
    }

    setSelectedFileForUpload(file)
    setIsUploadPreviewModalOpen(true)
  }, [])

  // Confirmed upload from preview modal
  const handleConfirmUpload = useCallback(
    async (file: File, altText?: string) => {
      setIsUploadingImage(true)
      const toastId = toast.loading("Uploading image to Cloudinary...")

      try {
        const url = await uploadToCloudinary(file)
        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({ src: url, alt: altText || undefined })
            .run()
          toast.success("Image added to newsletter!", { id: toastId })
        }
        setIsUploadPreviewModalOpen(false)
        setSelectedFileForUpload(null)
      } catch (err) {
        console.error("[IMAGE_UPLOAD_ERROR]", err)
        toast.error("Failed to upload image. Please try again.", {
          id: toastId,
        })
      } finally {
        setIsUploadingImage(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    },
    [editor]
  )

  const handleClosePreviewModal = () => {
    if (isUploadingImage) return
    setIsUploadPreviewModalOpen(false)
    setSelectedFileForUpload(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleSelectFile(file)
  }

  // Handle Drag & Drop of images directly onto the editor
  const handleDrop = (e: React.DragEvent) => {
    const files = e.dataTransfer.files
    if (files && files.length > 0 && files[0].type.startsWith("image/")) {
      e.preventDefault()
      handleSelectFile(files[0])
    }
  }

  if (!editor) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950/40">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/70 shadow-xl transition-colors focus-within:border-brand-500/40"
      onDrop={handleDrop}
    >
      {/* Hidden file input for Cloudinary upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Editor Toolbar */}
      <EditorToolbar
        editor={editor}
        isUploadingImage={isUploadingImage}
        onOpenUploadDialog={() => fileInputRef.current?.click()}
        onOpenImageUrlModal={() => setIsImageUrlModalOpen(true)}
        onOpenLinkModal={() => setIsLinkModalOpen(true)}
      />

      {/* Editable Area */}
      <div
        onClick={() => editor.chain().focus().run()}
        className="relative min-h-[350px] cursor-text p-6 text-neutral-100"
      >
        <EditorContent editor={editor} />
      </div>

      {/* Modals for Link and Image URL */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        initialUrl={editor.getAttributes("link").href || ""}
        onSave={(url) => {
          if (url) {
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run()
          } else {
            editor.chain().focus().unsetLink().run()
          }
        }}
      />

      <ImageUrlModal
        isOpen={isImageUrlModalOpen}
        onClose={() => setIsImageUrlModalOpen(false)}
        onSave={(url) => {
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }}
      />

      <ImageUploadPreviewModal
        isOpen={isUploadPreviewModalOpen}
        file={selectedFileForUpload}
        isUploading={isUploadingImage}
        onClose={handleClosePreviewModal}
        onConfirmUpload={handleConfirmUpload}
      />
    </div>
  )
}
