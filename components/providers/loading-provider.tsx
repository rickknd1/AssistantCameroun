'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { ProgressLoader } from '@/components/ui/progress-loader'

function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Démarrer le chargement
    setIsLoading(true)

    // Simuler un petit délai pour montrer la barre
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return <ProgressLoader isLoading={isLoading} />
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <LoadingBar />
      </Suspense>
      {children}
    </>
  )
}
