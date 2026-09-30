import mongoose, { Schema, Document, Model } from "mongoose"

export interface IVerificationToken extends Document {
  identifier: string // User's email or ID
  token: string // Hashed token or OTP
  type: "EMAIL_CHANGE" | "PASSWORD_RESET"
  expiresAt: Date
  createdAt: Date
}

const VerificationTokenSchema: Schema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["EMAIL_CHANGE", "PASSWORD_RESET"],
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: "1m" }, // MongoDB will automatically delete documents 1 minute after expiresAt
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
)

export const VerificationToken: Model<IVerificationToken> =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    VerificationTokenSchema
  )
