"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Zap, Globe } from "lucide-react"
import Image from "next/image"

export default function StorySection() {
  const storyBeats = [
    {
      title: "EXILE FROM PARADISE",
      description:
        "GRLKRASH lived on Krash World - a beautiful planet of green oases, waterfalls, and harmony with nature. But her curiosity went too far when she completed the sacred stone in the Tree of Life, accidentally destroying the moon of Ooo.",
      icon: <Globe className="h-6 w-6" />,
      color: "#00ff88",
      image: "/images/grlkrash-nature.png",
    },
    {
      title: "ARRIVAL ON EARTH",
      description:
        "Exiled and alone, GRLKRASH arrived on post-apocalyptic Earth. Her attempts to connect with humans failed terribly - they were terrified of her alien nature. Lonely and desperate, she cloned herself for company.",
      icon: <Heart className="h-6 w-6" />,
      color: "#ff6b9d",
      image: "/images/grlkrash-sky.png",
    },
    {
      title: "THE TOY EMPIRE",
      description:
        "A struggling woman discovered GRLKRASH and her clones, mistaking them for advanced toys. This sparked a multibillion-dollar toy empire - until some toys 'cracked' and revealed their sentience, causing worldwide panic.",
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
            From a distant paradise to Earth's resistance fighter - discover how GRLKRASH became the unlikely hero our
            world desperately needs.
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
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">THE RESISTANCE BEGINS</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Now GRLKRASH fights against the New World Empire and their dark forces, using truth, art, and love as
              weapons. She's no longer alone - she has Jules and a growing resistance movement.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold">
                JOIN THE RESISTANCE
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
              desc: "Love is patient, love is kind, and love fights back against oppression",
              color: "#ff6b9d",
            },
            {
              title: "TRUTH & RESISTANCE",
              desc: "Using art, music, and connection as weapons against dark forces",
              color: "#ffda0f",
            },
            {
              title: "COMMUNITY & BELONGING",
              desc: "Finding family and purpose in the fight for freedom",
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
