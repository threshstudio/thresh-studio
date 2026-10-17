"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  Eye,
  EyeOff,
  Loader2,
  Search,
} from "lucide-react"

import { ProjectFormValues } from "@/lib/schemas"
import { ConfirmAlert } from "@/components/ui/confirm-alert"
import { VideoMuteButton } from "@/components/media/VideoMuteButton"

export function ProjectListClient({
  initialProjects,
}: {
  initialProjects: (Partial<ProjectFormValues> & {
    id?: string
    slug?: string
  })[]
}) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })
      if (!res.ok) throw new Error("Failed to update status")

      setProjects(
        projects.map((p) =>
          p.id === id ? { ...p, isPublished: !currentStatus } : p
        )
      )
      toast.success(currentStatus ? "Project hidden" : "Project published")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async () => {
    if (!confirmDeleteId) return
    const id = confirmDeleteId
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete project")

      setProjects(projects.filter((p) => p.id !== id))
      toast.success("Project deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project"
      )
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (!p) return false
    return (
      (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    )
  })

  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 w-full rounded-2xl border border-neutral-800 bg-neutral-900/40 pr-4 pl-12 text-white shadow-inner transition-all placeholder:text-neutral-600 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50"
          />
        </div>

        <Link
          href="/admin/projects/new"
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-200 px-8 text-[13px] font-bold tracking-widest text-neutral-950 uppercase shadow-[0_0_20px_rgba(0,211,218,0.15)] transition-all hover:-translate-y-0.5 hover:bg-brand-100 hover:shadow-[0_0_30px_rgba(0,211,218,0.3)]"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Link>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-neutral-800 bg-neutral-900/20 p-20 text-neutral-500">
          <Video className="mb-6 h-16 w-16 opacity-20" />
          <h3 className="mb-2 text-xl font-bold tracking-tight text-white">
            No Projects Found
          </h3>
          <p className="font-mono text-sm tracking-widest uppercase">
            Create your first case study or adjust search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-neutral-800/60 bg-neutral-900/30 shadow-inner backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10"
            >
              {/* Media Preview */}
              <div className="relative aspect-[16/10] overflow-hidden border-b border-neutral-800/60 bg-neutral-950">
                {project.videoUrl ? (
                  <video
                    src={project.videoUrl}
                    className="h-full w-full object-cover opacity-60 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-800">
                    <Video className="h-10 w-10" />
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute top-5 left-5 rounded-full border border-brand-500/30 bg-brand-500/20 px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] text-brand-200 uppercase shadow-lg backdrop-blur-md">
                  {project.category}
                </div>

                <button
                  onClick={() =>
                    handleTogglePublish(
                      project.id as string,
                      project.isPublished || false
                    )
                  }
                  disabled={togglingId === project.id}
                  title={
                    project.isPublished ? "Hide project" : "Publish project"
                  }
                  className="absolute top-5 right-5 rounded-full border border-white/5 bg-black/40 p-2 text-neutral-400 backdrop-blur-md transition-colors hover:border-brand-500/50 hover:text-brand-300 disabled:opacity-50"
                >
                  {togglingId === project.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-brand-300" />
                  ) : project.isPublished ? (
                    <Eye className="h-4 w-4 text-brand-300" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>

                <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between">
                  <div>
                    <h3 className="mb-1 text-2xl leading-none font-bold tracking-wider text-white uppercase drop-shadow-lg">
                      {project.title}
                    </h3>
                    <p className="font-mono text-[10px] tracking-widest text-brand-100/70 uppercase">
                      /{project.slug}
                    </p>
                  </div>
                  {project.videoUrl && <VideoMuteButton size="sm" />}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <p className="mb-8 line-clamp-2 flex-1 text-sm leading-relaxed font-light text-neutral-400">
                  {project.tagline}
                </p>

                <div className="mt-auto flex items-center gap-3">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-[11px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-brand-200"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit Project
                  </Link>
                  <button
                    onClick={() => setConfirmDeleteId(project.id as string)}
                    disabled={deletingId === project.id}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
                  >
                    {deletingId === project.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmAlert
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project?"
        description="Are you sure you want to delete this project? This action cannot be undone and will permanently remove it from your portfolio."
        isLoading={!!deletingId}
      />
    </div>
  )
}
