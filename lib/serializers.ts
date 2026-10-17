/**
 * @file serializers.ts
 * @description Mongoose .lean() document serializers transforming database models into plain JSON.
 */

import { IProject } from "@/models/Project"

export type LeanDoc<T> = T & {
  _id?: { toString(): string }
  id?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

/**
 * Serializes a lean Project Mongoose document into a plain frontend object.
 */
export function serializeProject(doc: LeanDoc<IProject> | null) {
  if (!doc) return null

  return {
    id: doc._id?.toString() || doc.id,
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    year: doc.year,
    tagline: doc.tagline,
    description: doc.description,
    services: doc.services || [],
    deliverables: doc.deliverables || [],
    challenge: doc.challenge,
    approach: doc.approach,
    outcome: doc.outcome,
    videoUrl: doc.videoUrl,
    gallery: doc.gallery || [],
    stats: doc.stats || [],
    isPublished: doc.isPublished ?? false,
    order: doc.order ?? 0,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  }
}

import { ISiteSettings } from "@/models/SiteSettings"
import { ITrustedBrand } from "@/models/TrustedBrand"

export function serializeSiteSettings(doc: LeanDoc<ISiteSettings> | null) {
  if (!doc) return null

  return {
    id: doc._id?.toString() || doc.id,
    heroVideoUrl: doc.heroVideoUrl ?? null,
    instagramUrl: doc.instagramUrl ?? null,
    twitterUrl: doc.twitterUrl ?? null,
    linkedinUrl: doc.linkedinUrl ?? null,
    vimeoUrl: doc.vimeoUrl ?? null,
    trustedBrands: doc.trustedBrands || [],
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  }
}

export function serializeTrustedBrand(doc: LeanDoc<ITrustedBrand> | null) {
  if (!doc) return null

  return {
    id: doc._id?.toString() || doc.id,
    name: doc.name,
    logoUrl: doc.logoUrl,
    isActive: doc.isActive ?? true,
    order: doc.order ?? 0,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  }
}

import { ITestimonial } from "@/models/Testimonial"

export function serializeTestimonial(doc: LeanDoc<ITestimonial> | null) {
  if (!doc) return null

  return {
    id: doc._id?.toString() || doc.id,
    quote: doc.quote,
    author: doc.author,
    role: doc.role,
    avatar: doc.avatar,
    rating: doc.rating ?? 5,
    isActive: doc.isActive ?? true,
    order: doc.order ?? 0,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  }
}

import { IAdminUser } from "@/models/AdminUser"

export function serializeAdminUser(doc: LeanDoc<IAdminUser> | null) {
  if (!doc) return null

  return {
    id: doc._id?.toString() || doc.id,
    email: doc.email,
    pendingEmail: doc.pendingEmail || null,
    role: doc.role,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  }
}

import { ISubscriber } from "@/models/Subscriber"
import { INewsletterCampaign } from "@/models/NewsletterCampaign"

export function serializeSubscriber(doc: LeanDoc<ISubscriber> | null) {
  if (!doc) return null

  return {
    id: doc._id?.toString() || doc.id,
    email: doc.email,
    status: doc.status,
    source: doc.source,
    unsubscribeToken: doc.unsubscribeToken,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  }
}

export function serializeNewsletterCampaign(
  doc: LeanDoc<INewsletterCampaign> | null
) {
  if (!doc) return null

  return {
    id: doc._id?.toString() || doc.id,
    subject: doc.subject,
    previewText: doc.previewText ?? null,
    contentHtml: doc.contentHtml,
    contentJson: doc.contentJson || null,
    sentBy: doc.sentBy ?? null,
    recipientCount: doc.recipientCount ?? 0,
    status: doc.status,
    sentAt: doc.sentAt ? new Date(doc.sentAt).toISOString() : null,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  }
}
