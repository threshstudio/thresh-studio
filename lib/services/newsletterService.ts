/**
 * @file newsletterService.ts
 * @description Server-only domain service layer managing newsletter subscribers and email campaign broadcasts.
 * Follows Thresh Studio architecture: all read queries use .lean() and are normalized through serializers.
 */

import crypto from "crypto"
import dbConnect from "@/lib/db"
import { Subscriber, ISubscriber } from "@/models/Subscriber"
import {
  NewsletterCampaign,
  INewsletterCampaign,
} from "@/models/NewsletterCampaign"
import {
  sendWelcomeSubscriberEmail,
  sendNewsletterBroadcastEmail,
} from "@/lib/email"
import {
  serializeSubscriber,
  serializeNewsletterCampaign,
  LeanDoc,
} from "@/lib/serializers"

/**
 * Subscribes a user to the newsletter, handling reactivation if previously unsubscribed.
 */
export async function subscribeUser({
  email,
  source = "footer",
}: {
  email: string
  source?: "footer" | "scroll_prompt" | "admin"
}) {
  await dbConnect()
  const cleanEmail = email.toLowerCase().trim()

  const existing = await Subscriber.findOne({ email: cleanEmail })

  if (existing) {
    if (existing.status === "active") {
      return {
        success: false,
        alreadySubscribed: true,
        message:
          "You are already subscribed to our newsletter with this email address.",
      }
    }

    // Re-activate previously unsubscribed user
    existing.status = "active"
    existing.unsubscribeToken = crypto.randomBytes(24).toString("hex")
    await existing.save()

    // Send welcome email
    try {
      await sendWelcomeSubscriberEmail(cleanEmail, existing.unsubscribeToken)
    } catch (err) {
      console.error(
        "[SERVICE /newsletterService/subscribeUser] Welcome email error:",
        err
      )
    }

    return {
      success: true,
      isNew: false,
      message: "Welcome back! Your subscription has been reactivated.",
    }
  }

  // Create new subscriber
  const unsubscribeToken = crypto.randomBytes(24).toString("hex")
  await Subscriber.create({
    email: cleanEmail,
    status: "active",
    source,
    unsubscribeToken,
  })

  // Send welcome email
  try {
    await sendWelcomeSubscriberEmail(cleanEmail, unsubscribeToken)
  } catch (err) {
    console.error(
      "[SERVICE /newsletterService/subscribeUser] Welcome email error:",
      err
    )
  }

  return {
    success: true,
    isNew: true,
    message: "Thank you for subscribing to Thresh Studio updates!",
  }
}

/**
 * Unsubscribes a user securely using an email and cryptographically random token.
 */
export async function unsubscribeUser({
  email,
  token,
}: {
  email: string
  token: string
}) {
  await dbConnect()
  const cleanEmail = email.toLowerCase().trim()

  const subscriber = await Subscriber.findOne({
    email: cleanEmail,
    unsubscribeToken: token,
  })

  if (!subscriber) {
    return {
      success: false,
      message: "Invalid or expired unsubscribe link.",
    }
  }

  subscriber.status = "unsubscribed"
  await subscriber.save()

  return {
    success: true,
    message: "You have been successfully unsubscribed from all updates.",
  }
}

/**
 * Retrieves paginated subscribers with optional search and status filter.
 * Returns lean, serialized plain objects.
 */
export async function getSubscribers({
  search = "",
  status,
  page = 1,
  limit = 20,
}: {
  search?: string
  status?: string
  page?: number
  limit?: number
}) {
  await dbConnect()

  const query: Record<string, unknown> = {}

  if (status && (status === "active" || status === "unsubscribed")) {
    query.status = status
  }

  if (search) {
    query.email = { $regex: search, $options: "i" }
  }

  const skip = (page - 1) * limit
  const [subscribersRaw, total] = await Promise.all([
    Subscriber.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<LeanDoc<ISubscriber>[]>(),
    Subscriber.countDocuments(query),
  ])

  return {
    subscribers: subscribersRaw.map((sub) => serializeSubscriber(sub)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Returns audience overview statistics.
 */
export async function getSubscriberStats() {
  await dbConnect()

  const [total, active, unsubscribed] = await Promise.all([
    Subscriber.countDocuments(),
    Subscriber.countDocuments({ status: "active" }),
    Subscriber.countDocuments({ status: "unsubscribed" }),
  ])

  return { total, active, unsubscribed }
}

/**
 * Deletes a subscriber record by ID.
 */
export async function deleteSubscriber(id: string) {
  await dbConnect()
  return Subscriber.findByIdAndDelete(id)
}

/**
 * Returns recent newsletter campaign history as serialized plain objects.
 */
export async function getNewsletterCampaigns() {
  await dbConnect()
  const campaignsRaw = await NewsletterCampaign.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean<LeanDoc<INewsletterCampaign>[]>([])

  return campaignsRaw.map((c) => serializeNewsletterCampaign(c))
}

/**
 * Dispatches a newsletter broadcast to all active subscribers in safe batches.
 */
export async function broadcastNewsletter({
  subject,
  previewText,
  contentHtml,
  contentJson,
  sentBy,
}: {
  subject: string
  previewText?: string
  contentHtml: string
  contentJson?: Record<string, unknown>
  sentBy?: string
}) {
  await dbConnect()

  // 1. Create campaign record
  const campaign = await NewsletterCampaign.create({
    subject,
    previewText,
    contentHtml,
    contentJson,
    sentBy,
    status: "draft",
    recipientCount: 0,
  })

  // 2. Fetch all active subscribers
  const activeSubscribers = await Subscriber.find({
    status: "active",
  }).lean<LeanDoc<ISubscriber>[]>([])

  if (activeSubscribers.length === 0) {
    campaign.status = "sent"
    campaign.sentAt = new Date()
    campaign.recipientCount = 0
    await campaign.save()
    return {
      success: true,
      campaign: serializeNewsletterCampaign(
        campaign.toObject() as unknown as LeanDoc<INewsletterCampaign>
      ),
      recipientCount: 0,
      message: "Campaign saved, but there are no active subscribers yet.",
    }
  }

  // 3. Dispatch emails in controlled chunks
  let deliveredCount = 0
  const batchSize = 10

  for (let i = 0; i < activeSubscribers.length; i += batchSize) {
    const chunk = activeSubscribers.slice(i, i + batchSize)
    await Promise.all(
      chunk.map(async (sub) => {
        try {
          await sendNewsletterBroadcastEmail({
            to: sub.email,
            subject,
            previewText,
            contentHtml,
            unsubscribeToken: sub.unsubscribeToken,
          })
          deliveredCount++
        } catch (err) {
          console.error(
            `[SERVICE /newsletterService/broadcast] Dispatch fail ${sub.email}:`,
            err
          )
        }
      })
    )
  }

  // 4. Update campaign
  campaign.status = "sent"
  campaign.sentAt = new Date()
  campaign.recipientCount = deliveredCount
  await campaign.save()

  return {
    success: true,
    campaign: serializeNewsletterCampaign(
      campaign.toObject() as unknown as LeanDoc<INewsletterCampaign>
    ),
    recipientCount: deliveredCount,
    message: `Newsletter successfully delivered to ${deliveredCount} subscriber(s).`,
  }
}
