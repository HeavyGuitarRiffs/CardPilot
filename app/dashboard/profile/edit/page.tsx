// app/dashboard/profile/edit/page.tsx

"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { Button } from "@/components/ui/button"
import AvatarUploader from "@/components/profile/AvatarUploader"
import { loadAvatar } from "@/lib/avatar"

export default function EditProfilePage() {
  const supabase = getSupabaseBrowserClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [country, setCountry] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string>("") // must be string

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("user_avatars")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profile) {
        setDisplayName(profile.display_name || "")
        setBio(profile.bio || "")
        setCountry(profile.country || "")
        setAvatarUrl(profile.avatar_url || loadAvatar() || "")
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  async function saveProfile() {
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from("user_avatars")
      .upsert({
        user_id: user.id,
        display_name: displayName,
        bio,
        country,
        avatar_url: avatarUrl || "" // must be string
      })

    setSaving(false)
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="max-w-xl mx-auto space-y-6 py-10">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      <AvatarUploader onAvatarChange={setAvatarUrl} />

      <div className="space-y-4">
        <input
          className="input input-bordered w-full"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
        />

        <textarea
          className="textarea textarea-bordered w-full"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />

        <input
          className="input input-bordered w-full"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
        />
      </div>

      <Button className="w-full" onClick={saveProfile} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}