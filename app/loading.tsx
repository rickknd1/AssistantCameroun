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

    // Simulation d'une progression réaliste
    const intervals = [
      { delay: 0, progress: 10 },     // Démarrage
      { delay: 100, progress: 30 },   // Chargement initial
      { delay: 300, progress: 60 },   // Récupération des données
      { delay: 600, progress: 85 },   // Traitement
      { delay: 1000, progress: 95 },  // Presque fini
    ]

    const timers = intervals.map(({ delay, progress: targetProgress }) =>
      setTimeout(() => setProgress(targetProgress), delay)
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="fixed left-0 right-0 z-40"
      style={{ top: `${headerHeight}px` }}
    >
      {/* Ligne de progression aux couleurs du Cameroun */}
      <div className="relative h-1 bg-transparent overflow-hidden">
        {/* Ligne tricolore avec étoile */}
        <div
          className="absolute top-0 h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            maxWidth: '100%'
          }}
        >
          {/* Dégradé vert-rouge-jaune */}
          <div className="h-full bg-gradient-to-r from-green-600 via-red-600 to-yellow-500 shadow-lg"></div>

          {/* Étoile au bout de la ligne */}
          {progress > 5 && (
            <div className="absolute -right-3 -top-2">
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

        {/* Lueur à la fin quand proche de 100% */}
        {progress >= 90 && (
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-yellow-400/30 to-transparent"></div>
        )}
      </div>
    </div>
  )
}
