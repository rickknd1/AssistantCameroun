"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Language, type Translations } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof Translations) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_KEY = 'assistant_language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')
  const [mounted, setMounted] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(LANGUAGE_KEY) as Language | null
    if (stored && (stored === 'fr' || stored === 'en')) {
      setLanguageState(stored)
    }
  }, [])

  // Save language to localStorage and update document lang
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, lang)
      document.documentElement.lang = lang
    }
  }

  // Translation function
  const t = (key: keyof Translations): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
