"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Video, Eye, EyeOff, Edit, Trash2 } from "lucide-react"
import { ProjectFormValues } from "@/lib/schemas"
import { ConfirmAlert } from "@/components/ui/confirm-alert"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"

export function DashboardRecentProjects({
  projects,
}: {
  projects: (Partial<ProjectFormValues> & { id?: string; slug?: string })[]
}) {
  const router = useRouter()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirmDeleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/projects/${confirmDeleteId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      toast.success("Project deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project"
      )
    } finally {
      setIsDeleting(false)
      setConfirmDeleteId(null)
    }
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-neutral-800 bg-neutral-900/30 text-xs tracking-wider text-neutral-500 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Project</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {projects.map(
              (project) =>
                project && (
                  <tr
                    key={project.id}
                    className="transition-colors hover:bg-neutral-800/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {project.videoUrl ||
                        (project.gallery && project.gallery[0]) ? (
                          project.videoUrl ? (
                            <div className="relative inline-block">
                              <video
                                src={project.videoUrl}
                                className="h-8 w-12 rounded bg-neutral-800 object-cover"
                                muted
                                playsInline
                              />
                              <div className="absolute -right-1 -bottom-1 z-10">
                                <VideoMuteButton size="xs" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={project.gallery?.[0]}
                              alt={project.title}
                              className="h-8 w-12 rounded bg-neutral-800 object-cover"
                            />
                          )
                        ) : (
                          <div className="flex h-8 w-12 items-center justify-center rounded bg-neutral-800">
                            <Video className="h-4 w-4 text-neutral-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-neutral-200">
                            {project.title}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {project.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {project.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                          project.isPublished
                            ? "border-brand-500/20 bg-brand-500/10 text-brand-300"
                            : "border-neutral-500/20 bg-neutral-500/10 text-neutral-400"
                        }`}
                      >
                        {project.isPublished ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                        {project.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="rounded p-2 text-neutral-400 transition-colors hover:bg-brand-500/10 hover:text-brand-500"
                          title="Edit project"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() =>
                            setConfirmDeleteId(project.id as string)
                          }
                          className="rounded p-2 text-red-500 transition-colors hover:bg-red-500/10"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 p-4 md:hidden">
        {projects.map(
          (project) =>
            project && (
              <div
                key={project.id}
                className="flex flex-col gap-4 rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-4 transition-colors hover:bg-neutral-800/30"
              >
                <div className="flex items-center gap-4">
                  {project.videoUrl ||
                  (project.gallery && project.gallery[0]) ? (
                    project.videoUrl ? (
                      <div className="relative inline-block">
                        <video
                          src={project.videoUrl}
                          className="h-12 w-16 rounded-md bg-neutral-800 object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute -right-1 -bottom-1 z-10">
                          <VideoMuteButton size="xs" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={project.gallery?.[0]}
                        alt={project.title}
                        className="h-12 w-16 rounded-md bg-neutral-800 object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-12 w-16 items-center justify-center rounded-md bg-neutral-800">
                      <Video className="h-5 w-5 text-neutral-500" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-neutral-200">
                      {project.title}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {project.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-800/50 pt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      project.isPublished
                        ? "border-brand-500/20 bg-brand-500/10 text-brand-300"
                        : "border-neutral-500/20 bg-neutral-500/10 text-neutral-400"
                    }`}
                  >
                    {project.isPublished ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {project.isPublished ? "Published" : "Draft"}
                  </span>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-brand-500/10 hover:text-brand-500"
                      title="Edit project"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmDeleteId(project.id as string)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
        )}
      </div>

      <ConfirmAlert
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project?"
        description="Are you sure you want to delete this project? This action cannot be undone and will permanently remove it from your portfolio."
        isLoading={isDeleting}
      />
    </>
  )
}
