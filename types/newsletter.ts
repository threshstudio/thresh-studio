/**
 * @file newsletter.ts
 * @description Domain types for newsletter subscribers and campaigns.
 */

export interface SubscriberItem {
  id: string
  email: string
  status: "active" | "unsubscribed"
  source: string
  unsubscribeToken?: string
  createdAt: string
  updatedAt?: string
}

export interface CampaignItem {
  id: string
  subject: string
  previewText?: string | null
  recipientCount: number
  sentAt?: string | null
  createdAt: string
  status: "draft" | "sent" | "failed"
}

export interface SubscriberStats {
  total: number
  active: number
  unsubscribed: number
}
