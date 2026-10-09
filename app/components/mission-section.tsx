"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Music, Heart, Zap, Users, Target } from "lucide-react"

export default function MissionSection() {
  const weapons = [
    {
      name: "TRUTH",
      description: "Seeing through the lies the Malefs whisper",
      icon: <Shield className="h-6 w-6" />,
      color: "#ffda0f",
    },
    {
      name: "MUSIC",
      description: "Jules's gift - and the overdrive that helps GRLKRASH crush the darkness",
      icon: <Music className="h-6 w-6" />,
      color: "#00ff88",
    },
    {
      name: "LOVE",
      description: "Perfect love casts out fear",
      icon: <Heart className="h-6 w-6" />,
      color: "#ff6b9d",
    },
    {
      name: "LIGHT",
      description: "The light shines in the darkness",
      icon: <Zap className="h-6 w-6" />,
      color: "#00aaff",
    },
  ]

  const missionPhases = [
    {
      phase: "THE BREATH OF LIFE",
      description: "God hears Jules's cries and breathes life into GRLKRASH",
      status: "COMPLETE",
      color: "#00ff88",
    },
    {
      phase: "BEST FRIENDS",
      description: "GRLKRASH and Jules, side by side",
      status: "COMPLETE",
      color: "#00ff88",
    },
    {
      phase: "THE GATHERING",
      description: "Finding the other toys like her - allies on the side of light",
      status: "IN PROGRESS",
      color: "#ffda0f",
    },
    {
      phase: "PROTECT THE MEEK",
      description: "Standing against the darkness and the Malefs",
      status: "IN PROGRESS",
      color: "#ffda0f",
    },
    {
      phase: "TO BE REVEALED",
      description: "Some things you'll have to wait and see",
      status: "PENDING",
      color: "#ff6b9d",
    },
  ]

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ffda0f] to-[#ff6b9d]">
            THE MISSION
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join GRLKRASH and Jules as they push back the darkness. With love, light, and music, they protect the meek
            - and bring hope wherever the darkness spreads.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-[#ffda0f]/10 to-[#ff6b9d]/10 border-[#ffda0f]/30 mb-16">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-[#ffda0f] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">OUR MISSION</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              To protect the meek, find the other toys, spread light, and push back the darkness - overcoming evil
              with good.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="outline" className="text-[#ffda0f] border-[#ffda0f] text-lg px-4 py-2">
                LIGHT
              </Badge>
              <Badge variant="outline" className="text-[#00ff88] border-[#00ff88] text-lg px-4 py-2">
                COURAGE
              </Badge>
              <Badge variant="outline" className="text-[#ff6b9d] border-[#ff6b9d] text-lg px-4 py-2">
                LOVE
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* The Armor of Light */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-center mb-8 text-[#ffda0f]">THE ARMOR OF LIGHT</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weapons.map((weapon, index) => (
              <Card key={index} className="bg-black/40 border-gray-800 text-center">
                <CardContent className="p-6">
                  <div className="p-4 rounded-full mx-auto mb-4 w-fit" style={{ backgroundColor: `${weapon.color}20` }}>
                    <span style={{ color: weapon.color }}>{weapon.icon}</span>
                  </div>
                  <h3 className="text-xl font-black mb-3" style={{ color: weapon.color }}>
                    {weapon.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{weapon.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Phases */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-center mb-8 text-[#ffda0f]">THE JOURNEY</h2>
          <div className="space-y-6">
            {missionPhases.map((phase, index) => (
              <Card key={index} className="bg-black/40 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: phase.color }} />
                      <div>
                        <h3 className="text-xl font-black" style={{ color: phase.color }}>
                          PHASE {index + 1}: {phase.phase}
                        </h3>
                        <p className="text-gray-300 mt-1">{phase.description}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: phase.color,
                        color: phase.color,
                        backgroundColor: phase.status === "COMPLETE" ? `${phase.color}20` : "transparent",
                      }}
                    >
                      {phase.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* The Enemy */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-center mb-8 text-[#ff6b9d]">WHAT WE FIGHT AGAINST</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-red-900/20 to-gray-900/20 border-red-800/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-black text-red-400 mb-4">THE DARKNESS</h3>
                <p className="text-gray-300 mb-4">
                  The dark forces spreading evil across the earth. Someone rules the darkness - but their name is
                  still unknown.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Spreads fear, anger, and despair</li>
                  <li>• Makes twisted copies of GRLKRASH</li>
                  <li>• "We wrestle not against flesh and blood"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-900/20 to-black/20 border-purple-800/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-black text-purple-400 mb-4">THE MALEFS</h3>
                <p className="text-gray-300 mb-4">
                  The hearers - dark floating orbs that serve the darkness. They lurk, watch, and listen, then report
                  back.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Scheme, whisper, tempt, and deceive</li>
                  <li>• Stir up fear and anger in people</li>
                  <li>• Feed off ungodly thoughts and feelings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[#ffda0f]/10 to-[#00ff88]/10 border-[#ffda0f]/30">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-[#ffda0f] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">JOIN THE MISSION</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The darkness is spreading, but so is the light. Whether you're an artist, a dreamer, or someone who
              believes love is stronger than fear - there's a place for you in GRLKRASH's story.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold text-lg px-8 py-4">
                <Target className="mr-2 h-5 w-5" />
                JOIN THE STORY
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black font-bold text-lg px-8 py-4"
              >
                LEARN MORE
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
