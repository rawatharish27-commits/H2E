// Rate Limiting Utilities
import { db, withRetry } from '@/lib/db'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests in the window
}

const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
  SEND_OTP: { windowMs: 60 * 1000, maxRequests: 3 }, // 3 per minute
  VERIFY_OTP: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 per 15 minutes
  CREATE_PROBLEM: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 per hour
  API_GENERAL: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 per minute
  ADMIN_ACTION: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 per minute
}

export async function checkRateLimit(
  identifier: string,
  action: string,
  config?: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const limitConfig = config || DEFAULT_LIMITS[action] || DEFAULT_LIMITS.API_GENERAL
  const now = new Date()
  const resetAt = new Date(now.getTime() + limitConfig.windowMs)
  
  try {
    const existing = await withRetry(() => db.rateLimit.findUnique({
      where: {
        identifier_action: { identifier, action }
      }
    }))
    
    if (!existing || existing.resetAt < now) {
      // Create new or reset expired with retry
      await withRetry(() => db.rateLimit.upsert({
        where: {
          identifier_action: { identifier, action }
        },
        create: {
          identifier,
          action,
          count: 1,
          resetAt
        },
        update: {
          count: 1,
          resetAt
        }
      }))
      
      return {
        allowed: true,
        remaining: limitConfig.maxRequests - 1,
        resetAt
      }
    }
    
    if (existing.count >= limitConfig.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: existing.resetAt
      }
    }
    
    // Increment count with retry
    await withRetry(() => db.rateLimit.update({
      where: { id: existing.id },
      data: { count: { increment: 1 } }
    }))
    
    return {
      allowed: true,
      remaining: limitConfig.maxRequests - existing.count - 1,
      resetAt: existing.resetAt
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // On error, allow the request
    return {
      allowed: true,
      remaining: limitConfig.maxRequests,
      resetAt
    }
  }
}

// Clean old rate limit records
export async function cleanOldRateLimits(): Promise<number> {
  try {
    const result = await withRetry(() => db.rateLimit.deleteMany({
      where: {
        resetAt: { lt: new Date() }
      }
    }))
    return result.count
  } catch {
    return 0
  }
}
