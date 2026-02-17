//components\profile\AvatarUploader.tsx
"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { saveAvatar, loadAvatar } from "@/lib/avatar"

type AvatarUploaderProps = {
  onAvatarChange?: (base64: string) => void
}

export default function AvatarUploader({ onAvatarChange }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatar, setAvatar] = useState<string | null>(() => {
    return typeof window !== "undefined" ? loadAvatar() : null
  })

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setAvatar(base64)
      saveAvatar(base64)

      // 🔥 NEW: notify parent component
      if (onAvatarChange) onAvatarChange(base64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-base-200">
        {avatar ? (
          <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm opacity-50">
            No avatar
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Button size="sm" onClick={() => fileInputRef.current?.click()}>
          Upload avatar
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        <p className="text-xs opacity-60">JPG or PNG · Square works best</p>
      </div>
    </div>
  )
}