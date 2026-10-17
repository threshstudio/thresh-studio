import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin/AdminNav"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { NewsletterAdminClient } from "@/components/admin/newsletter/NewsletterAdminClient"

export const metadata = {
  title: "Newsletter & Audience | Thresh Studio Admin",
}

export default async function AdminNewsletterPage() {
  const session = await auth()
  if (!session) redirect("/admin/login")

  return (
    <div className="flex min-h-screen text-neutral-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNav />
        <main className="mx-auto w-full max-w-7xl p-6 pb-20 md:p-10">
          <NewsletterAdminClient
            adminEmail={session.user?.email || undefined}
          />
        </main>
      </div>
    </div>
  )
}
