"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trees, Waves, Music, Heart, Skull, Shield } from "lucide-react"
import Image from "next/image"

export default function WorldSection() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00aaff]">
            TWO WORLDS
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From the paradise of Krash World to the dystopian reality of post-apocalyptic Earth - explore the
            contrasting realms that shape GRLKRASH's journey.
          </p>
        </div>

        {/* Krash World */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-8">
            <Trees className="h-8 w-8 text-[#00ff88] mr-4" />
            <h2 className="text-4xl md:text-5xl font-black text-[#00ff88]">KRASH WORLD</h2>
            <Trees className="h-8 w-8 text-[#00ff88] ml-4" />
          </div>

          <Card className="bg-gradient-to-r from-[#00ff88]/10 to-[#00aaff]/10 border-[#00ff88]/30 mb-8">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-black text-[#00ff88] mb-4">THE LOST PARADISE</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    A distant planet of unimaginable beauty - green sprawling oases, crystal-clear waterfalls, blue
                    streams and rivers. Like Earth's most beautiful places, perfectly preserved and touched with magic.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Music className="h-5 w-5" />, text: "Music makes you float" },
                      { icon: <Heart className="h-5 w-5" />, text: "Community is like air" },
                      { icon: <Trees className="h-5 w-5" />, text: "Harmony with nature" },
                      { icon: <Waves className="h-5 w-5" />, text: "Sacred tree of life" },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-[#00ff88]">
                        {feature.icon}
                        <span className="ml-2 text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative h-64 lg:h-80">
                  <Image
                    src="/images/grlkrash-nature.png"
                    alt="Krash World Paradise"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earth */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <Skull className="h-8 w-8 text-[#ff6b9d] mr-4" />
            <h2 className="text-4xl md:text-5xl font-black text-[#ff6b9d]">POST-APOCALYPTIC EARTH</h2>
            <Skull className="h-8 w-8 text-[#ff6b9d] ml-4" />
          </div>

          <Card className="bg-gradient-to-r from-[#ff6b9d]/10 to-red-900/10 border-[#ff6b9d]/30 mb-8">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 lg:h-80">
                  <Image
                    src="/images/grlkrash-floating.png"
                    alt="Post-Apocalyptic Earth"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#ff6b9d] mb-4">THE FALLEN WORLD</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    After the end of the world, a new order emerged. The New World Empire (NWE) controls everything,
                    especially music and creative expression. The Malefs - dark, ghastly floating orbs - serve as their
                    enforcers.
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        label: "NEW WORLD EMPIRE",
                        desc: "Totalitarian regime controlling media and music",
                        color: "#ff6b9d",
                      },
                      { label: "THE MALEFS", desc: "Dark floating orbs that police the population", color: "#ff4757" },
                      {
                        label: "MUSIC BANNED",
                        desc: "Only NWE-approved AI can create music legally",
                        color: "#ff3838",
                      },
                    ].map((threat, index) => (
                      <div key={index} className="flex items-start">
                        <Badge
                          variant="outline"
                          className="mr-3 mt-1 text-xs"
                          style={{ borderColor: threat.color, color: threat.color }}
                        >
                          {threat.label}
                        </Badge>
                        <span className="text-gray-300 text-sm">{threat.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* The Bridge */}
        <Card className="bg-gradient-to-r from-[#ffda0f]/10 to-[#ff6b9d]/10 border-[#ffda0f]/30">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-[#ffda0f] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">BRINGING KRASH WORLD TO EARTH</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              GRLKRASH carries the ethos and heart of her people to the big blue planet. She brings the values of love,
              community, and harmony with nature to fight against the oppressive forces that have taken over Earth.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                { title: "LOVE AS RESISTANCE", desc: "Using the power of love to fight oppression", color: "#ff6b9d" },
                { title: "ART AS WEAPON", desc: "Creative expression against authoritarian control", color: "#ffda0f" },
                { title: "COMMUNITY AS STRENGTH", desc: "Building connections in a divided world", color: "#00ff88" },
              ].map((principle, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-black mb-2" style={{ color: principle.color }}>
                    {principle.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{principle.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
