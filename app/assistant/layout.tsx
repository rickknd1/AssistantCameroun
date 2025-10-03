import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assistant IA - Assistant National du Cameroun",
  description: "Posez vos questions sur les procédures administratives et le droit camerounais",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
}

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {children}
    </div>
  )
}
