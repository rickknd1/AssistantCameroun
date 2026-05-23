"use client"

import Link from "next/link"
import { MessageCircle, BookOpen, FileText, GraduationCap } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    services: [
      { name: t('header.assistant'), href: "/assistant", icon: MessageCircle },
      { name: t('header.library'), href: "/bibliotheque", icon: BookOpen },
      { name: t('header.procedures'), href: "/procedures", icon: FileText },
      { name: t('header.quiz'), href: "/quiz", icon: GraduationCap },
    ],
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Assistant Digital Cameroun"
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="text-base font-semibold text-foreground">Assistant Digital Cameroun</p>
              <p className="text-xs text-muted-foreground">{t('footer.description')}</p>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {footerLinks.services.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Conçu par <a href="https://v0-image-analysis-6b-rouge.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-foreground">eoweb</a> • © {new Date().getFullYear()} Assistant Digital Cameroun. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
