"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Zap, Globe } from "lucide-react"
import Image from "next/image"

export default function StorySection() {
  const storyBeats = [
    {
      title: "IN THE BEGINNING",
      description:
        "Darkness plagued the earth. But beyond it lies Krash World - paradise, where all life comes from and where God dwells. The Tree of Life grows there, and the music is so pure it makes you float.",
      icon: <Globe className="h-6 w-6" />,
      color: "#00ff88",
      image: "/images/grlkrash-nature.png",
    },
    {
      title: "THE BREATH OF LIFE",
      description:
        "Jules, a 13-year-old girl with a gift for music, was crying - and God heard her cries. He breathed the breath of life into a toy, and GRLKRASH became a living soul, made to be a comfort to her.",
      icon: <Heart className="h-6 w-6" />,
      color: "#ff6b9d",
      image: "/images/grlkrash-sky.png",
    },
    {
      title: "A TOY IN A STRANGE WORLD",
      description:
        "A brightly colored, stylized toy walking around a world that wasn't built for her, GRLKRASH doesn't fit in - and people stare. But she knows who made her, and why.",
      icon: <Zap className="h-6 w-6" />,
      color: "#ffda0f",
      image: "/images/grlkrash-viral.png",
    },
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ffda0f] to-[#00ff88]">
            THE ORIGIN STORY
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From an ordinary toy to a living soul - discover how GRLKRASH became the unlikely hero our world
            desperately needs.
          </p>
        </div>

        {/* Story Timeline */}
        <div className="space-y-12 mb-16">
          {storyBeats.map((beat, index) => (
            <Card key={index} className="bg-black/40 border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className={`flex flex-col lg:flex-row ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Image */}
                  <div className="lg:w-1/2 relative h-64 lg:h-auto">
                    <Image src={beat.image || "/placeholder.svg"} alt={beat.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <div
                        className="p-3 rounded-full mr-4"
                        style={{ backgroundColor: `${beat.color}20`, color: beat.color }}
                      >
                        {beat.icon}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: beat.color, color: beat.color }}
                      >
                        CHAPTER {index + 1}
                      </Badge>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black mb-4" style={{ color: beat.color }}>
                      {beat.title}
                    </h3>

                    <p className="text-gray-300 text-lg leading-relaxed">{beat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current State */}
        <Card className="bg-gradient-to-r from-[#ffda0f]/10 to-[#00ff88]/10 border-[#ffda0f]/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">THE MISSION BEGINS</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Now GRLKRASH and Jules stand together against the darkness - protecting the meek, searching for the
              other toys like her, and bringing light wherever the darkness spreads.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold">
                FOLLOW THE STORY
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black font-bold"
              >
                MEET THE CHARACTERS
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Themes */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "LOVE & SACRIFICE",
              desc: "Love is patient, love is kind - and love endures all things",
              color: "#ff6b9d",
            },
            {
              title: "LIGHT & DARKNESS",
              desc: "The light shines in the darkness, and the darkness has not overcome it",
              color: "#ffda0f",
            },
            {
              title: "FAITH & BELONGING",
              desc: "Made on purpose, for a purpose - even when you don't fit in",
              color: "#00ff88",
            },
          ].map((theme, index) => (
            <Card key={index} className="bg-black/40 border-gray-800 text-center">
              <CardContent className="p-6">
                <h3 className="text-xl font-black mb-4" style={{ color: theme.color }}>
                  {theme.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{theme.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
