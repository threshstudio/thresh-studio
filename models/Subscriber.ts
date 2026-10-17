import mongoose, { Schema, Document, Model } from "mongoose"

export interface ISubscriber extends Document {
  email: string
  status: "active" | "unsubscribed"
  source: "footer" | "scroll_prompt" | "admin"
  unsubscribeToken: string
  createdAt: Date
  updatedAt: Date
}

const SubscriberSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
      index: true,
    },
    source: {
      type: String,
      enum: ["footer", "scroll_prompt", "admin"],
      default: "footer",
    },
    unsubscribeToken: {
      type: String,
      required: true,
      index: true,
    },
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

SubscriberSchema.index({ createdAt: -1 })

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", SubscriberSchema)
