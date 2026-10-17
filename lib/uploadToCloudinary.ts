/**
 * @file uploadToCloudinary.ts
 * @description Client-side utility for authenticated, signed direct uploads and deletions with Cloudinary.
 */

/**
 * Uploads a local file directly to Cloudinary using a backend-generated cryptographic signature.
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "thresh-studio"
): Promise<string> {
  // Cloudinary credentials need to be configured in .env for this to actually hit the real servers.
  // We'll dynamically determine the cloud name if it exists.
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    console.warn("Cloudinary not configured. Mocking successful upload.")
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file))
      }, 1000)
    })
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000)

    // Get signature from our backend securely
    const signatureResponse = await fetch("/api/upload/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paramsToSign: {
          timestamp,
          folder,
        },
      }),
    })

    if (!signatureResponse.ok) {
      throw new Error("Failed to get upload signature")
    }

    const { signature } = await signatureResponse.json()

    // Upload directly to Cloudinary from the client
    const formData = new FormData()
    formData.append("file", file)
    formData.append(
      "api_key",
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string
    )
    formData.append("timestamp", timestamp.toString())
    formData.append("signature", signature)
    formData.append("folder", folder)

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload to Cloudinary")
    }

    const data = await uploadResponse.json()
    return data.secure_url // Returns the permanent URL
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error
  }
}

/**
 * Sends a deletion request to the backend to securely remove an asset from Cloudinary.
 */
export async function deleteFromCloudinary(url: string) {
  try {
    // If it's a blob/local url (mocked) or not a cloudinary URL, skip
    if (url.startsWith("blob:") || !url.includes("cloudinary.com")) return

    await fetch("/api/upload/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
  } catch (error) {
    console.error("Failed to delete from Cloudinary", error)
  }
}
