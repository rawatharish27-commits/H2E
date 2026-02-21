/**
 * Vercel Cron API Route
 * Handles scheduled tasks from Vercel Cron
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [
 *     { "path": "/api/cron?secret=YOUR_SECRET&job=daily", "schedule": "0 0 * * *" },
 *     { "path": "/api/cron?secret=YOUR_SECRET&job=hourly", "schedule": "0 * * * *" }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { runDailyCronJobs, runHourlyCronJobs } from '@/lib/cron'

// Secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-here'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const job = searchParams.get('job')

    // Validate secret
    if (secret !== CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Run the appropriate job
    let result

    switch (job) {
      case 'daily':
        result = await runDailyCronJobs()
        break
      
      case 'hourly':
        result = await runHourlyCronJobs()
        break
      
      case 'subscription-reminders':
        const { sendSubscriptionReminders, processExpiredSubscriptions } = await import('@/lib/cron')
        result = {
          reminders: await sendSubscriptionReminders(),
          expired: await processExpiredSubscriptions()
        }
        break
      
      case 'inactive-users':
        const { sendInactiveUserReminders } = await import('@/lib/cron')
        result = await sendInactiveUserReminders()
        break
      
      case 'daily-stats':
        const { generateDailyStats } = await import('@/lib/cron')
        result = await generateDailyStats()
        break
      
      case 'referral-rewards':
        const { unlockPendingRewards } = await import('@/lib/referral')
        result = await unlockPendingRewards()
        break
      
      case 'fraud-detection':
        const { autoFlagSuspiciousAccounts } = await import('@/lib/fraud')
        result = { flagged: await autoFlagSuspiciousAccounts() }
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid job type. Use: daily, hourly, subscription-reminders, inactive-users, daily-stats, referral-rewards, fraud-detection' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      job,
      executedAt: new Date().toISOString(),
      result
    })
  } catch (error) {
    console.error('[Cron API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
