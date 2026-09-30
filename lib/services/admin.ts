import dbConnect from "@/lib/db"
import { AdminUser } from "@/models/AdminUser"
import { serializeAdminUser } from "@/lib/serializers"

/**
 * Fetch an admin user by ID and return a serialized plain object.
 */
export async function getAdminUserById(id: string) {
  await dbConnect()
  const user = await AdminUser.findById(id).lean()
  return serializeAdminUser(user)
}

/**
 * Fetch an admin user by email and return a serialized plain object.
 */
export async function getAdminUserByEmail(email: string) {
  await dbConnect()
  const user = await AdminUser.findOne({ email }).lean()
  return serializeAdminUser(user)
}
