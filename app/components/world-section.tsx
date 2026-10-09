"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trees, Waves, Music, Heart, Moon, Shield } from "lucide-react"
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
            From the paradise of Krash World to an earth plagued by darkness - explore the realms that shape
            GRLKRASH's journey.
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
                  <h3 className="text-2xl font-black text-[#00ff88] mb-4">PARADISE</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Not a planet, but a realm beyond Earth - paradise, where all life comes from and where God dwells.
                    Everything good about Earth's most beautiful places, made perfect.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Music className="h-5 w-5" />, text: "Music makes you float" },
                      { icon: <Heart className="h-5 w-5" />, text: "Where all life comes from" },
                      { icon: <Waves className="h-5 w-5" />, text: "Everyone dances together" },
                      { icon: <Trees className="h-5 w-5" />, text: "The Tree of Life" },
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
            <Moon className="h-8 w-8 text-[#ff6b9d] mr-4" />
            <h2 className="text-4xl md:text-5xl font-black text-[#ff6b9d]">AN EARTH IN DARKNESS</h2>
            <Moon className="h-8 w-8 text-[#ff6b9d] ml-4" />
          </div>

          <Card className="bg-gradient-to-r from-[#ff6b9d]/10 to-red-900/10 border-[#ff6b9d]/30 mb-8">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 lg:h-80">
                  <Image
                    src="/images/grlkrash-floating.png"
                    alt="Earth in darkness"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#ff6b9d] mb-4">THE DARKNESS</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Darkness plagues the earth, and evil agendas are spreading. Someone rules the darkness - but no
                    one knows their name yet. And the darkness has servants.
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        label: "THE MALEFS",
                        desc: "The hearers - dark floating orbs that lurk, listen and report back",
                        color: "#ff6b9d",
                      },
                      {
                        label: "WHISPERS",
                        desc: "They tempt and deceive, stirring up fear and anger - then feed off it",
                        color: "#ff4757",
                      },
                      {
                        label: "TWISTED COPIES",
                        desc: "Toys made by the darkness in GRLKRASH's image",
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
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">BRINGING LIGHT TO EARTH</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              GRLKRASH carries the light of Krash World into a world that needs it. With love, music, and courage, she
              and Jules push back the darkness - and protect the meek.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                { title: "LOVE OVER FEAR", desc: "Perfect love casts out fear", color: "#ff6b9d" },
                { title: "LIGHT IN THE DARKNESS", desc: "Shining wherever the darkness spreads", color: "#ffda0f" },
                { title: "PROTECT THE MEEK", desc: "Standing up for the weak, always", color: "#00ff88" },
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
