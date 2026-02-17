//components\profile\SocialArchetypeCard.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ARCHETYPES = [
  {
    id: "poster",
    title: "Poster",
    description: "Creates original posts consistently",
    emoji: "📝",
  },
  {
    id: "commenter",
    title: "Commenter",
    description: "Engages daily through replies",
    emoji: "💬",
  },
  {
    id: "socialite",
    title: "Socialite",
    description: "Builds visibility through conversations",
    emoji: "🤝",
  },
  {
    id: "butterfly",
    title: "Social Butterfly",
    description: "High-volume engagement everywhere",
    emoji: "🦋",
  },
  {
    id: "surfer",
    title: "Web Surfer",
    description: "Light engagement, mostly browsing",
    emoji: "🌊",
  },
  {
    id: "drifter",
    title: "Drifter",
    description: "Inconsistent but curious",
    emoji: "🧭",
  },
]

type Props = {
  value: string | null
  onChange: (id: string) => void
}

export default function SocialArchetypeCard({ value, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Style</CardTitle>
      </CardHeader>

      <CardContent className="grid md:grid-cols-2 gap-4">
        {ARCHETYPES.map((type) => {
          const selected = value === type.id

          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={`group rounded-xl border p-4 text-left transition
                ${selected 
                  ? "border-primary bg-primary/10" 
                  : "border-base-300 hover:border-primary hover:bg-primary/5"
                }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{type.emoji}</span>

                <div>
                  <p className={`font-semibold ${selected ? "text-primary" : "group-hover:text-primary"}`}>
                    {type.title}
                  </p>
                  <p className="text-sm opacity-70">{type.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}