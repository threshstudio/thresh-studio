import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { auth } from "@/auth"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

import { deleteUploadSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const parsed = deleteUploadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "URL is required" },
        { status: 400 }
      )
    }

    const { url } = parsed.data

    // Extract public_id from Cloudinary URL
    // e.g. https://res.cloudinary.com/cloud_name/image/upload/v1234567/thresh-studio/brands/logo.png
    const regex = /\/v\d+\/(.+)\.\w+$/
    const match = url.match(regex)

    if (match && match[1]) {
      const publicId = match[1]
      const resourceType = url.includes("/video/upload/") ? "video" : "image"

      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      })
      return NextResponse.json({ success: true, publicId })
    } else {
      return NextResponse.json(
        { error: "Invalid Cloudinary URL" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[POST /api/upload/delete]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
