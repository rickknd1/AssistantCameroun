"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    legal: [
      { name: t('footer.about'), href: "/about" },
      { name: t('footer.contact'), href: "/contact" },
      { name: t('footer.legal'), href: "/legal" },
      { name: t('footer.privacy'), href: "/privacy" },
    ],
    social: [
      { name: "Facebook", icon: Facebook, href: "#" },
      { name: "Twitter", icon: Twitter, href: "#" },
      { name: "Instagram", icon: Instagram, href: "#" },
      { name: "LinkedIn", icon: Linkedin, href: "#" },
    ],
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-secondary to-accent">
                <span className="text-xl font-bold text-white">AC</span>
              </div>
              <span className="text-lg font-semibold text-foreground">{t('footer.brand')}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('footer.links')}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('footer.followUs')}</h3>
            <div className="mt-4 flex gap-3">
              {footerLinks.social.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t('footer.designedBy')} <a href="https://eoweb.site" className="hover:text-foreground">eoweb</a> • © {new Date().getFullYear()} {t('footer.brand')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
