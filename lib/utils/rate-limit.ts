/**
 * Rate Limiting Utility
 * Limite le nombre de requêtes par IP sur une fenêtre de temps donnée
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// Store en mémoire (pour production, utiliser Redis)
const store: RateLimitStore = {}

// Nettoyer le store toutes les heures
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60 * 60 * 1000) // 1 heure

export interface RateLimitConfig {
  interval: number // Fenêtre de temps en ms
  uniqueTokenPerInterval: number // Nombre de requêtes max
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Vérifie si une requête dépasse la limite de rate
 * @param identifier - Identifiant unique (généralement l'IP)
 * @param config - Configuration du rate limiting
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute par défaut
    uniqueTokenPerInterval: 10, // 10 requêtes par minute par défaut
  }
): RateLimitResult {
  const now = Date.now()
  const tokenData = store[identifier]

  if (!tokenData || tokenData.resetTime < now) {
    // Première requête ou fenêtre expirée
    store[identifier] = {
      count: 1,
      resetTime: now + config.interval,
    }

    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - 1,
      reset: store[identifier].resetTime,
    }
  }

  // Incrémenter le compteur
  tokenData.count++

  const remaining = Math.max(0, config.uniqueTokenPerInterval - tokenData.count)
  const success = tokenData.count <= config.uniqueTokenPerInterval

  return {
    success,
    limit: config.uniqueTokenPerInterval,
    remaining,
    reset: tokenData.resetTime,
  }
}

/**
 * Obtient l'identifiant client depuis une requête (IP ou identifiant custom)
 */
export function getClientIdentifier(request: Request): string {
  // Essayer de récupérer l'IP depuis les headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare

  const ip =
    cfConnectingIp ||
    realIp ||
    (forwarded ? forwarded.split(',')[0].trim() : null) ||
    'unknown'

  // Hash simple pour anonymisation (optionnel)
  return ip !== 'unknown' ? `ip_${ip}` : 'unknown'
}

/**
 * Middleware de rate limiting pour les routes API
 */
export async function rateLimitMiddleware(
  request: Request,
  config?: RateLimitConfig
): Promise<Response | null> {
  const identifier = getClientIdentifier(request)
  const result = checkRateLimit(identifier, config)

  // Ajouter les headers de rate limit
  const headers = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  }

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Vous avez dépassé la limite de requêtes. Veuillez réessayer dans quelques instants.',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          ...headers,
        },
      }
    )
  }

  // Retourner null pour continuer (pas de limitation)
  return null
}
