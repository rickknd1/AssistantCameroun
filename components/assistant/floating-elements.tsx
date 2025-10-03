"use client"

import { Bot, FileText, Scale, Building2, BookOpen, Zap, GraduationCap, MessageCircle, Star, Clock } from "lucide-react"

export function FloatingElements() {
  const elements = [
    {
      icon: Bot,
      text: "Chat IA",
      subtext: "Instantané",
      position: "top-20 left-10",
      color: "bg-green-500/10 text-green-600 border-green-200",
      delay: "0s"
    },
    {
      icon: FileText,
      text: "CNI & Passeport",
      subtext: "En 3 étapes",
      position: "top-32 left-32",
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      delay: "0.2s"
    },
    {
      icon: Scale,
      text: "Code Pénal",
      subtext: "& Civil",
      position: "top-16 right-32",
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      delay: "0.4s"
    },
    {
      icon: Building2,
      text: "Création",
      subtext: "Entreprise",
      position: "top-28 right-12",
      color: "bg-green-500/10 text-green-600 border-green-200",
      delay: "0.6s"
    },
    {
      icon: BookOpen,
      text: "+10K articles",
      subtext: "Juridiques",
      position: "bottom-32 right-16",
      color: "bg-green-500/10 text-green-600 border-green-200",
      delay: "0.8s"
    },
    {
      icon: Zap,
      text: "Réponses",
      subtext: "En 30s",
      position: "bottom-44 right-40",
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      delay: "1s"
    },
    {
      icon: GraduationCap,
      text: "Quiz",
      subtext: "Interactifs",
      position: "bottom-28 left-40",
      color: "bg-red-500/10 text-red-600 border-red-200",
      delay: "1.2s"
    },
    {
      icon: Star,
      text: "100%",
      subtext: "Cameroun",
      position: "bottom-40 left-16",
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      delay: "1.4s"
    },
    {
      icon: MessageCircle,
      text: "Disponible",
      subtext: "24/7",
      position: "top-1/2 left-8",
      color: "bg-green-500/10 text-green-600 border-green-200",
      delay: "1.6s"
    },
    {
      icon: Clock,
      text: "Code du",
      subtext: "Travail",
      position: "top-1/2 right-8",
      color: "bg-red-500/10 text-red-600 border-red-200",
      delay: "1.8s"
    }
  ]

  return (
    <div className="hidden xl:block pointer-events-none fixed inset-0 z-0">
      {elements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} ${element.color} rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-float`}
          style={{
            animationDelay: element.delay,
            animationDuration: "6s"
          }}
        >
          <div className="flex items-center gap-3">
            <element.icon className="h-8 w-8 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-semibold leading-tight">{element.text}</div>
              <div className="text-xs opacity-80">{element.subtext}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
