"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Music, Heart, Zap, Users, Target } from "lucide-react"

export default function ResistanceSection() {
  const weapons = [
    {
      name: "TRUTH",
      description: "Exposing the lies and manipulation of the New World Empire",
      icon: <Shield className="h-6 w-6" />,
      color: "#ffda0f",
    },
    {
      name: "ART",
      description: "Creative expression as rebellion against authoritarian control",
      icon: <Music className="h-6 w-6" />,
      color: "#00ff88",
    },
    {
      name: "CONNECTION",
      description: "Building community and love in a divided world",
      icon: <Heart className="h-6 w-6" />,
      color: "#ff6b9d",
    },
    {
      name: "REALITY",
      description: "Grounding people in authentic experience vs. manufactured illusion",
      icon: <Zap className="h-6 w-6" />,
      color: "#00aaff",
    },
  ]

  const missionPhases = [
    {
      phase: "AWAKENING",
      description: "GRLKRASH awakens from her self-imposed exile, ready to fight",
      status: "COMPLETE",
      color: "#00ff88",
    },
    {
      phase: "RECRUITMENT",
      description: "Finding Jules and building the core resistance team",
      status: "COMPLETE",
      color: "#00ff88",
    },
    {
      phase: "GATHERING",
      description: "Locating scattered toy clones and recruiting allies",
      status: "IN PROGRESS",
      color: "#ffda0f",
    },
    {
      phase: "RESISTANCE",
      description: "Active rebellion against NWE forces and the Malefs",
      status: "IN PROGRESS",
      color: "#ffda0f",
    },
    {
      phase: "FINAL BATTLE",
      description: "GRLKRASH faces the source of darkness - the ultimate sacrifice",
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
            THE RESISTANCE
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join GRLKRASH and Jules in their fight against the New World Empire. Using love, art, and truth as weapons,
            they lead humanity's last hope for freedom and authentic connection.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-[#ffda0f]/10 to-[#ff6b9d]/10 border-[#ffda0f]/30 mb-16">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-[#ffda0f] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">OUR MISSION</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              To liberate humanity from the oppressive control of the New World Empire, restore creative freedom, and
              build a world where love, community, and authentic expression can flourish once again.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="outline" className="text-[#ffda0f] border-[#ffda0f] text-lg px-4 py-2">
                FREEDOM
              </Badge>
              <Badge variant="outline" className="text-[#00ff88] border-[#00ff88] text-lg px-4 py-2">
                CREATIVITY
              </Badge>
              <Badge variant="outline" className="text-[#ff6b9d] border-[#ff6b9d] text-lg px-4 py-2">
                LOVE
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Weapons of Resistance */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-center mb-8 text-[#ffda0f]">OUR WEAPONS</h2>
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
          <h2 className="text-3xl font-black text-center mb-8 text-[#ffda0f]">THE CAMPAIGN</h2>
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
                <h3 className="text-xl font-black text-red-400 mb-4">NEW WORLD EMPIRE (NWE)</h3>
                <p className="text-gray-300 mb-4">
                  The totalitarian regime that controls post-apocalyptic Earth, restricting creative expression and
                  maintaining power through fear and surveillance.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Controls all media and music production</li>
                  <li>• Uses AI to manufacture "approved" content</li>
                  <li>• Suppresses authentic human expression</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-900/20 to-black/20 border-purple-800/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-black text-purple-400 mb-4">THE MALEFS</h3>
                <p className="text-gray-300 mb-4">
                  Dark, ghastly floating orbs that serve as the NWE's enforcers, hunting down resistance members and
                  maintaining order through terror.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Patrol cities and hunt rebels</li>
                  <li>• Represent pure oppressive force</li>
                  <li>• Symbol of humanity's lost freedom</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[#ffda0f]/10 to-[#00ff88]/10 border-[#ffda0f]/30">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-[#ffda0f] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#ffda0f]">JOIN THE FIGHT</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The resistance needs you. Whether you're an artist, a dreamer, or someone who believes in the power of
              authentic human connection - there's a place for you in GRLKRASH's army of love and truth.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-[#ffda0f] text-black hover:bg-[#ffda0f]/80 font-bold text-lg px-8 py-4">
                <Target className="mr-2 h-5 w-5" />
                ENLIST NOW
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
