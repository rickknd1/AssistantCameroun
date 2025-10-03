import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { LanguageProvider } from "@/lib/i18n"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://assistantcameroun.com'),
  title: {
    default: "Assistant Digital Cameroun - IA pour Procédures & Droit Camerounais",
    template: "%s | Assistant Digital Cameroun"
  },
  description: "Assistant IA gratuit 24/7 pour vos démarches au Cameroun : CNI, passeport, création entreprise, Code Pénal, Constitution. Réponses instantanées avec sources officielles.",
  keywords: [
    "Assistant Digital Cameroun",
    "Cameroun IA",
    "procédures administratives Cameroun",
    "CNI Cameroun en ligne",
    "passeport Cameroun démarches",
    "création entreprise Cameroun",
    "Code Pénal Cameroun",
    "Code Civil Cameroun",
    "Constitution Cameroun",
    "Code du Travail Cameroun",
    "droit camerounais",
    "assistant juridique Cameroun",
    "chatbot Cameroun",
    "intelligence artificielle Cameroun",
    "administration camerounaise"
  ],
  authors: [{ name: "Assistant Digital Cameroun" }],
  creator: "Assistant Digital Cameroun",
  publisher: "Assistant Digital Cameroun",
  generator: "Next.js",
  applicationName: "Assistant Digital Cameroun",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/logo.svg",
    shortcut: "/logo.svg",
  },
  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "fr_CM",
    alternateLocale: "en_CM",
    url: "https://assistantcameroun.com",
    title: "Assistant Digital Cameroun - Votre IA pour Démarches & Droit",
    description: "Assistant intelligent gratuit 24/7 pour toutes vos démarches administratives et juridiques au Cameroun. CNI, passeport, entreprise, Code Pénal, Constitution - Réponses instantanées avec sources officielles.",
    siteName: "Assistant Digital Cameroun",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Assistant Digital Cameroun - Votre assistant IA",
      }
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Assistant Digital Cameroun - IA pour le Cameroun",
    description: "Démarches administratives & juridiques au Cameroun simplifiées avec l'IA. Gratuit 24/7.",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  other: {
    "google-site-verification": "votre-code-verification-google",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased relative`}>
        {/* Neon Background Effect - Cameroon Colors - Smooth animated glows */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Green neon glow - top left - moving */}
          <div className="absolute -top-[40%] -left-[40%] w-[80%] h-[80%] bg-gradient-radial from-green-500/15 via-green-500/8 to-transparent rounded-full blur-[100px] animate-neon-float-1" />

          {/* Yellow neon glow - top right - moving */}
          <div className="absolute -top-[30%] -right-[30%] w-[70%] h-[70%] bg-gradient-radial from-yellow-400/18 via-yellow-400/10 to-transparent rounded-full blur-[90px] animate-neon-float-2" />

          {/* Red neon glow - bottom left - moving */}
          <div className="absolute -bottom-[30%] -left-[25%] w-[65%] h-[65%] bg-gradient-radial from-red-500/12 via-red-500/6 to-transparent rounded-full blur-[95px] animate-neon-float-3" />

          {/* Green neon glow - bottom right - moving */}
          <div className="absolute -bottom-[40%] -right-[40%] w-[75%] h-[75%] bg-gradient-radial from-green-600/14 via-green-600/7 to-transparent rounded-full blur-[110px] animate-neon-float-4" />

          {/* Yellow accent - center - floating */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-radial from-yellow-300/8 via-yellow-300/4 to-transparent rounded-full blur-[85px] animate-neon-float-center" />

          {/* Additional moving green accent - middle left */}
          <div className="absolute top-1/3 -left-[20%] w-[50%] h-[50%] bg-gradient-radial from-green-400/12 via-green-400/6 to-transparent rounded-full blur-[80px] animate-neon-float-5" />

          {/* Additional moving red accent - middle right */}
          <div className="absolute top-2/3 -right-[20%] w-[55%] h-[55%] bg-gradient-radial from-red-400/10 via-red-400/5 to-transparent rounded-full blur-[85px] animate-neon-float-6" />

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
        </div>

        <Suspense fallback={null}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
