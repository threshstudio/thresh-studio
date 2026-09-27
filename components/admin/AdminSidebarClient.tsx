"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LogOut,
  LayoutDashboard,
  Video,
  Settings,
  ExternalLink,
  User,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { ConfirmAlert } from "@/components/ui/confirm-alert"

export function AdminSidebarClient({
  email,
  isMobile = false,
}: {
  email: string | null | undefined
  isMobile?: boolean
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: "/admin/login" })
  }

  const links = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      disabled: false,
    },
    { name: "Projects", href: "/admin/projects", icon: Video, disabled: false },
    {
      name: "Testimonials",
      href: "/admin/testimonials",
      icon: MessageSquare,
      disabled: false,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      disabled: false,
    },
  ]

  return (
    <>
      <aside
        className={`relative flex h-screen flex-shrink-0 flex-col border-r border-neutral-800/60 bg-neutral-950/60 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out ${isMobile ? "w-full" : isCollapsed ? "sticky top-0 hidden w-20 md:flex" : "sticky top-0 hidden w-64 md:flex"}`}
      >
        {/* Collapse Toggle (Desktop Only) */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-6 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-neutral-400 shadow-lg transition-colors hover:border-brand-400 hover:bg-brand-500 hover:text-white"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        <div
          className={`flex h-20 items-center overflow-hidden border-b border-neutral-800/60 transition-all ${isCollapsed ? "justify-center px-0" : "px-8"}`}
        >
          {!isCollapsed && (
            <Link
              href="/admin/dashboard"
              className="group flex flex-shrink-0 items-center"
            >
              <img
                src="/logo.png"
                alt="Thresh Studio"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          )}
        </div>

        <nav className="hide-scrollbar flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto py-4">
          {!isCollapsed ? (
            <div className="mt-2 mb-4 px-7 text-xs font-bold tracking-[0.15em] text-neutral-500 uppercase">
              Menu
            </div>
          ) : (
            <div className="h-8" />
          )}

          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.name}
                href={link.disabled ? "#" : link.href}
                className={`group relative flex items-center gap-3 rounded-lg py-3 transition-all duration-300 ${
                  isCollapsed ? "mx-4 justify-center px-0" : "mx-4 px-4"
                } ${link.disabled ? "pointer-events-none opacity-40" : ""} ${
                  isActive
                    ? "bg-brand-500/15 text-brand-200"
                    : "text-neutral-300 hover:bg-neutral-900/80 hover:text-white"
                }`}
                title={isCollapsed ? link.name : undefined}
              >
                {isActive && (
                  <div className="absolute top-2 bottom-2 left-0 w-1 rounded-r-full bg-brand-200" />
                )}
                <link.icon
                  className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-brand-200" : "text-neutral-400 transition-colors group-hover:text-neutral-200"}`}
                />

                {!isCollapsed && (
                  <>
                    <span className="text-[15px] font-medium tracking-wide whitespace-nowrap">
                      {link.name}
                    </span>
                    {link.disabled && (
                      <span className="ml-auto rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                        Soon
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}

          <div className="mt-8 mb-4">
            {!isCollapsed && (
              <div className="mb-4 px-7 text-xs font-bold tracking-[0.15em] text-neutral-500 uppercase">
                External
              </div>
            )}
            <a
              href="/"
              target="_blank"
              className={`group flex items-center gap-3 rounded-lg py-3 text-neutral-300 transition-all duration-300 hover:bg-neutral-900/80 hover:text-white ${
                isCollapsed ? "mx-4 justify-center px-0" : "mx-4 px-4"
              }`}
              title={isCollapsed ? "View Live Site" : undefined}
            >
              <ExternalLink className="h-5 w-5 flex-shrink-0 text-neutral-400 transition-colors group-hover:text-neutral-200" />
              {!isCollapsed && (
                <span className="text-[15px] font-medium tracking-wide whitespace-nowrap">
                  View Live Site
                </span>
              )}
            </a>
          </div>
        </nav>

        <div className="overflow-hidden border-t border-neutral-800/60 bg-neutral-900/20 p-4">
          <div
            className={`mb-2 flex items-center gap-3 rounded-xl border border-neutral-800/60 bg-neutral-900/60 shadow-inner transition-all ${isCollapsed ? "justify-center p-2" : "px-4 py-3.5"}`}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 shadow-sm">
              <User className="h-4 w-4 text-neutral-300" />
            </div>
            {!isCollapsed && (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-bold text-neutral-100">
                  Admin User
                </span>
                <span className="mt-0.5 truncate text-xs text-neutral-400">
                  {email}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSignOutConfirmOpen(true)}
            className={`group flex w-full items-center gap-2 rounded-xl border border-transparent py-3 text-sm font-bold tracking-widest text-neutral-300 uppercase transition-all hover:border-brand-500/20 hover:bg-brand-500/10 hover:text-brand-200 ${isCollapsed ? "justify-center px-0" : "justify-center px-4"}`}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut
              className={`h-4 w-4 ${!isCollapsed ? "group-hover:-translate-x-0.5" : ""} flex-shrink-0 transition-transform`}
            />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <ConfirmAlert
        isOpen={isSignOutConfirmOpen}
        onClose={() => setIsSignOutConfirmOpen(false)}
        onConfirm={handleSignOut}
        title="Sign Out"
        description="Are you sure you want to sign out of the admin panel?"
        confirmText="Sign Out"
        loadingText="Signing out..."
        isLoading={isSigningOut}
      />
    </>
  )
}
