'use client'

import { useEffect, useState } from 'react'

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(73)

  useEffect(() => {
    // Calculer dynamiquement la hauteur du header
    const header = document.getElementById('main-header')
    if (header) {
      setHeaderHeight(header.offsetHeight)
    }

    // Progression plus lente et plus visible
    const intervals = [
      { delay: 0, progress: 15 },      // Démarrage
      { delay: 200, progress: 35 },    // Chargement initial
      { delay: 500, progress: 55 },    // Récupération des données
      { delay: 900, progress: 75 },    // Traitement
      { delay: 1400, progress: 90 },   // Finalisation
      { delay: 1800, progress: 100 },  // Complet
    ]

    const timers = intervals.map(({ delay, progress: targetProgress }) =>
      setTimeout(() => setProgress(targetProgress), delay)
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="fixed left-0 right-0 z-[60]"
      style={{ top: `${headerHeight}px` }}
    >
      {/* Ligne de progression aux couleurs du Cameroun - Plus épaisse */}
      <div className="relative h-1.5 bg-muted/30 overflow-hidden shadow-sm">
        {/* Ligne tricolore avec étoile */}
        <div
          className="absolute top-0 h-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            maxWidth: '100%'
          }}
        >
          {/* Dégradé vert-rouge-jaune avec animation de brillance */}
          <div className="h-full bg-gradient-to-r from-green-600 via-red-600 to-yellow-500 shadow-md relative overflow-hidden">
            {/* Brillance qui se déplace */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>

          {/* Étoile au bout de la ligne - Plus grosse */}
          {progress > 5 && (
            <div className="absolute -right-4 -top-3">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-500 drop-shadow-xl animate-pulse"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))'
                }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Lueur à la fin quand proche de 100% */}
        {progress >= 85 && (
          <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-yellow-400/40 to-transparent animate-pulse"></div>
        )}
      </div>
    </div>
  )
}
