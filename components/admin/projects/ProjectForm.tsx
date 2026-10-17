"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { projectFormSchema, ProjectFormValues } from "@/lib/schemas"
import { uploadToCloudinary } from "@/lib/uploadToCloudinary"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/ui/file-upload"
import { MultiFileUpload } from "@/components/ui/multi-file-upload"
import { ProjectStatsSection } from "./ProjectStatsSection"
import { ProjectStorySection } from "./ProjectStorySection"

export function ProjectForm({
  initialData,
}: {
  initialData?: Partial<ProjectFormValues> & { id?: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [heroVideoFile, setHeroVideoFile] = useState<File | string | null>(
    initialData?.videoUrl || null
  )
  const [galleryFiles, setGalleryFiles] = useState<(File | string)[]>(
    initialData?.gallery || []
  )

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      category: initialData?.category || "",
      year: initialData?.year || new Date().getFullYear().toString(),
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      tagline: initialData?.tagline || "",
      videoUrl: initialData?.videoUrl || "",
      stats: initialData?.stats || [],
      description: initialData?.description || "",
      services: initialData?.services || [],
      deliverables: initialData?.deliverables || [],
      challenge: initialData?.challenge || "",
      approach: initialData?.approach || "",
      gallery: initialData?.gallery || [],
      outcome: initialData?.outcome || "",
      isPublished: initialData?.isPublished || false,
      order: initialData?.order || 0,
    },
  })

  const onSubmit = async (data: ProjectFormValues) => {
    if (!heroVideoFile) {
      toast.error("Please upload a Hero Video")
      return
    }

    setIsSubmitting(true)

    try {
      let finalVideoUrl = heroVideoFile as string
      if (heroVideoFile instanceof File) {
        finalVideoUrl = await uploadToCloudinary(
          heroVideoFile,
          "thresh-studio/projects"
        )
      }
      data.videoUrl = finalVideoUrl

      // Controlled Concurrency batch upload
      const finalGalleryUrls: string[] = []
      const CONCURRENCY_LIMIT = 3

      for (let i = 0; i < galleryFiles.length; i += CONCURRENCY_LIMIT) {
        const batch = galleryFiles.slice(i, i + CONCURRENCY_LIMIT)

        const batchResults = await Promise.all(
          batch.map(async (fileOrUrl) => {
            if (fileOrUrl instanceof File) {
              return await uploadToCloudinary(
                fileOrUrl,
                "thresh-studio/projects"
              )
            }
            return fileOrUrl as string
          })
        )

        finalGalleryUrls.push(...batchResults)
      }

      data.gallery = finalGalleryUrls

      const endpoint = initialData
        ? `/api/admin/projects/${initialData.id}`
        : "/api/admin/projects"
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to save project")

      toast.success(
        `Project ${initialData ? "updated" : "created"} successfully`
      )
      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-5xl space-y-12"
    >
      {/* ── 1. HERO ────────────────────────── */}
      <section className="space-y-6">
        <h3 className="border-b border-neutral-800 pb-2 text-xl font-bold tracking-tight text-white">
          1. Hero Section
        </h3>

        <div className="mb-8">
          <FieldLabel isRequired className="mb-3 block text-sm">
            Hero Video (Cloudinary)
          </FieldLabel>
          <FileUpload
            value={heroVideoFile}
            onChange={setHeroVideoFile}
            accept="video/*"
            maxSize={50 * 1024 * 1024} // 50MB
            description="Upload the main cinematic background video for this project (Max 50MB)."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel isRequired>Title</FieldLabel>
            <Input {...form.register("title")} placeholder="e.g. Lumina Edge" />
            <FieldError
              errors={[
                form.formState.errors.title as unknown as { message?: string },
              ]}
            />
          </Field>
          <Field>
            <FieldLabel isRequired>Category</FieldLabel>
            <select
              {...form.register("category")}
              className="h-11 w-full rounded-lg border border-input bg-transparent px-4 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            >
              <option
                value=""
                disabled
                className="bg-neutral-900 text-neutral-500"
              >
                Select a category...
              </option>
              <option
                value="Product Branding"
                className="bg-neutral-900 text-white"
              >
                Product Branding
              </option>
              <option
                value="Marketing Video"
                className="bg-neutral-900 text-white"
              >
                Marketing Video
              </option>
              <option value="3D Motion" className="bg-neutral-900 text-white">
                3D Motion
              </option>
              <option value="UGC Video" className="bg-neutral-900 text-white">
                UGC Video
              </option>
            </select>
            <FieldError
              errors={[
                form.formState.errors.category as unknown as {
                  message?: string
                },
              ]}
            />
          </Field>
          <Field>
            <FieldLabel isRequired>Year</FieldLabel>
            <Input {...form.register("year")} placeholder="e.g. 2024" />
            <FieldError
              errors={[
                form.formState.errors.year as unknown as { message?: string },
              ]}
            />
          </Field>
          <Field className="md:col-span-2">
            <FieldLabel isRequired>Tagline</FieldLabel>
            <Input
              {...form.register("tagline")}
              placeholder="Short description for the hero..."
            />
            <FieldError
              errors={[
                form.formState.errors.tagline as unknown as {
                  message?: string
                },
              ]}
            />
          </Field>
        </div>
      </section>

      {/* ── 2. STATS ────────────────────────── */}
      <ProjectStatsSection form={form} />

      {/* ── 3, 4, 6. STORY SECTIONS ─────────── */}
      <ProjectStorySection form={form} />

      {/* ── 5. GALLERY ────────────────────────── */}
      <section className="space-y-6">
        <h3 className="border-b border-neutral-800 pb-2 text-xl font-bold tracking-tight text-white">
          5. Gallery (Process & Media)
        </h3>

        <MultiFileUpload
          value={galleryFiles}
          onChange={setGalleryFiles}
          description="Drag and drop multiple images, GIFs, or videos to build the gallery grid."
        />
      </section>

      <div className="flex justify-end pt-10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-200 px-10 py-4 text-[14px] font-bold tracking-widest text-neutral-950 uppercase transition-all hover:bg-brand-100 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Saving...
            </>
          ) : (
            "Save Project"
          )}
        </button>
      </div>
    </form>
  )
}
