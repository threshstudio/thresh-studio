import mongoose, { Schema, Document, Model } from "mongoose"

export interface IAdminUser extends Document {
  email: string
  pendingEmail?: string
  password?: string
  name?: string
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const AdminUserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pendingEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: { type: String }, // Hashed
    name: { type: String },
    role: { type: String, default: "admin", enum: ["admin", "superadmin"] },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id)
        delete ret._id
        delete ret.__v
        delete ret.password // Never expose password in frontend responses
      },
    },
  }
)

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema)
