"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Globe, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const { language, setLanguage, t } = useLanguage()

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  const navigation = [
    { name: t('header.home'), href: "/" },
    { name: t('header.assistant'), href: "/assistant" },
    { name: t('header.library'), href: "/bibliotheque" },
    { name: t('header.procedures'), href: "/procedures" },
    { name: t('header.quiz'), href: "/quiz" },
    { name: t('header.infos'), href: "/infos" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" id="main-header" role="banner">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-8" aria-label="Navigation principale">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 touch-manipulation">
            <img
              src="/logo.svg"
              alt="Assistant Cameroun"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
            />
            <span className="hidden text-base sm:text-lg font-semibold text-foreground sm:block">Assistant National</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground touch-manipulation"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end gap-x-1.5 sm:gap-x-2">
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 touch-manipulation shrink-0"
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">{t('header.changeLanguage')}</span>
            </Button>

            {languageMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLanguageMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-50 w-36 rounded-md border border-border bg-popover p-1 shadow-md">
                  <button
                    onClick={() => {
                      setLanguage("fr")
                      setLanguageMenuOpen(false)
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground touch-manipulation ${
                      language === 'fr' ? 'bg-accent text-accent-foreground' : ''
                    }`}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en")
                      setLanguageMenuOpen(false)
                    }}
                    className={`w-full rounded-sm px-2 py-1.5 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground touch-manipulation ${
                      language === 'en' ? 'bg-accent text-accent-foreground' : ''
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 touch-manipulation shrink-0">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">{t('header.changeTheme')}</span>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden touch-manipulation shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{t('header.menu')}</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border" id="mobile-menu">
          <div className="space-y-0.5 px-3 pb-3 pt-2" role="menu">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
