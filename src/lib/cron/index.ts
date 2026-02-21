/**
 * Cron Job Services
 * Automated tasks for subscription reminders, inactive users, daily stats
 */

import { db } from '@/lib/db'
import { notifySubscriptionExpiring, notifyInactiveUser, createNotification } from '@/lib/notifications'
import { unlockPendingRewards } from '@/lib/referral'
import { autoFlagSuspiciousAccounts } from '@/lib/fraud'
import { cleanupOldNotifications } from '@/lib/notifications'

// Configuration
const SUBSCRIPTION_REMINDER_DAYS = [3, 1] // Days before expiry to send reminder
const INACTIVE_USER_DAYS = [3, 7, 14] // Days of inactivity to send reminders
const DAILY_STATS_RETENTION_DAYS = 90

/**
 * Send subscription expiry reminders
 * Runs daily at 10:00 AM
 */
export async function sendSubscriptionReminders(): Promise<{
  sent: number
  errors: number
}> {
  let sent = 0
  let errors = 0

  for (const daysLeft of SUBSCRIPTION_REMINDER_DAYS) {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + daysLeft)
    targetDate.setHours(23, 59, 59, 999)

    const startDate = new Date(targetDate)
    startDate.setHours(0, 0, 0, 0)

    // Find users whose subscription expires in X days
    const expiringUsers = await db.user.findMany({
      where: {
        paymentActive: true,
        activeTill: {
          gte: startDate,
          lte: targetDate
        },
        isBlocked: false,
        isBanned: false
      },
      select: { id: true, name: true }
    })

    for (const user of expiringUsers) {
      try {
        // Check if we already sent a reminder for this period
        const existingReminder = await db.notification.findFirst({
          where: {
            userId: user.id,
            type: 'SUBSCRIPTION_EXPIRING',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          }
        })

        if (!existingReminder) {
          await notifySubscriptionExpiring(user.id, daysLeft)
          sent++
        }
      } catch (error) {
        console.error(`[Cron] Failed to send reminder to ${user.id}:`, error)
        errors++
      }
    }
  }

  console.log(`[Cron] Subscription reminders: ${sent} sent, ${errors} errors`)
  return { sent, errors }
}

/**
 * Mark expired subscriptions as inactive
 * Runs daily at midnight
 */
export async function processExpiredSubscriptions(): Promise<{
  expired: number
}> {
  const now = new Date()

  const result = await db.user.updateMany({
    where: {
      paymentActive: true,
      activeTill: {
        lt: now
      }
    },
    data: {
      paymentActive: false
    }
  })

  // Notify users about expired subscription
  const expiredUsers = await db.user.findMany({
    where: {
      paymentActive: false,
      activeTill: { lt: now }
    },
    select: { id: true }
  })

  for (const user of expiredUsers) {
    await createNotification({
      userId: user.id,
      type: 'SUBSCRIPTION_EXPIRED',
      title: 'Subscription Expired',
      message: 'Your subscription has expired. Renew to continue accessing help requests.',
      priority: 'HIGH'
    }).catch(console.error)
  }

  console.log(`[Cron] Processed ${result.count} expired subscriptions`)
  return { expired: result.count }
}

/**
 * Send inactive user re-engagement notifications
 * Runs daily at 11:00 AM
 */
export async function sendInactiveUserReminders(): Promise<{
  sent: number
  errors: number
}> {
  let sent = 0
  let errors = 0

  for (const daysInactive of INACTIVE_USER_DAYS) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive)
    cutoffDate.setHours(23, 59, 59, 999)

    const startDate = new Date(cutoffDate)
    startDate.setHours(0, 0, 0, 0)

    // Find users who haven't been active for X days
    const inactiveUsers = await db.user.findMany({
      where: {
        lastActiveAt: {
          gte: startDate,
          lte: cutoffDate
        },
        isBlocked: false,
        isBanned: false,
        paymentActive: true // Only notify paid users
      },
      select: { id: true, name: true, lastActiveAt: true }
    })

    for (const user of inactiveUsers) {
      try {
        // Check if we already sent a reminder recently
        const existingReminder = await db.notification.findFirst({
          where: {
            userId: user.id,
            type: 'INACTIVE_REMINDER',
            createdAt: {
              gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Last 3 days
            }
          }
        })

        if (!existingReminder) {
          await notifyInactiveUser(user.id, daysInactive)
          sent++
        }
      } catch (error) {
        console.error(`[Cron] Failed to send inactive reminder to ${user.id}:`, error)
        errors++
      }
    }
  }

  console.log(`[Cron] Inactive user reminders: ${sent} sent, ${errors} errors`)
  return { sent, errors }
}

/**
 * Generate daily statistics
 * Runs daily at 11:59 PM
 */
export async function generateDailyStats(): Promise<{
  date: string
  stats: Record<string, number>
}> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateStr = today.toISOString().split('T')[0]

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [
    newUsers,
    activeUsers,
    paidUsers,
    problemsPosted,
    problemsClosed,
    totalHelps,
    noShows,
    paymentsPending,
    paymentsApproved,
    revenue,
    fraudAttempts,
    accountsBanned,
    reportsReceived
  ] = await Promise.all([
    // New users today
    db.user.count({
      where: { createdAt: { gte: today, lt: tomorrow } }
    }),
    // Active users today
    db.user.count({
      where: { lastActiveAt: { gte: today, lt: tomorrow } }
    }),
    // Paid users
    db.user.count({
      where: { paymentActive: true }
    }),
    // Problems posted today
    db.problem.count({
      where: { createdAt: { gte: today, lt: tomorrow } }
    }),
    // Problems closed today
    db.problem.count({
      where: { closedAt: { gte: today, lt: tomorrow } }
    }),
    // Total helps (feedbacks created)
    db.feedback.count({
      where: { createdAt: { gte: today, lt: tomorrow } }
    }),
    // No-shows today
    db.problem.count({
      where: { noShowReported: true, updatedAt: { gte: today, lt: tomorrow } }
    }),
    // Payments pending
    db.payment.count({
      where: { status: 'PENDING' }
    }),
    // Payments approved today
    db.payment.count({
      where: { status: 'APPROVED', approvedAt: { gte: today, lt: tomorrow } }
    }),
    // Revenue today
    db.payment.aggregate({
      where: { status: 'APPROVED', approvedAt: { gte: today, lt: tomorrow } },
      _sum: { amount: true }
    }),
    // Fraud attempts today
    db.securityAudit.count({
      where: { eventType: 'FRAUD_ATTEMPT', createdAt: { gte: today, lt: tomorrow } }
    }),
    // Accounts banned today
    db.user.count({
      where: { isBanned: true, updatedAt: { gte: today, lt: tomorrow } }
    }),
    // Reports received today
    db.report.count({
      where: { createdAt: { gte: today, lt: tomorrow } }
    })
  ])

  const stats = {
    newUsers,
    activeUsers,
    paidUsers,
    problemsPosted,
    problemsClosed,
    totalHelps,
    noShows,
    paymentsPending,
    paymentsApproved,
    revenue: revenue._sum.amount || 0,
    fraudAttempts,
    accountsBanned,
    reportsReceived
  }

  // Save to database
  await db.dailyStat.upsert({
    where: { date: dateStr },
    update: stats,
    create: {
      date: dateStr,
      ...stats
    }
  })

  console.log(`[Cron] Generated daily stats for ${dateStr}:`, stats)
  return { date: dateStr, stats }
}

/**
 * Run all daily cron jobs
 * Can be called by Vercel Cron
 */
export async function runDailyCronJobs(): Promise<{
  subscriptionReminders: { sent: number; errors: number }
  expiredSubscriptions: { expired: number }
  inactiveUserReminders: { sent: number; errors: number }
  dailyStats: { date: string; stats: Record<string, number> }
  referralRewards: { processed: number; totalAmount: number }
  fraudDetection: number
  cleanup: number
}> {
  console.log('[Cron] Starting daily cron jobs...')

  const results = await Promise.all([
    sendSubscriptionReminders(),
    processExpiredSubscriptions(),
    sendInactiveUserReminders(),
    generateDailyStats(),
    unlockPendingRewards(),
    autoFlagSuspiciousAccounts(),
    cleanupOldNotifications()
  ])

  console.log('[Cron] Daily cron jobs completed')

  return {
    subscriptionReminders: results[0],
    expiredSubscriptions: results[1],
    inactiveUserReminders: results[2],
    dailyStats: results[3],
    referralRewards: results[4],
    fraudDetection: results[5],
    cleanup: results[6]
  }
}

/**
 * Run hourly cron jobs
 */
export async function runHourlyCronJobs(): Promise<{
  referralRewards: { processed: number; totalAmount: number }
  fraudDetection: number
}> {
  console.log('[Cron] Starting hourly cron jobs...')

  const results = await Promise.all([
    unlockPendingRewards(),
    autoFlagSuspiciousAccounts()
  ])

  console.log('[Cron] Hourly cron jobs completed')

  return {
    referralRewards: results[0],
    fraudDetection: results[1]
  }
}
