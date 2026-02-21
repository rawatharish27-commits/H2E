/**
 * Central Notification Service
 * Handles all notification types: In-app, WhatsApp, Push (future)
 */

import { db } from '@/lib/db'

// Notification types
export type NotificationType =
  | 'HELP_ALERT'      // New problem nearby
  | 'HELP_ACCEPTED'   // Someone accepted your problem
  | 'HELP_COMPLETED'  // Help was completed
  | 'RATING_RECEIVED' // You received a rating
  | 'REFERRAL_VERIFIED' // Referral code verified
  | 'REFERRAL_REWARD' // Referral reward earned
  | 'SUBSCRIPTION_EXPIRING' // Subscription about to expire
  | 'SUBSCRIPTION_EXPIRED' // Subscription expired
  | 'PAYMENT_APPROVED' // Payment approved
  | 'PAYMENT_REJECTED' // Payment rejected
  | 'TRUST_CHANGE'    // Trust score changed
  | 'SYSTEM'          // System announcement
  | 'SECURITY'        // Security alert
  | 'LEADER_UNLOCKED' // Leader status unlocked
  | 'WITHDRAWAL_PROCESSED' // Withdrawal completed
  | 'INACTIVE_REMINDER' // Come back reminder
  | 'STREAK_REWARD'   // Login streak reward

export interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
}

export interface NotificationResult {
  success: boolean
  notificationId?: string
  error?: string
}

/**
 * Create an in-app notification
 */
export async function createNotification(params: CreateNotificationParams): Promise<NotificationResult> {
  try {
    const notification = await db.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        data: params.data ? JSON.stringify(params.data) : null,
        isRead: false
      }
    })

    console.log(`[Notification] Created ${params.type} for user ${params.userId}`)

    return {
      success: true,
      notificationId: notification.id
    }
  } catch (error) {
    console.error('[Notification] Failed to create:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Create multiple notifications at once (batch)
 */
export async function createNotificationsBatch(
  notifications: Array<CreateNotificationParams>
): Promise<{ success: number; failed: number }> {
  try {
    const result = await db.notification.createMany({
      data: notifications.map(n => ({
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data ? JSON.stringify(n.data) : null,
        isRead: false
      }))
    })

    console.log(`[Notification] Batch created: ${result.count} notifications`)
    return { success: result.count, failed: 0 }
  } catch (error) {
    console.error('[Notification] Batch failed:', error)
    return { success: 0, failed: notifications.length }
  }
}

/**
 * Get unread notifications for a user
 */
export async function getUnreadNotifications(userId: string, limit: number = 20) {
  return db.notification.findMany({
    where: {
      userId,
      isRead: false
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })
}

/**
 * Get all notifications for a user (paginated)
 */
export async function getNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit

  const [notifications, total] = await Promise.all([
    db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    db.notification.count({ where: { userId } })
  ])

  return {
    notifications,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string, userId: string) {
  return db.notification.updateMany({
    where: {
      id: notificationId,
      userId
    },
    data: { isRead: true }
  })
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  return db.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: { isRead: true }
  })
}

/**
 * Get unread count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return db.notification.count({
    where: {
      userId,
      isRead: false
    }
  })
}

// ============= HELPER FUNCTIONS FOR COMMON NOTIFICATIONS =============

/**
 * Notify user about new problem nearby
 */
export async function notifyNearbyHelper(
  helperId: string,
  problemDetails: {
    id: string
    title: string
    type: string
    distance: number
    offerPrice?: number | null
  }
): Promise<NotificationResult> {
  return createNotification({
    userId: helperId,
    type: 'HELP_ALERT',
    title: '🆘 New Help Request Nearby!',
    message: `${problemDetails.title} - ${problemDetails.distance.toFixed(1)}km away${problemDetails.offerPrice ? ` • ₹${problemDetails.offerPrice}` : ''}`,
    data: { problemId: problemDetails.id, problemType: problemDetails.type },
    priority: problemDetails.type === 'EMERGENCY' ? 'URGENT' : 'NORMAL'
  })
}

/**
 * Notify user about subscription expiring
 */
export async function notifySubscriptionExpiring(
  userId: string,
  daysLeft: number
): Promise<NotificationResult> {
  return createNotification({
    userId,
    type: 'SUBSCRIPTION_EXPIRING',
    title: '⏰ Subscription Expiring Soon',
    message: `Your subscription expires in ${daysLeft} days. Renew to continue accessing help requests.`,
    data: { daysLeft },
    priority: 'HIGH'
  })
}

/**
 * Notify user about referral reward
 */
export async function notifyReferralReward(
  userId: string,
  amount: number,
  referredUserName: string
): Promise<NotificationResult> {
  return createNotification({
    userId,
    type: 'REFERRAL_REWARD',
    title: '🎉 Referral Reward Earned!',
    message: `You earned ₹${amount}! ${referredUserName} completed their first task.`,
    data: { amount, referredUserName },
    priority: 'NORMAL'
  })
}

/**
 * Notify user about trust score change
 */
export async function notifyTrustChange(
  userId: string,
  change: number,
  newScore: number,
  reason: string
): Promise<NotificationResult> {
  const emoji = change > 0 ? '📈' : '📉'
  return createNotification({
    userId,
    type: 'TRUST_CHANGE',
    title: `${emoji} Trust Score Updated`,
    message: `${change > 0 ? '+' : ''}${change} points. New score: ${newScore}. ${reason}`,
    data: { change, newScore, reason },
    priority: 'LOW'
  })
}

/**
 * Notify inactive user to come back
 */
export async function notifyInactiveUser(
  userId: string,
  daysInactive: number
): Promise<NotificationResult> {
  return createNotification({
    userId,
    type: 'INACTIVE_REMINDER',
    title: '👋 We miss you!',
    message: `You haven't been active for ${daysInactive} days. Come back and help your community!`,
    data: { daysInactive },
    priority: 'NORMAL'
  })
}

/**
 * Notify about payment approval
 */
export async function notifyPaymentApproved(
  userId: string,
  daysGranted: number
): Promise<NotificationResult> {
  return createNotification({
    userId,
    type: 'PAYMENT_APPROVED',
    title: '✅ Payment Approved!',
    message: `Your subscription is now active for ${daysGranted} days. Start helping now!`,
    data: { daysGranted },
    priority: 'HIGH'
  })
}

/**
 * Clean up old notifications (older than 30 days)
 */
export async function cleanupOldNotifications(): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  const result = await db.notification.deleteMany({
    where: {
      createdAt: { lt: thirtyDaysAgo },
      isRead: true
    }
  })

  console.log(`[Notification] Cleaned up ${result.count} old notifications`)
  return result.count
}
