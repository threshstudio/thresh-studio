import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { auth } from "@/auth"

import { signUploadSchema } from "@/lib/schemas"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const parsed = signUploadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid signature request payload" },
        { status: 400 }
      )
    }

    const { paramsToSign } = parsed.data

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    )

    return NextResponse.json({ signature })
  } catch (error) {
    console.error("[POST /api/upload/signature]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
