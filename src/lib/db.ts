import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure Prisma for serverless environments (Vercel, etc.)
// The "prepared statement already exists" error occurs with connection pooling (pgbouncer)
// when Prisma tries to reuse prepared statements across different serverless invocations.
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // For Vercel Postgres with pgbouncer, configure transaction options
    __internal: {
      engine: {
        // Use the direct URL for transactions to avoid prepared statement issues
        // This requires DIRECT_DATABASE_URL to be set in environment
      }
    }
  })
}

// Use singleton pattern to prevent multiple PrismaClient instances
export const db = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Helper function to execute queries with retry logic for serverless
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // Check if it's the prepared statement error
      const isPreparedStatementError = 
        error?.code === 'P2010' || // Transaction failed
        error?.message?.includes('prepared statement') ||
        error?.message?.includes('42P05')
      
      if (isPreparedStatementError && attempt < maxRetries) {
        // Disconnect and reconnect to get a fresh connection
        await db.$disconnect()
        console.log(`[Prisma] Retrying query (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, 100 * attempt))
        continue
      }
      
      throw error
    }
  }
  
  throw lastError
}

// Graceful shutdown for cleanup
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await db.$disconnect()
  })
}
