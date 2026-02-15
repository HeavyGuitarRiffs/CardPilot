"use client";

import Image from "next/image";
import FadeInSection from "./FadeInSection";

const creators = [
  {
    name: "Alex Rivera",
    role: "Music Creator",
    image: "/creators/alex.jpg",
    quote: "Social Like showed me influence I didn’t even know I had."
  },
  {
    name: "Maya Chen",
    role: "Fashion Influencer",
    image: "/creators/maya.jpg",
    quote: "Finally a dashboard that understands creators."
  },
  {
    name: "Jordan Blake",
    role: "YouTuber",
    image: "/creators/jordan.jpg",
    quote: "My brand deals doubled after using Social Like."
  },
];

export default function Testimonials() {
  return (
    <FadeInSection>
      <section className="py-32 px-10 bg-base-100">
        <div className="max-w-6xl mx-auto space-y-16">
          <h2 className="text-4xl md:text-6xl font-extrabold text-center">
            Loved by Creators Everywhere
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {creators.map((c) => (
              <div
                key={c.name}
                className="p-10 bg-base-200 rounded-3xl shadow-xl text-center space-y-4"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto"
                />
                <p className="italic text-lg">“{c.quote}”</p>
                <p className="font-bold mt-2">{c.name}</p>
                <p className="text-sm opacity-60">{c.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
