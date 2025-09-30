import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assistant IA - Assistant National du Cameroun",
  description: "Posez vos questions sur les procédures administratives et le droit camerounais",
}

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
