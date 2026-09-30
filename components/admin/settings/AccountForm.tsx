"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Loader2,
  Mail,
  Lock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  updateEmailSchema,
  UpdateEmailValues,
  updatePasswordSchema,
  UpdatePasswordValues,
} from "@/lib/schemas"

import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function AccountForm({
  currentEmail = "Loading...",
}: {
  currentEmail?: string
}) {
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const emailForm = useForm<UpdateEmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  const passwordForm = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const newPassword = passwordForm.watch("newPassword") || ""

  const calculateStrength = (pass: string) => {
    let score = 0
    if (!pass) return 0
    if (pass.length >= 8) score += 1
    if (/[a-z]/.test(pass)) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1
    return score
  }

  const strength = calculateStrength(newPassword)
  const strengthLabels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = [
    "bg-neutral-800",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-brand-500",
    "bg-brand-400",
  ]

  const onEmailSubmit = async (data: UpdateEmailValues) => {
    setIsEmailLoading(true)
    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email", ...data }),
      })

      if (!res.ok) {
        const err = await res.json()
        let errorMessage = err.error || "Failed to update email"
        if (err.details) {
          const issues = []
          Object.keys(err.details).forEach((key) => {
            if (key !== "_errors" && err.details[key]?._errors?.length) {
              issues.push(`${key}: ${err.details[key]._errors.join(", ")}`)
            }
          })
          if (err.details._errors?.length) {
            issues.push(err.details._errors.join(", "))
          }
          if (issues.length) errorMessage = issues.join(" | ")
        }
        throw new Error(errorMessage)
      }

      toast.success("Email updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsEmailLoading(false)
    }
  }

  const onPasswordSubmit = async (data: UpdatePasswordValues) => {
    setIsPasswordLoading(true)
    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password", ...data }),
      })

      if (!res.ok) {
        const err = await res.json()
        let errorMessage = err.error || "Failed to update password"
        if (err.details) {
          const issues = []
          Object.keys(err.details).forEach((key) => {
            if (key !== "_errors" && err.details[key]?._errors?.length) {
              issues.push(`${key}: ${err.details[key]._errors.join(", ")}`)
            }
          })
          if (err.details._errors?.length) {
            issues.push(err.details._errors.join(", "))
          }
          if (issues.length) errorMessage = issues.join(" | ")
        }
        throw new Error(errorMessage)
      }

      toast.success("Password updated successfully")
      passwordForm.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-12">
      <div className="border-b border-neutral-800/50 pb-6">
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">
          Account Settings
        </h3>
        <p className="max-w-xl text-[15px] text-neutral-400">
          Update your login credentials and securely manage your account
          preferences.
        </p>
      </div>

      {/* EMAIL FORM */}
      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="space-y-6"
      >
        <h4 className="text-lg font-bold tracking-wide text-neutral-100">
          Email Address
        </h4>
        <div className="max-w-xl space-y-6">
          <Field className="group space-y-2.5">
            <FieldLabel className="ml-1 text-xs font-bold tracking-widest text-neutral-300 uppercase">
              Current Email
            </FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-neutral-500" />
              </div>
              <Input
                disabled
                value={currentEmail}
                className="h-12 cursor-not-allowed rounded-xl border-neutral-700 bg-neutral-900/50 pl-12 text-neutral-300 shadow-inner"
              />
            </div>
          </Field>

          <Field className="group space-y-2.5">
            <FieldLabel className="ml-1 text-xs font-bold tracking-widest text-neutral-300 uppercase transition-colors group-focus-within:text-brand-200">
              New Email Address
            </FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-neutral-400 transition-colors group-focus-within:text-brand-200" />
              </div>
              <Input
                placeholder="new.admin@threshstudio.com"
                className="h-12 rounded-xl border-neutral-700 bg-neutral-900/50 pl-12 text-white shadow-inner transition-all placeholder:text-neutral-400 focus:border-brand-500/40 focus:bg-neutral-900/80 focus:ring-1 focus:ring-brand-500/40"
                {...emailForm.register("email")}
              />
            </div>
            <FieldError errors={[emailForm.formState.errors.email]} />
          </Field>
        </div>
        <div className="flex md:justify-start">
          <button
            type="submit"
            disabled={isEmailLoading}
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-200 px-8 py-3 text-[13px] font-bold tracking-widest text-neutral-950 uppercase shadow-[0_0_20px_rgba(45,212,191,0.15)] transition-all hover:-translate-y-0.5 hover:bg-brand-100 hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 flex items-center gap-2">
              {isEmailLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Email
            </span>
          </button>
        </div>
      </form>

      <hr className="border-neutral-800/50" />

      {/* PASSWORD FORM */}
      <form
        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
        className="space-y-8"
      >
        <h4 className="mb-2 text-lg font-bold tracking-wide text-neutral-100">
          Change Password
        </h4>
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {/* Current Password - Full Width */}
          <Field className="group max-w-xl space-y-2.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <FieldLabel className="ml-1 text-xs font-bold tracking-widest text-neutral-300 uppercase transition-colors group-focus-within:text-brand-200">
                Current Password
              </FieldLabel>
              <a
                href="/admin/forgot-password"
                className="text-xs font-medium text-brand-500 transition-colors hover:text-brand-400"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-neutral-400 transition-colors group-focus-within:text-brand-200" />
              </div>
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="off"
                className="h-12 rounded-xl border-neutral-700 bg-neutral-900/50 pr-12 pl-12 text-white shadow-inner transition-all placeholder:text-neutral-400 focus:border-brand-500/40 focus:bg-neutral-900/80 focus:ring-1 focus:ring-brand-500/40"
                {...passwordForm.register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-300"
              >
                {showCurrent ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
            <FieldError
              errors={[passwordForm.formState.errors.currentPassword]}
            />
          </Field>

          {/* New Password */}
          <Field className="group space-y-2.5">
            <FieldLabel className="ml-1 text-xs font-bold tracking-widest text-neutral-300 uppercase transition-colors group-focus-within:text-brand-200">
              New Password
            </FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Key className="h-5 w-5 text-neutral-400 transition-colors group-focus-within:text-brand-200" />
              </div>
              <Input
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className="h-12 rounded-xl border-neutral-700 bg-neutral-900/50 pr-12 pl-12 text-white shadow-inner transition-all placeholder:text-neutral-400 focus:border-brand-500/40 focus:bg-neutral-900/80 focus:ring-1 focus:ring-brand-500/40"
                {...passwordForm.register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-300"
              >
                {showNew ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="flex justify-between font-mono text-xs tracking-wider">
                  <span className="text-neutral-500">Strength:</span>
                  <span
                    className={`transition-colors ${strengthColors[strength].replace("bg-", "text-")}`}
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>
                <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-neutral-900/50">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-full flex-1 transition-all duration-300 ${
                        strength >= level
                          ? strengthColors[strength]
                          : "bg-neutral-800/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <FieldError errors={[passwordForm.formState.errors.newPassword]} />
          </Field>

          {/* Confirm New Password */}
          <Field className="group space-y-2.5">
            <FieldLabel className="ml-1 text-xs font-bold tracking-widest text-neutral-300 uppercase transition-colors group-focus-within:text-brand-200">
              Confirm New Password
            </FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <ShieldCheck className="h-5 w-5 text-neutral-400 transition-colors group-focus-within:text-brand-200" />
              </div>
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className="h-12 rounded-xl border-neutral-700 bg-neutral-900/50 pr-12 pl-12 text-white shadow-inner transition-all placeholder:text-neutral-400 focus:border-brand-500/40 focus:bg-neutral-900/80 focus:ring-1 focus:ring-brand-500/40"
                {...passwordForm.register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-300"
              >
                {showConfirm ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
            <FieldError
              errors={[passwordForm.formState.errors.confirmPassword]}
            />
          </Field>
        </div>

        <div className="flex md:justify-end">
          <button
            type="submit"
            disabled={isPasswordLoading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-200 px-8 py-3.5 text-[13px] font-bold tracking-widest text-neutral-950 uppercase shadow-[0_0_20px_rgba(45,212,191,0.15)] transition-all hover:-translate-y-0.5 hover:bg-brand-100 hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 flex items-center gap-2">
              {isPasswordLoading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Update Password
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
