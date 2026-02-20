/**
 * Prisma Configuration for Help2Earn
 * 
 * This file contains configuration settings for Prisma ORM
 * with PostgreSQL database support.
 */

export const prismaConfig = {
  // Database connection settings
  database: {
    provider: 'postgresql' as const,
    url: process.env.DATABASE_URL || '',
    directUrl: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || '',
  },

  // Connection pool settings (for production)
  connectionPool: {
    // Maximum number of connections in the pool
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    // Connection timeout in seconds
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30'),
  },

  // Logging configuration
  logging: {
    // Enable query logging in development
    enabled: process.env.NODE_ENV === 'development',
    // Log level: 'query', 'info', 'warn', 'error'
    level: ['error', 'warn'] as const,
  },

  // Migration settings
  migration: {
    // Auto-apply migrations in development
    autoApply: process.env.NODE_ENV === 'development',
  },

  // Backup settings (for production)
  backup: {
    enabled: process.env.NODE_ENV === 'production',
    retentionDays: parseInt(process.env.DB_BACKUP_RETENTION_DAYS || '30'),
  },
}

// Database URL validation
export function validateDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('❌ DATABASE_URL is not set in environment variables')
    return false
  }
  
  // Check if it's a valid PostgreSQL URL
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    console.error('❌ DATABASE_URL must be a PostgreSQL connection string')
    return false
  }
  
  return true
}

// Connection test function
export async function testDatabaseConnection(prisma: any): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

export default prismaConfig
