"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { testimonialSchema, TestimonialFormValues } from "@/lib/schemas"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/uploadToCloudinary"

export function TestimonialForm({
  initialData,
}: {
  initialData?: Partial<TestimonialFormValues> & { id?: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | string | null>(
    initialData?.avatar || null
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialData || {
      quote: "",
      author: "",
      role: "",
      avatar: "",
      rating: 5,
      isActive: true,
      order: 0,
    },
  })

  const onSubmit = async (data: TestimonialFormValues) => {
    setIsSubmitting(true)
    try {
      let finalUrl = data.avatar || ""
      if (avatarFile instanceof File) {
        finalUrl = await uploadToCloudinary(
          avatarFile,
          "thresh-studio/testimonials"
        )
      } else if (typeof avatarFile === "string") {
        finalUrl = avatarFile
      } else if (avatarFile === null) {
        finalUrl = ""
      }

      data.avatar = finalUrl

      if (initialData?.avatar && initialData.avatar !== finalUrl) {
        try {
          await deleteFromCloudinary(initialData.avatar)
        } catch (e) {
          console.error("Failed to delete old avatar", e)
        }
      }

      const url = initialData?.id
        ? `/api/admin/testimonials/${initialData.id}`
        : `/api/admin/testimonials`

      const res = await fetch(url, {
        method: initialData?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to save testimonial")

      toast.success(
        initialData?.id ? "Testimonial updated" : "Testimonial created"
      )
      router.push("/admin/testimonials")
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      <div className="rounded-[2rem] border border-neutral-800/60 bg-neutral-900/30 p-8 shadow-inner backdrop-blur-sm">
        <h3 className="mb-6 text-xl font-bold text-white">
          Testimonial Details
        </h3>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-400">
              Quote
            </label>
            <textarea
              {...register("quote")}
              className="h-32 w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-white focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
              placeholder="What did the client say?"
            />
            {errors.quote && (
              <p className="mt-1 text-sm text-red-500">
                {errors.quote.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-400">
                Author Name
              </label>
              <input
                {...register("author")}
                className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-white focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
                placeholder="Sarah Jenkins"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.author.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-400">
                Role / Title
              </label>
              <input
                {...register("role")}
                className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-white focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
                placeholder="VP Marketing @ Lumina"
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-400">
              Avatar <span className="text-neutral-600">(Optional)</span>
            </label>
            <FileUpload
              value={avatarFile}
              onChange={setAvatarFile}
              accept="image/*"
              maxSize={2 * 1024 * 1024} // 2MB
              description="Upload JPG or PNG (Max 2MB)"
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-400">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                {...register("rating", { valueAsNumber: true })}
                className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-white focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-400">
                Order
              </label>
              <input
                type="number"
                {...register("order", { valueAsNumber: true })}
                className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 text-white focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
              />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="h-5 w-5 rounded border-neutral-800 bg-neutral-950 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-neutral-300">
                  Active
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-200 px-10 text-[13px] font-bold tracking-widest text-neutral-950 uppercase shadow-[0_0_20px_rgba(0,211,218,0.15)] transition-all hover:-translate-y-0.5 hover:bg-brand-100 hover:shadow-[0_0_30px_rgba(0,211,218,0.3)] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Testimonial"
          )}
        </button>
      </div>
    </form>
  )
}
