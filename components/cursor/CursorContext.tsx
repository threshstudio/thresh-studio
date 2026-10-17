"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

import { CursorState } from "@/types"
export type { CursorState }

interface CursorContextType {
  cursorState: CursorState
  setCursorState: (state: CursorState) => void
  // Used for magnetic attraction target
  magneticTarget: HTMLElement | null
  setMagneticTarget: (element: HTMLElement | null) => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>("default")
  const [magneticTarget, setMagneticTarget] = useState<HTMLElement | null>(null)

  return (
    <CursorContext.Provider
      value={{ cursorState, setCursorState, magneticTarget, setMagneticTarget }}
    >
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  const context = useContext(CursorContext)
  if (context === undefined) {
    throw new Error("useCursor must be used within a CursorProvider")
  }
  return context
}

export function useOptionalCursor() {
  return useContext(CursorContext)
}
