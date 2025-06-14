import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Krash World | Cincinnati-Based Multimedia Artist GRLKRASH",
  description:
    "Enter the universe of GRLKRASH - an exiled alien action figure fighting for truth, love, and resistance. Transmedia IP art project spanning music, games, art, and storytelling.",
  keywords: [
    "Krash World",
    "GRLKRASH",
    "Cincinnati artist",
    "multimedia art",
    "transmedia",
    "music",
    "games",
    "resistance",
    "alien",
    "art project",
  ],
  authors: [{ name: "GRLKRASH" }],
  creator: "GRLKRASH",
  publisher: "Krash World",

  // Open Graph
  openGraph: {
    title: "Krash World | Cincinnati-Based Multimedia Artist GRLKRASH",
    description:
      "Enter the universe of GRLKRASH - an exiled alien action figure fighting for truth, love, and resistance against oppressive forces.",
    url: "https://krash.world",
    siteName: "Krash World",
    images: [
      {
        url: "/images/grlkrash-nature.png",
        width: 1200,
        height: 630,
        alt: "GRLKRASH - Alien resistance fighter from Krash World",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Krash World | Cincinnati-Based Multimedia Artist GRLKRASH",
    description:
      "Enter the universe of GRLKRASH - an exiled alien action figure fighting for truth, love, and resistance.",
    images: ["/images/grlkrash-nature.png"],
    creator: "@grlkash",
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#ffda0f" }],
  },

  // Manifest
  manifest: "/site.webmanifest",

  // Theme
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffda0f" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],,

  // Verification (add your verification codes when you have them)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffda0f" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "GRLKRASH",
              alternateName: "Krash World",
              description: "Cincinnati-based multimedia artist creating transmedia IP art projects",
              url: "https://krash.world",
              sameAs: [
                "https://instagram.com/grlkrash",
                "https://x.com/grlkash",
                "https://open.spotify.com/artist/4hc1t3A4CTdvMyCGJdt5B8",
                "https://discord.gg/8P35uShgeR",
              ],
              jobTitle: "Multimedia Artist",
              worksFor: {
                "@type": "Organization",
                name: "Krash World",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Cincinnati",
                addressRegion: "OH",
                addressCountry: "US",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
