"use client"
import Link from "next/link"
import { ExternalLink, Music, Gamepad2, Mail, BookOpen, MessageSquare, ShoppingBag, FileText } from "lucide-react"

// Custom Discord Icon Component
const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

interface NavigationMenuProps {
  isOpen: boolean
  onClose: () => void
  onNewsletterOpen: () => void
}

export default function NavigationMenu({ isOpen, onClose, onNewsletterOpen }: NavigationMenuProps) {
  if (!isOpen) return null

  const menuItems = [
    {
      title: "BEATSTORE",
      description: "Browse beats, loops & templates",
      href: "/beatstore",
      icon: <ShoppingBag size={20} />,
      color: "#ffda0f",
    },
    {
      title: "PLAY GAME",
      description: "Enter the Krash World universe",
      href: "https://play.krash.world",
      icon: <Gamepad2 size={20} />,
      color: "#00ff88",
    },
    {
      title: "MUSIC",
      description: "Listen to the latest tracks",
      href: "https://Venice.lnk.to/psilocybin-remix",
      icon: <Music size={20} />,
      color: "#ff6b9d",
    },
    {
      title: "CONTACT",
      description: "Get in touch with GRLKRASH",
      href: "/contact",
      icon: <MessageSquare size={20} />,
      color: "#ffda0f",
    },
    {
      title: "LEASE TERMS",
      description: "View beat licensing information",
      href: "/lease-terms",
      icon: <FileText size={20} />,
      color: "#00ff88",
    },
    {
      title: "DISCORD",
      description: "Join the community (134 members)",
      href: "https://discord.gg/8P35uShgeR",
      icon: <DiscordIcon size={20} />,
      color: "#7289da",
    },
    {
      title: "NEWSLETTER",
      description: "Join the resistance",
      action: () => {
        onNewsletterOpen()
        onClose()
      },
      icon: <Mail size={20} />,
      color: "#00aaff",
    },
    {
      title: "KRASH COURSES",
      description: "HOW TO FUND CREATIVE EVENTS: THE $20K BLUEPRINT",
      href: "https://krashworld.gumroad.com",
      icon: <BookOpen size={20} />,
      color: "#ff6b9d",
    },
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-40"
        onClick={onClose}
      />
      {/* Menu */}
      <div className="fixed inset-0 top-16 z-50 bg-black/95 backdrop-blur-md border-t border-[#ffda0f]/20 overflow-y-auto">
        <div className="container mx-auto px-6 py-6 space-y-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.href ? (
              item.href.startsWith("http") ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#ffda0f]/10 transition-colors group"
                  onClick={onClose}
                >
                  <div style={{ color: item.color }}>{item.icon}</div>
                  <div>
                    <div className="text-white font-bold group-hover:text-[#ffda0f] transition-colors">{item.title}</div>
                    <div className="text-gray-400 text-sm">{item.description}</div>
                  </div>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#ffda0f]/10 transition-colors group"
                  onClick={onClose}
                >
                  <div style={{ color: item.color }}>{item.icon}</div>
                  <div>
                    <div className="text-white font-bold group-hover:text-[#ffda0f] transition-colors">{item.title}</div>
                    <div className="text-gray-400 text-sm">{item.description}</div>
                  </div>
                </Link>
              )
            ) : (
              <button
                onClick={item.action}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#ffda0f]/10 transition-colors group w-full text-left"
              >
                <div style={{ color: item.color }}>{item.icon}</div>
                <div>
                  <div className="text-white font-bold group-hover:text-[#ffda0f] transition-colors">{item.title}</div>
                  <div className="text-gray-400 text-sm">{item.description}</div>
                </div>
              </button>
            )}
          </div>
        ))}
        </div>
      </div>
    </>
  )
}
