'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 dark:from-green-950 dark:via-yellow-950 dark:to-red-950 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 text-center relative overflow-hidden">
        {/* Étoile du drapeau Camerounais en arrière-plan */}
        <div className="absolute top-4 right-4 opacity-10">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-600">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Bande décorative aux couleurs du Cameroun */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-green-600"></div>
          <div className="flex-1 bg-red-600"></div>
          <div className="flex-1 bg-yellow-500"></div>
        </div>

        <div className="relative z-10">
          {/* Code 404 stylisé */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black leading-none">
              <span className="bg-gradient-to-r from-green-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                404
              </span>
            </h1>
          </div>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Page introuvable
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <p className="text-sm text-muted-foreground">
              🇨🇲 AssistantCameroun - Votre guide administratif
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              size="lg"
              onClick={() => router.back()}
              variant="outline"
              className="w-full sm:w-auto gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 via-red-600 to-yellow-600 hover:opacity-90 transition-opacity gap-2"
              >
                <Home className="h-5 w-5" />
                Accueil
              </Button>
            </Link>
          </div>

          {/* Suggestions */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Que souhaitez-vous faire ?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/procedures">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                      <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Procédures</p>
                      <p className="text-xs text-muted-foreground">CNI, Passeport...</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/assistant">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors">
                      <MessageCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Assistant IA</p>
                      <p className="text-xs text-muted-foreground">Posez vos questions</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/bibliotheque">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900 group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                      <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Bibliothèque</p>
                      <p className="text-xs text-muted-foreground">Documents légaux</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Bande décorative aux couleurs du Cameroun (bas) */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-green-600"></div>
          <div className="flex-1 bg-red-600"></div>
          <div className="flex-1 bg-yellow-500"></div>
        </div>
      </Card>
    </div>
  )
}
