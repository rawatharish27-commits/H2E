// JWT and Authentication Utilities
import { db, withRetry } from '@/lib/db'
import { randomBytes, createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// JWT-like token generation (simplified for SQLite)
export function generateToken(userId: string): string {
  const random = randomBytes(32).toString('hex')
  const timestamp = Date.now().toString(36)
  const hash = createHash('sha256')
    .update(`${userId}:${random}:${timestamp}`)
    .digest('hex')
  
  return `${userId}.${random}.${hash.substring(0, 32)}`
}

// Verify token and return user
export async function verifyToken(token: string): Promise<string | null> {
  if (!token) return null
  
  try {
    const [userId] = token.split('.')
    
    const session = await withRetry(() => db.session.findFirst({
      where: {
        token,
        expiresAt: { gte: new Date() }
      },
      include: { user: true }
    }))
    
    if (!session) return null
    
    // Update last used with retry
    await withRetry(() => db.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() }
    }))
    
    return session.userId
  } catch {
    return null
  }
}

// Create session
export async function createSession(
  userId: string, 
  deviceInfo?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const token = generateToken(userId)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  await withRetry(() => db.session.create({
    data: {
      userId,
      token,
      deviceInfo,
      ipAddress,
      userAgent,
      expiresAt
    }
  }))
  
  return token
}

// Delete session (logout)
export async function deleteSession(token: string): Promise<boolean> {
  try {
    await withRetry(() => db.session.deleteMany({
      where: { token }
    }))
    return true
  } catch {
    return false
  }
}

// Delete all user sessions (logout from all devices)
export async function deleteAllUserSessions(userId: string, exceptToken?: string): Promise<number> {
  try {
    const result = await withRetry(() => db.session.deleteMany({
      where: {
        userId,
        ...(exceptToken && { NOT: { token: exceptToken } })
      }
    }))
    return result.count
  } catch {
    return 0
  }
}

// Clean expired sessions
export async function cleanExpiredSessions(): Promise<number> {
  try {
    const result = await withRetry(() => db.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    }))
    return result.count
  } catch {
    return 0
  }
}

// Generate referral code
export function generateReferralCode(name?: string): string {
  const prefix = 'H2E'
  const namePart = name 
    ? name.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4) 
    : randomBytes(2).toString('hex').toUpperCase()
  const randomPart = randomBytes(2).toString('hex').toUpperCase()
  
  return `${prefix}-${namePart}-${randomPart}`
}

// Generate temp referral code for pre-login
export function generateTempReferralCode(): string {
  return `TEMP-${randomBytes(3).toString('hex').toUpperCase()}`
}

// Auth middleware for API routes
export async function authMiddleware(request: NextRequest): Promise<{ userId: string } | NextResponse> {
  // Get token from Authorization header or cookies
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    )
  }
  
  const userId = await verifyToken(token)
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or expired token' },
      { status: 401 }
    )
  }
  
  return { userId }
}
