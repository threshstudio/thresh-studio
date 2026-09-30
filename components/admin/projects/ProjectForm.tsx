"use client"

import React, { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react"
import { projectFormSchema, ProjectFormValues } from "@/lib/schemas"
import { uploadToCloudinary } from "@/lib/uploadToCloudinary"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/ui/file-upload"
import { MultiFileUpload } from "@/components/ui/multi-file-upload"

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

  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({
    control: form.control,
    name: "stats",
  })

  // Simple string array handlers for Services, Deliverables, and Gallery
  const [serviceInput, setServiceInput] = useState("")
  const addService = () => {
    if (!serviceInput.trim()) return
    const current = form.getValues("services")
    form.setValue("services", [...current, serviceInput.trim()])
    setServiceInput("")
  }
  const removeService = (idx: number) => {
    const current = form.getValues("services")
    form.setValue(
      "services",
      current.filter((_, i) => i !== idx)
    )
  }

  const [deliverableInput, setDeliverableInput] = useState("")
  const addDeliverable = () => {
    if (!deliverableInput.trim()) return
    const current = form.getValues("deliverables")
    form.setValue("deliverables", [...current, deliverableInput.trim()])
    setDeliverableInput("")
  }
  const removeDeliverable = (idx: number) => {
    const current = form.getValues("deliverables")
    form.setValue(
      "deliverables",
      current.filter((_, i) => i !== idx)
    )
  }

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

      // The most efficient approach: Controlled Concurrency (Batching)
      // Uploads 3 files in parallel. Faster than sequential, safer than Promise.all(everything)
      const finalGalleryUrls: string[] = []
      const CONCURRENCY_LIMIT = 3
      let uploadCount = 0
      const newFilesToUpload = galleryFiles.filter((f) => f instanceof File)

      for (let i = 0; i < galleryFiles.length; i += CONCURRENCY_LIMIT) {
        const batch = galleryFiles.slice(i, i + CONCURRENCY_LIMIT)

        const batchResults = await Promise.all(
          batch.map(async (fileOrUrl) => {
            if (fileOrUrl instanceof File) {
              uploadCount++
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
      <section className="space-y-6">
        <h3 className="border-b border-neutral-800 pb-2 text-xl font-bold tracking-tight text-white">
          2. Stats
        </h3>
        <div className="space-y-4">
          {statFields.map((field, idx) => (
            <div key={field.id} className="flex items-start gap-4">
              <Field className="flex-1">
                <Input
                  {...form.register(`stats.${idx}.value` as const)}
                  placeholder="Value (e.g. +300%)"
                />
              </Field>
              <Field className="flex-1">
                <Input
                  {...form.register(`stats.${idx}.label` as const)}
                  placeholder="Label (e.g. Conversion Rate)"
                />
              </Field>
              <button
                type="button"
                onClick={() => removeStat(idx)}
                className="rounded-md bg-red-500/10 p-3 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendStat({ label: "", value: "" })}
            className="flex items-center gap-1 text-sm text-brand-300 hover:text-brand-200"
          >
            <Plus className="h-4 w-4" /> Add Stat
          </button>
        </div>
      </section>

      {/* ── 3. OVERVIEW ────────────────────────── */}
      <section className="space-y-6">
        <h3 className="border-b border-neutral-800 pb-2 text-xl font-bold tracking-tight text-white">
          3. Overview
        </h3>
        <Field>
          <FieldLabel isRequired>Description</FieldLabel>
          <textarea
            {...form.register("description")}
            className="min-h-[120px] w-full rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 text-white outline-none focus:border-brand-500/40 focus:bg-neutral-900/80 focus:ring-1 focus:ring-brand-500/40"
            placeholder="Detailed overview..."
          />
          <FieldError
            errors={[
              form.formState.errors.description as unknown as {
                message?: string
              },
            ]}
          />
        </Field>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <FieldLabel>Services</FieldLabel>
            <div className="flex gap-2">
              <Input
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addService()
                  }
                }}
                placeholder="Add service..."
              />
              <button
                type="button"
                onClick={addService}
                className="rounded-lg bg-neutral-800 px-4 text-white hover:bg-neutral-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.watch("services").map((srv, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300"
                >
                  {srv}{" "}
                  <button
                    type="button"
                    onClick={() => removeService(idx)}
                    className="hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <FieldLabel>Deliverables</FieldLabel>
            <div className="flex gap-2">
              <Input
                value={deliverableInput}
                onChange={(e) => setDeliverableInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addDeliverable()
                  }
                }}
                placeholder="Add deliverable..."
              />
              <button
                type="button"
                onClick={addDeliverable}
                className="rounded-lg bg-neutral-800 px-4 text-white hover:bg-neutral-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.watch("deliverables").map((del, idx) => (
                <span
                  key={idx}
                  className="bg-brand-900/30 flex items-center gap-2 rounded-full border border-brand-500/30 px-3 py-1 text-xs text-brand-200"
                >
                  {del}{" "}
                  <button
                    type="button"
                    onClick={() => removeDeliverable(idx)}
                    className="hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CHALLENGE / APPROACH ────────────────────────── */}
      <section className="space-y-6">
        <h3 className="border-b border-neutral-800 pb-2 text-xl font-bold tracking-tight text-white">
          4. Challenge & Approach
        </h3>
        <Field>
          <FieldLabel isRequired>The Challenge</FieldLabel>
          <textarea
            {...form.register("challenge")}
            className="min-h-[120px] w-full rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 text-white outline-none"
          />
          <FieldError
            errors={[
              form.formState.errors.challenge as unknown as {
                message?: string
              },
            ]}
          />
        </Field>
        <Field>
          <FieldLabel isRequired>Our Approach</FieldLabel>
          <textarea
            {...form.register("approach")}
            className="min-h-[120px] w-full rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 text-white outline-none"
          />
          <FieldError
            errors={[
              form.formState.errors.approach as unknown as { message?: string },
            ]}
          />
        </Field>
      </section>

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

      {/* ── 6. OUTCOME ────────────────────────── */}
      <section className="space-y-6">
        <h3 className="border-b border-neutral-800 pb-2 text-xl font-bold tracking-tight text-white">
          6. Outcome & Publish
        </h3>
        <Field>
          <FieldLabel isRequired>The Result</FieldLabel>
          <textarea
            {...form.register("outcome")}
            className="min-h-[120px] w-full rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 text-white outline-none"
          />
          <FieldError
            errors={[
              form.formState.errors.outcome as unknown as { message?: string },
            ]}
          />
        </Field>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <input
            type="checkbox"
            id="isPublished"
            {...form.register("isPublished")}
            className="h-5 w-5 accent-brand-500"
          />
          <label htmlFor="isPublished" className="font-medium text-white">
            Publish Project (Visible to Public)
          </label>
        </div>
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
