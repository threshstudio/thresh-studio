import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getTestimonialById } from "@/lib/services/testimonialService"
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminNav } from "@/components/admin/AdminNav"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export const metadata = {
  title: "Edit Testimonial | Thresh Studio Admin",
}

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/admin/login")

  const { id } = await params
  const testimonial = await getTestimonialById(id)

  if (!testimonial) {
    redirect("/admin/testimonials")
  }

  return (
    <div className="flex min-h-screen text-neutral-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNav />
        <main className="mx-auto w-full max-w-7xl space-y-8 p-6 pb-20 md:p-10">
          <div className="max-w-6xl">
            <div className="mb-10">
              <Link
                href="/admin/testimonials"
                className="mb-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-neutral-500 uppercase transition-colors hover:text-brand-300"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Testimonials
              </Link>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
                Edit Testimonial
              </h1>
              <p className="text-neutral-400">
                Update the client review details.
              </p>
            </div>
            <TestimonialForm initialData={testimonial} />
          </div>
        </main>
      </div>
    </div>
  )
}
