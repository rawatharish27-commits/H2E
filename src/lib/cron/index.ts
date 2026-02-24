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

/**
 * 7-Day Engagement Flow
 * Sends targeted notifications to users on specific days
 * Day 1: Nearby help available
 * Day 3: Social proof
 * Day 6: Encourage contribution
 */
export async function send7DayEngagementFlow(): Promise<{
  day1: number
  day3: number
  day6: number
}> {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  let day1Sent = 0
  let day3Sent = 0
  let day6Sent = 0

  // Day 1: New users - Show nearby help available
  const day1Users = await db.user.findMany({
    where: {
      createdAt: {
        gte: now,
        lt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
      },
      isBlocked: false,
      isBanned: false
    },
    select: { id: true, areaCode: true }
  })

  for (const user of day1Users) {
    // Check for nearby problems
    const nearbyCount = await db.problem.count({
      where: {
        status: 'OPEN',
        areaCode: user.areaCode || undefined
      }
    })

    if (nearbyCount > 0) {
      await createNotification({
        userId: user.id,
        type: 'HELP_ALERT',
        title: '🆘 Help Needed Nearby!',
        message: `${nearbyCount} help requests available near you. Be the first to help!`,
        priority: 'HIGH'
      }).catch(console.error)
      day1Sent++
    }
  }

  // Day 3: Show social proof
  const day3Date = new Date(now)
  day3Date.setDate(day3Date.getDate() - 3)

  const day3Users = await db.user.findMany({
    where: {
      createdAt: {
        gte: day3Date,
        lt: new Date(day3Date.getTime() + 24 * 60 * 60 * 1000)
      },
      helpfulCount: 0, // Haven't helped yet
      isBlocked: false,
      isBanned: false
    },
    select: { id: true }
  })

  for (const user of day3Users) {
    // Get today's helps count
    const todayHelps = await db.feedback.count({
      where: {
        createdAt: { gte: now }
      }
    })

    await createNotification({
      userId: user.id,
      type: 'SYSTEM',
      title: '🌟 Community Update',
      message: `Aaj ${todayHelps} logon ki madad hui! Aap bhi participate karein.`,
      priority: 'NORMAL'
    }).catch(console.error)
    day3Sent++
  }

  // Day 6: Encourage contribution
  const day6Date = new Date(now)
  day6Date.setDate(day6Date.getDate() - 6)

  const day6Users = await db.user.findMany({
    where: {
      createdAt: {
        gte: day6Date,
        lt: new Date(day6Date.getTime() + 24 * 60 * 60 * 1000)
      },
      helpfulCount: { equals: 0 },
      problems: { none: {} }, // Haven't posted or helped
      isBlocked: false,
      isBanned: false
    },
    select: { id: true }
  })

  for (const user of day6Users) {
    await createNotification({
      userId: user.id,
      type: 'SYSTEM',
      title: '💪 Time to Get Started!',
      message: 'Aapka account active hai! Kisi ki madad karein ya help request post karein.',
      priority: 'HIGH'
    }).catch(console.error)
    day6Sent++
  }

  console.log(`[Cron] 7-Day Engagement: Day1=${day1Sent}, Day3=${day3Sent}, Day6=${day6Sent}`)

  return {
    day1: day1Sent,
    day3: day3Sent,
    day6: day6Sent
  }
}

/**
 * Reset daily counters for core helpers
 * Runs at midnight
 */
export async function resetDailyCoreHelperCounters(): Promise<number> {
  const result = await db.coreHelper.updateMany({
    where: {
      todayResponses: { gt: 0 }
    },
    data: {
      todayResponses: 0
    }
  })

  console.log(`[Cron] Reset daily counters for ${result.count} core helpers`)
  return result.count
}

/**
 * Check core helper response times
 * Runs every 30 minutes
 */
export async function checkCoreHelperResponseTimes(): Promise<{
  onTime: number
  missed: number
}> {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

  // Find problems from last 30 minutes
  const recentProblems = await db.problem.findMany({
    where: {
      createdAt: { gte: thirtyMinutesAgo },
      status: 'OPEN'
    },
    select: { id: true, areaCode: true }
  })

  let onTime = 0
  let missed = 0

  for (const problem of recentProblems) {
    if (!problem.areaCode) continue

    // Get core helpers for this area
    const coreHelpers = await db.coreHelper.findMany({
      where: {
        areaCode: problem.areaCode,
        status: 'ACTIVE'
      },
      select: { id: true, userId: true, lastResponseAt: true }
    })

    // Check if they responded
    for (const helper of coreHelpers) {
      const registration = await db.helperRegistration.findUnique({
        where: {
          problemId_helperId: {
            problemId: problem.id,
            helperId: helper.userId
          }
        }
      })

      if (registration && registration.registeredAt <= new Date(problem.createdAt.getTime() + 30 * 60 * 1000)) {
        // Responded within 30 minutes
        await db.coreHelper.update({
          where: { id: helper.id },
          data: {
            responseStreak: { increment: 1 },
            lastResponseAt: new Date()
          }
        })
        onTime++
      } else if (!registration) {
        // Didn't respond - reset streak
        await db.coreHelper.update({
          where: { id: helper.id },
          data: {
            responseStreak: 0
          }
        })
        missed++
      }
    }
  }

  console.log(`[Cron] Core helper responses: OnTime=${onTime}, Missed=${missed}`)
  return { onTime, missed }
}

/**
 * Update area density stats
 * Minimum 5 visible interactions daily
 */
export async function updateAreaDensityStats(): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const areas = await db.area.findMany({
    select: { id: true, areaCode: true }
  })

  for (const area of areas) {
    const [helps, posts, helpers] = await Promise.all([
      db.feedback.count({
        where: {
          createdAt: { gte: today },
          problem: { areaCode: area.areaCode }
        }
      }),
      db.problem.count({
        where: {
          createdAt: { gte: today },
          areaCode: area.areaCode
        }
      }),
      db.helperRegistration.count({
        where: {
          registeredAt: { gte: today },
          problem: { areaCode: area.areaCode }
        }
      })
    ])

    await db.area.update({
      where: { id: area.id },
      data: {
        todayHelps: helps,
        todayPosts: posts,
        activeHelpers: helpers
      }
    })
  }

  console.log(`[Cron] Updated density stats for ${areas.length} areas`)
  return areas.length
}
