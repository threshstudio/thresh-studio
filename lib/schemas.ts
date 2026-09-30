import { z } from "zod"

export const projectFormSchema = z.object({
  // 1. HERO
  category: z.string().min(1, "Category is required"),
  year: z.string().min(1, "Year is required"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional().or(z.literal("")),
  tagline: z.string().min(1, "Tagline is required"),
  videoUrl: z.string().optional().or(z.literal("")),

  // 2. STATS
  stats: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
    })
  ),

  // 3. OVERVIEW
  description: z.string().min(1, "Description is required"),
  services: z.array(z.string()),
  deliverables: z.array(z.string()),

  // 4. CHALLENGE / APPROACH
  challenge: z.string().min(1, "Challenge text is required"),
  approach: z.string().min(1, "Approach text is required"),

  // 5. GALLERY
  gallery: z.array(z.string().url()),

  // 6. OUTCOME
  outcome: z.string().min(1, "Outcome text is required"),

  // METADATA
  isPublished: z.boolean(),
  order: z.number(),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

export const siteSettingsSchema = z.object({
  heroVideoUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  vimeoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  trustedBrands: z.array(z.any()).optional(),
})
export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>

export const trustedBrandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logoUrl: z.string().min(1, "Logo is required").url("Must be a valid URL"),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
})
export type TrustedBrandValues = z.infer<typeof trustedBrandSchema>

export const testimonialSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  author: z.string().min(1, "Author name is required"),
  role: z.string().min(1, "Role/Title is required"),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  rating: z.number().min(1).max(5),
  isActive: z.boolean(),
  order: z.number(),
})
export type TestimonialFormValues = z.infer<typeof testimonialSchema>

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
})
export type UpdateEmailValues = z.infer<typeof updateEmailSchema>

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .refine(
        (val) => !val || val.length >= 8,
        "Password must be at least 8 characters"
      )
      .refine(
        (val) => !val || /[a-z]/.test(val),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (val) => !val || /[A-Z]/.test(val),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (val) => !val || /[0-9]/.test(val),
        "Password must contain at least one number"
      )
      .refine(
        (val) => !val || /[^a-zA-Z0-9]/.test(val),
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
})
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
})
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
