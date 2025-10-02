'use client'

import { useEffect, useState } from 'react'

interface ProgressLoaderProps {
  isLoading: boolean
}

export function ProgressLoader({ isLoading }: ProgressLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(73)

  useEffect(() => {
    // Calculer dynamiquement la hauteur du header
    const header = document.getElementById('main-header')
    if (header) {
      setHeaderHeight(header.offsetHeight)
    }

    if (isLoading) {
      // Démarrer le chargement
      setProgress(10) // Démarrage rapide

      // Simuler une progression réaliste
      const intervals = [
        { delay: 100, progress: 30 },   // Chargement initial
        { delay: 200, progress: 50 },   // Récupération des données
        { delay: 300, progress: 70 },   // Traitement
        { delay: 400, progress: 85 },   // Presque fini
      ]

      const timers = intervals.map(({ delay, progress: targetProgress }) =>
        setTimeout(() => {
          if (isLoading) {
            setProgress(targetProgress)
          }
        }, delay)
      )

      return () => timers.forEach(clearTimeout)
    } else {
      // Compléter rapidement quand le chargement est fini
      setProgress(100)

      // Réinitialiser après l'animation
      const resetTimer = setTimeout(() => {
        setProgress(0)
      }, 500)

      return () => clearTimeout(resetTimer)
    }
  }, [isLoading])

  if (!isLoading && progress === 0) return null

  return (
    <div
      className="fixed left-0 right-0 z-40"
      style={{ top: `${headerHeight}px` }}
    >
      {/* Ligne de progression aux couleurs du Cameroun */}
      <div className="relative h-1 bg-transparent overflow-hidden">
        {/* Ligne tricolore avec étoile */}
        <div
          className="absolute top-0 h-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            maxWidth: '100%'
          }}
        >
          {/* Dégradé vert-rouge-jaune */}
          <div className="h-full bg-gradient-to-r from-green-600 via-red-600 to-yellow-500 shadow-lg"></div>

          {/* Étoile au bout de la ligne */}
          {progress > 5 && (
            <div className="absolute -right-3 -top-2 transition-opacity duration-300">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-500 drop-shadow-lg animate-pulse"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Lueur à la fin */}
        {progress >= 100 && (
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-yellow-400/50 to-transparent animate-pulse"></div>
        )}
      </div>
    </div>
  )
}
