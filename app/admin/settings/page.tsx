import React, { Suspense } from "react"
import { AdminNav } from "@/components/admin/AdminNav"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SettingsClient } from "./SettingsClient"
import { PageSkeleton } from "@/components/shared/PageSkeleton"
import { auth } from "@/auth"
import { getAdminUserById } from "@/lib/services/admin"

export const metadata = {
  title: "Settings | Thresh Studio Admin",
}

export default async function SettingsPage() {
  const session = await auth()
  let currentEmail = session?.user?.email || ""

  if (session?.user?.id) {
    const user = await getAdminUserById(session.user.id)
    if (user && user.email) {
      currentEmail = user.email
    }
  }

  return (
    <div className="flex min-h-screen text-neutral-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNav />
        <main className="mx-auto w-full max-w-7xl space-y-8 p-6 pb-20 md:p-10">
          <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-widest text-white uppercase">
                Settings
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                Manage your global site content and account preferences.
              </p>
            </div>
          </header>

          <Suspense fallback={<PageSkeleton variant="form" />}>
            <SettingsClient currentEmail={currentEmail} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
