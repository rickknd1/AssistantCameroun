import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { LanguageProvider } from "@/lib/i18n"
import "./globals.css"

export const metadata: Metadata = {
  title: "Assistant National du Cameroun",
  description: "Votre guide intelligent pour naviguer au Cameroun - Droit, procédures administratives, culture",
  generator: "v0.app",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
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
