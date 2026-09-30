"use client"

import { SiteSettingsValues } from "@/lib/schemas"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { FetchError } from "@/components/shared/FetchError"
import { AccountForm } from "@/components/admin/settings/AccountForm"
import { SocialsForm } from "@/components/admin/settings/SocialsForm"
import { HeroForm } from "@/components/admin/settings/HeroForm"
import { TrustedBrandsForm } from "@/components/admin/settings/TrustedBrandsForm"

export function SettingsClient({ currentEmail }: { currentEmail: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tabParam = searchParams.get("tab") as string
  const initialTab = (
    ["account", "hero", "brands", "socials"].includes(tabParam)
      ? tabParam
      : "account"
  ) as "account" | "hero" | "brands" | "socials"

  const [activeTab, setActiveTab] = useState<
    "account" | "hero" | "brands" | "socials"
  >(initialTab)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [settings, setSettings] = useState<Partial<SiteSettingsValues> | null>(
    null
  )

  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error(error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings()
  }, [fetchSettings])

  // Sync active tab to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get("tab") !== activeTab) {
      params.set("tab", activeTab)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [activeTab, pathname, router, searchParams])

  if (isError)
    return (
      <FetchError
        onRetry={fetchSettings}
        message="Failed to load settings data. Please try again."
      />
    )

  const tabs = [
    { id: "account", label: "Account" },
    { id: "hero", label: "Hero Section" },
    { id: "brands", label: "Trusted Brands" },
    { id: "socials", label: "Social Links" },
  ]

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="border-b border-neutral-800">
        <div className="flex flex-wrap gap-2 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "account" | "hero" | "brands" | "socials"
                )
              }
              className={`border-b-2 px-6 py-3 text-sm font-medium tracking-wider whitespace-nowrap uppercase transition-colors ${
                activeTab === tab.id
                  ? "border-brand-200 text-brand-200"
                  : "border-transparent text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
        {isLoading ? (
          <div className="w-full max-w-3xl animate-pulse space-y-8 overflow-hidden">
            <div className="space-y-2 border-b border-neutral-800/50 pb-6">
              <div className="h-8 w-3/4 max-w-[16rem] rounded-md bg-neutral-800" />
              <div className="h-4 w-full max-w-[24rem] rounded-md bg-neutral-800" />
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-md bg-neutral-800" />
                <div className="h-12 w-full max-w-xl rounded-xl bg-neutral-800" />
              </div>
              <div className="space-y-6 border-t border-neutral-800/50 pt-8">
                <div className="h-6 w-1/2 max-w-[12rem] rounded-md bg-neutral-800" />
                <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <div className="h-4 w-32 rounded-md bg-neutral-800" />
                    <div className="h-12 w-full max-w-xl rounded-xl bg-neutral-800" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded-md bg-neutral-800" />
                    <div className="h-12 w-full rounded-xl bg-neutral-800" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded-md bg-neutral-800" />
                    <div className="h-12 w-full rounded-xl bg-neutral-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "account" && (
              <AccountForm currentEmail={currentEmail} />
            )}

            {activeTab === "hero" && <HeroForm initialData={settings || {}} />}

            {activeTab === "brands" && (
              <TrustedBrandsForm initialData={settings || {}} />
            )}

            {activeTab === "socials" && (
              <SocialsForm initialData={settings || {}} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
