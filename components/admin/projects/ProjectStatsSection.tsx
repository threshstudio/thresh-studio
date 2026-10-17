"use client"

import React from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { ProjectFormValues } from "@/lib/schemas"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface ProjectStatsSectionProps {
  form: UseFormReturn<ProjectFormValues>
}

export function ProjectStatsSection({ form }: ProjectStatsSectionProps) {
  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({
    control: form.control,
    name: "stats",
  })

  return (
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
          className="flex items-center gap-2 rounded-md border border-dashed border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-500"
        >
          <Plus className="h-4 w-4" /> Add Stat
        </button>
      </div>
    </section>
  )
}
