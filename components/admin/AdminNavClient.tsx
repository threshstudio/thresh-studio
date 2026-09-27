"use client"

import React, { useState } from "react"
import Link from "next/link"
import { LogOut, Menu } from "lucide-react"
import { signOut } from "next-auth/react"
import { ConfirmAlert } from "@/components/ui/confirm-alert"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { AdminSidebarClient } from "./AdminSidebarClient"

export function AdminNavClient({ email }: { email?: string | null }) {
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-xl md:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger className="cursor-pointer text-neutral-400 transition-colors hover:text-white">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 border-none bg-transparent p-0"
              >
                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                <AdminSidebarClient email={email} isMobile />
              </SheetContent>
            </Sheet>

            <Link href="/admin/dashboard" className="flex items-center">
              <img
                src="/logo.png"
                alt="Thresh Studio"
                className="h-6 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-neutral-500 sm:inline-block">
              {email}
            </span>
            <button
              onClick={() => setIsSignOutConfirmOpen(true)}
              className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

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
