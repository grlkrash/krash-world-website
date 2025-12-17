"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LeaseTermsProps {
  isOpen: boolean
  onClose: () => void
  beatTitle?: string
  price?: number
  includesWav?: boolean
}

export default function LeaseTerms({ isOpen, onClose, beatTitle, price, includesWav }: LeaseTermsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-[#ffda0f]/30 text-white max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#ffda0f] mb-2">
            STANDARD LEASE AGREEMENT
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {beatTitle && `Beat: ${beatTitle}`}
            {price && ` | Price: $${price}`}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
            <div>
              <h3 className="text-white font-bold mb-2 text-base">1. GRANT OF LICENSE</h3>
              <p>
                Producer grants Licensee a non-exclusive license to use the Instrumental (the "Beat") 
                in the creation of new musical compositions. This license includes the right to 
                {includesWav ? " MP3 and WAV formats" : " MP3 format"} for recording, distribution, 
                and performance purposes.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2 text-base">2. DISTRIBUTION RIGHTS</h3>
              <p>
                Licensee may distribute up to <strong className="text-white">2,500 units</strong> (including 
                physical copies, digital downloads, and streams) of the Master Recording. Distribution 
                includes but is not limited to: streaming platforms, digital downloads, physical CDs, 
                and radio play.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2 text-base">3. PUBLISHING RIGHTS</h3>
              <p>
                <strong className="text-[#ffda0f]">50/50 Publishing Split:</strong> Producer and Licensee 
                shall each own 50% of the publishing rights to the composition. This includes writer's 
                share and publisher's share. Both parties are entitled to 50% of all publishing income, 
                including but not limited to mechanical royalties, performance royalties, and synchronization 
                fees.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2 text-base">4. CREDIT REQUIREMENTS</h3>
              <p>
                Licensee must credit Producer as "Produced by GRLKRASH" or "Beat by GRLKRASH" in all 
                releases, promotional materials, and metadata. Failure to provide proper credit may 
                result in termination of this license.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2 text-base">5. RESTRICTIONS</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Licensee may not resell, lease, or sublicense the Beat</li>
                <li>Licensee may not claim ownership of the Beat itself</li>
                <li>Licensee may not use the Beat in a way that is defamatory or illegal</li>
                <li>Licensee may not register the Beat with a Performance Rights Organization (PRO) 
                    without including Producer's information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2 text-base">6. TERM</h3>
              <p>
                This license is valid for the lifetime of the Master Recording. Upon expiration of 
                distribution rights (2,500 units), Licensee must either purchase an extended license 
                or cease distribution.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2 text-base">7. TERMINATION</h3>
              <p>
                Producer reserves the right to terminate this license if Licensee violates any terms 
                of this agreement. Upon termination, Licensee must cease all use and distribution of 
                the Master Recording.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2 text-base">8. WARRANTIES</h3>
              <p>
                Producer warrants that they have the right to grant this license. Licensee warrants 
                that they will use the Beat in accordance with all terms of this agreement.
              </p>
            </div>

            <div className="pt-4 border-t border-[#ffda0f]/20">
              <p className="text-xs text-gray-400">
                By purchasing this beat, you agree to these terms and conditions. This agreement is 
                governed by the laws of the State of California, United States.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                For questions or extended licensing, contact: <a href="mailto:info@krash.world" className="text-[#ffda0f] hover:underline">info@krash.world</a>
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
