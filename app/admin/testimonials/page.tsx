import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getTestimonials } from "@/lib/services/testimonialService"
import { TestimonialListClient } from "@/components/admin/testimonials/TestimonialListClient"
import { AdminNav } from "@/components/admin/AdminNav"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export const metadata = {
  title: "Testimonials | Thresh Studio Admin",
}

export default async function TestimonialsPage() {
  const session = await auth()
  if (!session) redirect("/admin/login")

  const testimonials = await getTestimonials()

  return (
    <div className="flex min-h-screen text-neutral-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNav />
        <main className="mx-auto w-full max-w-7xl space-y-8 p-6 pb-20 md:p-10">
          <div className="max-w-6xl">
            <div className="mb-10">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
                Testimonials
              </h1>
              <p className="text-neutral-400">
                Manage your client feedback and reviews.
              </p>
            </div>
            <TestimonialListClient initialTestimonials={testimonials} />
          </div>
        </main>
      </div>
    </div>
  )
}
