"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Users,
  PenTool,
  History,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Mail,
} from "lucide-react"
import { NewsletterComposerForm } from "./NewsletterComposerForm"
import { ConfirmAlert } from "@/components/ui/confirm-alert"
import { EmptyState } from "@/components/shared/EmptyState"
import { FetchError } from "@/components/shared/FetchError"

import { SubscriberItem, CampaignItem } from "@/types"
export type { SubscriberItem, CampaignItem }

export function NewsletterAdminClient({ adminEmail }: { adminEmail?: string }) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<
    "compose" | "subscribers" | "campaigns"
  >("compose")

  // Subscribers State
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Fetch Subscribers & Stats
  const {
    data: subscribersData,
    isLoading: isLoadingSubscribers,
    isError: isSubscribersError,
    refetch: refetchSubscribers,
  } = useQuery({
    queryKey: ["adminSubscribers", search, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      })
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(
        `/api/admin/newsletter/subscribers?${params.toString()}`
      )
      if (!res.ok) throw new Error("Failed to load subscribers")
      return res.json()
    },
  })

  // Fetch Campaigns History
  const {
    data: campaigns,
    isLoading: isLoadingCampaigns,
    isError: isCampaignsError,
    refetch: refetchCampaigns,
  } = useQuery<CampaignItem[]>({
    queryKey: ["adminCampaigns"],
    queryFn: async () => {
      const res = await fetch("/api/admin/newsletter/campaigns")
      if (!res.ok) throw new Error("Failed to load campaigns")
      return res.json()
    },
  })

  // Delete Subscriber Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete subscriber")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscribers"] })
      toast.success("Subscriber removed.")
      setDeleteId(null)
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete subscriber"
      )
    },
  })

  const activeSubscribersCount = subscribersData?.stats?.active || 0

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header & Stats Overview */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-brand-300 uppercase">
            <Mail className="h-4 w-4" />
            <span>Newsletter Management</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Email & Audience
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Craft rich cinematic updates with TipTap, upload brand visuals, and
            broadcast via Resend.
          </p>
        </div>

        {/* Audience Metrics Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-3 shadow-sm backdrop-blur-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
                Active Subscribers
              </p>
              <p className="text-lg font-bold text-white">
                {subscribersData?.stats?.active ?? "..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-3 shadow-sm backdrop-blur-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-800 text-neutral-400">
              <History className="h-4 w-4" />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
                Campaigns Sent
              </p>
              <p className="text-lg font-bold text-white">
                {campaigns?.length ?? "..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab("compose")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === "compose"
              ? "border-brand-400 text-brand-300"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          <span>Email Composer</span>
        </button>

        <button
          onClick={() => setActiveTab("subscribers")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === "subscribers"
              ? "border-brand-400 text-brand-300"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Subscribers ({subscribersData?.stats?.total ?? 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("campaigns")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === "campaigns"
              ? "border-brand-400 text-brand-300"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Broadcast History</span>
        </button>
      </div>

      {/* TAB 1: COMPOSE & BROADCAST */}
      {activeTab === "compose" && (
        <NewsletterComposerForm
          adminEmail={adminEmail}
          activeSubscribersCount={activeSubscribersCount}
        />
      )}

      {/* TAB 2: SUBSCRIBERS */}
      {activeTab === "subscribers" && (
        <div className="flex flex-col gap-6">
          {/* Filters Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search subscribers by email..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 py-2.5 pr-4 pl-10 text-xs text-neutral-100 placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase transition-colors ${
                  statusFilter === "all"
                    ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase transition-colors ${
                  statusFilter === "active"
                    ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("unsubscribed")}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase transition-colors ${
                  statusFilter === "unsubscribed"
                    ? "border border-brand-500/40 bg-brand-500/20 text-brand-300"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Unsubscribed
              </button>
            </div>
          </div>

          {/* Subscribers Content */}
          {isSubscribersError ? (
            <FetchError
              message="Failed to load subscribers list."
              onRetry={refetchSubscribers}
            />
          ) : isLoadingSubscribers ? (
            <div className="space-y-4 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-full animate-pulse rounded-lg bg-neutral-800/40"
                />
              ))}
            </div>
          ) : subscribersData?.subscribers?.length === 0 ? (
            <EmptyState
              title="No subscribers found"
              description={
                search
                  ? "No subscribers match your search filter."
                  : "Your audience is empty. Subscribers will appear here as people sign up."
              }
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-800 bg-neutral-900/60 font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
                  <tr>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Subscribed At</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {subscribersData?.subscribers?.map((sub: SubscriberItem) => (
                    <tr
                      key={sub.id}
                      className="transition-colors hover:bg-neutral-800/20"
                    >
                      <td className="px-6 py-4 font-medium text-neutral-100">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4">
                        {sub.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-400">
                            <AlertCircle className="h-3 w-3" /> Unsubscribed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-neutral-400 uppercase">
                        {sub.source}
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-400">
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteId(sub.id)}
                          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Delete subscriber"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CAMPAIGN HISTORY */}
      {activeTab === "campaigns" && (
        <div className="flex flex-col gap-6">
          {isCampaignsError ? (
            <FetchError
              message="Failed to load campaign broadcast history."
              onRetry={refetchCampaigns}
            />
          ) : isLoadingCampaigns ? (
            <div className="space-y-4 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded-lg bg-neutral-800/40"
                />
              ))}
            </div>
          ) : campaigns?.length === 0 ? (
            <EmptyState
              title="No broadcast history"
              description="You have not broadcasted any newsletters yet. Compose an update and dispatch it to your subscribers."
              action={{
                label: "Compose Newsletter",
                onClick: () => setActiveTab("compose"),
              }}
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-800 bg-neutral-900/60 font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
                  <tr>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Recipients</th>
                    <th className="px-6 py-4">Date Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {campaigns?.map((c) => (
                    <tr
                      key={c.id}
                      className="transition-colors hover:bg-neutral-800/20"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-neutral-100">
                          {c.subject}
                        </p>
                        {c.previewText && (
                          <p className="max-w-md truncate text-xs text-neutral-400">
                            {c.previewText}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-300 uppercase">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-neutral-300">
                        {c.recipientCount} delivered
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-400">
                        {c.sentAt || c.createdAt
                          ? new Date(
                              c.sentAt || c.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Alert */}
      <ConfirmAlert
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Remove Subscriber?"
        description="Are you sure you want to remove this subscriber? They will no longer receive broadcast emails."
        confirmText="Remove"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
