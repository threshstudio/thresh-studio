"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmAlertProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  loadingText?: string
  isLoading?: boolean
}

export function ConfirmAlert({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loadingText = "Deleting...",
  isLoading = false,
}: ConfirmAlertProps) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => !open && !isLoading && onClose()}
    >
      <AlertDialogContent className="max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border-neutral-800 bg-transparent text-white hover:bg-neutral-900 hover:text-white"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isLoading}
            className="rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? loadingText : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
