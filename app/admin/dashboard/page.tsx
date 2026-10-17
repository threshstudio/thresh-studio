import React from "react"
import Link from "next/link"
import { Plus, Video, Eye, EyeOff } from "lucide-react"
import { getProjects } from "@/lib/services/projectService"
import { AdminNav } from "@/components/admin/AdminNav"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { EmptyState } from "@/components/shared/EmptyState"
import { DashboardRecentProjects } from "@/components/admin/dashboard/DashboardRecentProjects"

export const metadata = {
  title: "Admin Dashboard | Thresh Studio",
}

export default async function DashboardPage() {
  const projectsRaw = await getProjects()
  const projects = JSON.parse(JSON.stringify(projectsRaw))

  return (
    <div className="flex min-h-screen text-neutral-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNav />
        <main className="mx-auto w-full max-w-7xl space-y-8 p-6 pb-20 md:p-10">
          <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-widest text-white uppercase">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                Manage your portfolio projects and site content.
              </p>
            </div>

            <Link
              href="/admin/projects/new"
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-200 px-6 py-3 text-sm font-bold tracking-widest text-neutral-950 uppercase shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-100"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </header>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col justify-center rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="mb-2 flex items-center gap-4 text-brand-500">
                <Video className="h-6 w-6" />
                <h3 className="text-lg font-medium tracking-wider text-neutral-300 uppercase">
                  Total Projects
                </h3>
              </div>
              <p className="text-4xl font-bold text-white">{projects.length}</p>
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="mb-2 flex items-center gap-4 text-brand-300">
                <Eye className="h-6 w-6" />
                <h3 className="text-lg font-medium tracking-wider text-neutral-300 uppercase">
                  Published
                </h3>
              </div>
              <p className="text-4xl font-bold text-white">
                {
                  projects.filter(
                    (p: { isPublished?: boolean }) => p?.isPublished
                  ).length
                }
              </p>
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="mb-2 flex items-center gap-4 text-neutral-500">
                <EyeOff className="h-6 w-6" />
                <h3 className="text-lg font-medium tracking-wider text-neutral-300 uppercase">
                  Drafts
                </h3>
              </div>
              <p className="text-4xl font-bold text-white">
                {
                  projects.filter(
                    (p: { isPublished?: boolean }) => !p?.isPublished
                  ).length
                }
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/30">
            <div className="border-b border-neutral-800 bg-neutral-900/50 px-6 py-5">
              <h2 className="text-lg font-bold tracking-widest text-white uppercase">
                Recent Projects
              </h2>
            </div>

            {projects.length === 0 ? (
              <div className="p-10">
                <EmptyState
                  title="No projects yet"
                  description="Your portfolio is currently empty. Create your first project to get started."
                  action={{
                    label: "Create Project",
                    href: "/admin/projects/new",
                  }}
                />
              </div>
            ) : (
              <DashboardRecentProjects projects={projects} />
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
