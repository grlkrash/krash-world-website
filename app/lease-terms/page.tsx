"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function LeaseTermsPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 218, 15, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 218, 15, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-[#ffda0f]/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <Image src="/images/krash-logo.png" alt="KRASH" width={40} height={40} className="brightness-110" />
            <div className="hidden md:block">
              <div className="text-[#ffda0f] font-black text-lg">KRASH WORLD</div>
              <div className="text-gray-400 text-xs">LA BASED</div>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            href="/beatstore"
            className="inline-flex items-center gap-2 text-[#ffda0f] hover:text-[#ffda0f]/80 transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft size={16} />
            BACK TO BEATSTORE
          </Link>

          <div className="bg-black/60 backdrop-blur-md border border-[#ffda0f]/30 rounded-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="text-[#ffda0f] text-sm font-mono mb-2">STANDARD LEASE AGREEMENT</div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                <span className="text-white">BEAT</span>
                <br />
                <span className="text-[#ffda0f]">LICENSING TERMS</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Please read these terms carefully before purchasing
              </p>
            </div>

            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">1. GRANT OF LICENSE</h3>
                  <p>
                    Producer (GRLKRASH) grants Licensee a non-exclusive license to use the Instrumental 
                    (the "Beat") in the creation of new musical compositions. This license includes the 
                    right to use MP3 and/or WAV formats (as specified in your purchase) for recording, 
                    distribution, and performance purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">2. DISTRIBUTION RIGHTS</h3>
                  <p>
                    Licensee may distribute up to <strong className="text-white">2,500 units</strong> 
                    (including physical copies, digital downloads, and streams) of the Master Recording. 
                    Distribution includes but is not limited to: streaming platforms (Spotify, Apple Music, 
                    etc.), digital downloads, physical CDs, vinyl, and radio play.
                  </p>
                  <p className="mt-2">
                    Once the 2,500 unit limit is reached, Licensee must either purchase an extended license 
                    or cease distribution of the Master Recording.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">3. PUBLISHING RIGHTS</h3>
                  <p>
                    <strong className="text-[#ffda0f]">50/50 Publishing Split:</strong> Producer and Licensee 
                    shall each own 50% of the publishing rights to the composition. This includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li><strong className="text-white">Writer's Share:</strong> 50% Producer, 50% Licensee</li>
                    <li><strong className="text-white">Publisher's Share:</strong> 50% Producer, 50% Licensee</li>
                  </ul>
                  <p className="mt-2">
                    Both parties are entitled to 50% of all publishing income, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Mechanical royalties (from sales and streams)</li>
                    <li>Performance royalties (from radio, TV, live performances)</li>
                    <li>Synchronization fees (for use in film, TV, commercials, etc.)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">4. CREDIT REQUIREMENTS</h3>
                  <p>
                    Licensee must credit Producer as <strong className="text-white">"Produced by GRLKRASH"</strong> 
                    or <strong className="text-white">"Beat by GRLKRASH"</strong> in all releases, promotional 
                    materials, and metadata. This includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Streaming platform metadata (Spotify, Apple Music, etc.)</li>
                    <li>Physical release credits</li>
                    <li>Music video credits</li>
                    <li>Social media posts promoting the track</li>
                  </ul>
                  <p className="mt-2 text-yellow-400">
                    Failure to provide proper credit may result in termination of this license.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">5. RESTRICTIONS</h3>
                  <p>Licensee agrees to the following restrictions:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>
                      <strong className="text-white">No Resale/Sublease:</strong> Licensee may not resell, 
                      lease, or sublicense the Beat to any third party
                    </li>
                    <li>
                      <strong className="text-white">No Ownership Claims:</strong> Licensee may not claim 
                      ownership of the Beat itself, only the Master Recording created using the Beat
                    </li>
                    <li>
                      <strong className="text-white">No Defamatory Use:</strong> Licensee may not use the 
                      Beat in a way that is defamatory, illegal, or violates any third-party rights
                    </li>
                    <li>
                      <strong className="text-white">PRO Registration:</strong> Licensee may not register 
                      the Beat with a Performance Rights Organization (PRO) without including Producer's 
                      information and the 50/50 split
                    </li>
                    <li>
                      <strong className="text-white">No Sample Clearance:</strong> If the Beat contains 
                      samples, Licensee is responsible for clearing those samples separately
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">6. TERM</h3>
                  <p>
                    This license is valid for the lifetime of the Master Recording. Upon expiration of 
                    distribution rights (2,500 units), Licensee must either:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Purchase an extended license for additional units</li>
                    <li>Purchase an exclusive license (if available)</li>
                    <li>Cease all distribution of the Master Recording</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">7. TERMINATION</h3>
                  <p>
                    Producer reserves the right to terminate this license immediately if Licensee violates 
                    any terms of this agreement. Upon termination:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Licensee must cease all use and distribution of the Master Recording</li>
                    <li>Licensee must remove the Master Recording from all platforms</li>
                    <li>No refund will be provided</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">8. WARRANTIES</h3>
                  <p>
                    <strong className="text-white">Producer warrants:</strong> That they have the right 
                    to grant this license and that the Beat does not infringe on any third-party rights 
                    (except for any samples that require separate clearance).
                  </p>
                  <p className="mt-2">
                    <strong className="text-white">Licensee warrants:</strong> That they will use the Beat 
                    in accordance with all terms of this agreement and will not violate any laws or 
                    third-party rights.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">9. LIMITATION OF LIABILITY</h3>
                  <p>
                    Producer shall not be liable for any indirect, incidental, or consequential damages 
                    arising from the use of the Beat. Licensee's sole remedy for any breach of this 
                    agreement is termination of the license.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-2 text-lg">10. GOVERNING LAW</h3>
                  <p>
                    This agreement is governed by the laws of the State of California, United States. 
                    Any disputes arising from this agreement shall be resolved in the courts of California.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#ffda0f]/20 mt-8">
                  <p className="text-xs text-gray-400 mb-4">
                    By purchasing a beat from KRASH WORLD, you acknowledge that you have read, understood, 
                    and agree to be bound by these terms and conditions.
                  </p>
                  <p className="text-xs text-gray-400">
                    For questions, extended licensing, or exclusive rights inquiries, contact:{" "}
                    <a href="mailto:info@krash.world" className="text-[#ffda0f] hover:underline">
                      info@krash.world
                    </a>
                  </p>
                  <p className="text-xs text-gray-500 mt-4 italic">
                    Last updated: December 2024
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>

      {/* Bottom Info */}
      <div className="fixed bottom-4 left-6 text-xs text-gray-500 font-mono">
        <div>KRASH_WORLD_V1.0</div>
        <div>GRLKRASH © 2024</div>
      </div>
    </div>
  )
}
