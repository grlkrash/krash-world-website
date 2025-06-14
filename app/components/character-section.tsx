"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Heart, Shield, Music, Brain, Sparkles } from "lucide-react"
import Image from "next/image"

export default function CharacterSection() {
  const grlkrashTraits = {
    strengths: [
      { trait: "Super Strength", desc: "Can support objects 100x her size", icon: <Zap className="h-4 w-4" /> },
      { trait: "Loyal & Brave", desc: "Will sacrifice herself for friends", icon: <Heart className="h-4 w-4" /> },
      { trait: "Pragmatic", desc: "Does the right thing even if it means death", icon: <Shield className="h-4 w-4" /> },
      { trait: "Musical Connection", desc: "Music can send her into overdrive", icon: <Music className="h-4 w-4" /> },
    ],
    weaknesses: [
      { trait: "Not the Sharpest", desc: "Sometimes misses obvious things", icon: <Brain className="h-4 w-4" /> },
      { trait: "Childlike Nature", desc: "Innocent and trusting", icon: <Sparkles className="h-4 w-4" /> },
      {
        trait: "Prone to Depression",
        desc: "Can fall into deep existential sadness",
        icon: <Heart className="h-4 w-4" />,
      },
    ],
  }

  const julesTraits = {
    strengths: [
      { trait: "Quick-Witted", desc: "Smart and musically gifted", icon: <Brain className="h-4 w-4" /> },
      { trait: "Kind & Amicable", desc: "Natural connector and friend", icon: <Heart className="h-4 w-4" /> },
      { trait: "Musical Ability", desc: "Uses music to help save the world", icon: <Music className="h-4 w-4" /> },
    ],
    weaknesses: [
      { trait: "Lacks Confidence", desc: "Struggles with self-belief", icon: <Shield className="h-4 w-4" /> },
      { trait: "Anxious", desc: "Tends to overthink situations", icon: <Brain className="h-4 w-4" /> },
      { trait: "Can Be Lazy", desc: "Sometimes avoids taking action", icon: <Sparkles className="h-4 w-4" /> },
    ],
  }

  const quotes = [
    { character: "GRLKRASH", quote: "Sick! Ready to save the world?", color: "#00ff88" },
    {
      character: "GRLKRASH",
      quote: "Love is patient, love is kind, love does not boast, love endures all.",
      color: "#ff6b9d",
    },
    { character: "GRLKRASH", quote: "Let's go! The resistance needs us!", color: "#ffda0f" },
    { character: "JULES", quote: "Sometimes I miss what's right in front of my face...", color: "#00aaff" },
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b9d] to-[#ffda0f]">
            THE HEROES
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Meet the unlikely duo fighting to save Earth from the forces of oppression - an exiled alien warrior and a
            musically gifted human companion.
          </p>
        </div>

        {/* GRLKRASH Profile */}
        <div className="mb-20">
          <Card className="bg-gradient-to-r from-[#00ff88]/10 to-[#ff6b9d]/10 border-[#00ff88]/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-96">
                  <Image src="/images/grlkrash-nature.png" alt="GRLKRASH" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <h2 className="text-4xl font-black text-[#00ff88] mr-4">GRLKRASH</h2>
                    <Badge variant="outline" className="text-[#00ff88] border-[#00ff88]">
                      ALIEN WARRIOR
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    An exiled toy-turned-resistance-leader from the distant planet Krash World. Driven by love and
                    justice, she fights against Earth's oppressive forces using truth, art, and connection as her
                    weapons.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[#00ff88] font-bold mb-2">STRENGTHS</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {grlkrashTraits.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <span className="text-[#00ff88] mr-2">{strength.icon}</span>
                            <span className="font-semibold text-white mr-2">{strength.trait}:</span>
                            <span className="text-gray-400">{strength.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[#ff6b9d] font-bold mb-2">CHALLENGES</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {grlkrashTraits.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <span className="text-[#ff6b9d] mr-2">{weakness.icon}</span>
                            <span className="font-semibold text-white mr-2">{weakness.trait}:</span>
                            <span className="text-gray-400">{weakness.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* JULES Profile */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-[#00aaff]/10 to-[#ffda0f]/10 border-[#00aaff]/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 order-2 lg:order-1">
                  <div className="flex items-center mb-4">
                    <h2 className="text-4xl font-black text-[#00aaff] mr-4">JULES</h2>
                    <Badge variant="outline" className="text-[#00aaff] border-[#00aaff]">
                      HUMAN ALLY
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    A musically gifted human who becomes GRLKRASH's closest companion. Driven by a desire for purpose
                    and belonging, she uses her wits and musical abilities to help save the world.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[#00aaff] font-bold mb-2">STRENGTHS</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {julesTraits.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <span className="text-[#00aaff] mr-2">{strength.icon}</span>
                            <span className="font-semibold text-white mr-2">{strength.trait}:</span>
                            <span className="text-gray-400">{strength.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[#ff6b9d] font-bold mb-2">CHALLENGES</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {julesTraits.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <span className="text-[#ff6b9d] mr-2">{weakness.icon}</span>
                            <span className="font-semibold text-white mr-2">{weakness.trait}:</span>
                            <span className="text-gray-400">{weakness.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative h-64 lg:h-96 order-1 lg:order-2">
                  <div className="w-full h-full bg-gradient-to-br from-[#00aaff]/20 to-[#ffda0f]/20 flex items-center justify-center">
                    <div className="text-center">
                      <Music className="h-16 w-16 text-[#00aaff] mx-auto mb-4" />
                      <p className="text-[#00aaff] font-bold">JULES</p>
                      <p className="text-gray-400 text-sm">Musical Companion</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Character Quotes */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-center mb-8 text-[#ffda0f]">ICONIC QUOTES</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {quotes.map((quote, index) => (
              <Card key={index} className="bg-black/40 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="w-1 h-full mr-4 rounded" style={{ backgroundColor: quote.color }} />
                    <div>
                      <Badge
                        variant="outline"
                        className="mb-3 text-xs"
                        style={{ borderColor: quote.color, color: quote.color }}
                      >
                        {quote.character}
                      </Badge>
                      <p className="text-gray-300 italic text-lg leading-relaxed">"{quote.quote}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partnership */}
        <Card className="bg-gradient-to-r from-[#ffda0f]/10 to-[#ff6b9d]/10 border-[#ffda0f]/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">THE PERFECT PARTNERSHIP</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Together, GRLKRASH and Jules form an unstoppable team. Where one has weaknesses, the other provides
              strength. Their friendship becomes the foundation of the resistance against Earth's oppressive forces.
            </p>
            <Button size="lg" className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold">
              EXPLORE THE RESISTANCE
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
