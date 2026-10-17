"use client"

import React, { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { ProjectFormValues } from "@/lib/schemas"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface ProjectStorySectionProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectStorySection({ form }: ProjectStorySectionProps) {
  const [serviceInput, setServiceInput] = useState("")
  const [deliverableInput, setDeliverableInput] = useState("")

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

  const currentServices = form.watch("services") || []
  const currentDeliverables = form.watch("deliverables") || []

  return (
    <>
      {/* ── 3. OVERVIEW ────────────────────────── */}
      <section className="space-y-6">
        <h3 className="border-b border-neutral-800 pb-2 text-xl font-bold tracking-tight text-white">
          3. Overview & Deliverables
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
              {currentServices.map((srv, idx) => (
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
              {currentDeliverables.map((del, idx) => (
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
    </>
  )
}
