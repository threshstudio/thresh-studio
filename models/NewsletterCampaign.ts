import mongoose, { Schema, Document, Model } from "mongoose"

export interface INewsletterCampaign extends Document {
  subject: string
  previewText?: string
  contentHtml: string
  contentJson?: Record<string, unknown>
  sentBy?: string
  recipientCount: number
  status: "draft" | "sent" | "failed"
  sentAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NewsletterCampaignSchema: Schema = new Schema(
  {
    subject: { type: String, required: true },
    previewText: { type: String },
    contentHtml: { type: String, required: true },
    contentJson: { type: Schema.Types.Mixed },
    sentBy: { type: String },
    recipientCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "sent", "failed"],
      default: "draft",
    },
    sentAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id)
        delete ret._id
        delete ret.__v
      },
    },
  }
)

NewsletterCampaignSchema.index({ createdAt: -1 })
NewsletterCampaignSchema.index({ status: 1 })

export const NewsletterCampaign: Model<INewsletterCampaign> =
  mongoose.models.NewsletterCampaign ||
  mongoose.model<INewsletterCampaign>(
    "NewsletterCampaign",
    NewsletterCampaignSchema
  )
