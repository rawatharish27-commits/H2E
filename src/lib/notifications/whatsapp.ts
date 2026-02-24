/**
 * WhatsApp Notification Service for Community Help Network
 * 
 * This service handles sending WhatsApp notifications to paid users
 * when new problems are posted within their 20 KM radius.
 * 
 * Features:
 * - Rate limiting (max 5 notifications per user per day)
 * - Quiet hours support (no notifications during specified times)
 * - Problem type filtering
 * - Simulated WhatsApp Business API integration
 */

import { db } from '@/lib/db'
import { ProblemType, formatDistance, calculateDistance } from '@/types'

// Configuration
const MAX_NOTIFICATIONS_PER_DAY = 5
const NOTIFICATION_RADIUS_KM = 20

// Types
export interface WhatsAppNotificationPayload {
  userId: string
  problemId: string
  problemType: ProblemType
  problemTitle: string
  problemCategory: string | null
  distance: number
  postedByName: string | null
  offerPrice: number | null
}

export interface WhatsAppTemplateMessage {
  to: string
  templateName: string
  templateLanguage: string
  components: WhatsAppTemplateComponent[]
}

export interface WhatsAppTemplateComponent {
  type: 'header' | 'body' | 'button'
  parameters: Array<{
    type: 'text' | 'currency' | 'date_time'
    text?: string
    currency?: {
      fallback_value: string
      code: string
      amount_1000: number
    }
  }>
}

export interface NotificationResult {
  success: boolean
  notificationId?: string
  error?: string
  skipped?: boolean
  skipReason?: string
}

/**
 * Check if current time is within quiet hours for a user
 */
export function isQuietHours(
  quietHoursStart: string | null,
  quietHoursEnd: string | null
): boolean {
  if (!quietHoursStart || !quietHoursEnd) {
    return false
  }

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeMinutes = currentHour * 60 + currentMinute

  const [startHour, startMinute] = quietHoursStart.split(':').map(Number)
  const [endHour, endMinute] = quietHoursEnd.split(':').map(Number)

  const startTimeMinutes = startHour * 60 + startMinute
  const endTimeMinutes = endHour * 60 + endMinute

  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (startTimeMinutes > endTimeMinutes) {
    // Quiet hours span midnight
    return currentTimeMinutes >= startTimeMinutes || currentTimeMinutes < endTimeMinutes
  } else {
    // Quiet hours within same day
    return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes
  }
}

/**
 * Check if user has exceeded daily notification limit
 */
export async function hasExceededDailyLimit(userId: string): Promise<boolean> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const notificationCount = await db.whatsAppNotification.count({
    where: {
      userId,
      createdAt: {
        gte: today,
        lt: tomorrow
      },
      status: {
        not: 'FAILED'
      }
    }
  })

  return notificationCount >= MAX_NOTIFICATIONS_PER_DAY
}

/**
 * Check if user wants notifications for a specific problem type
 */
export function wantsNotificationForType(
  notificationTypes: string | null,
  problemType: ProblemType
): boolean {
  if (!notificationTypes) {
    // If not set, notify for all types
    return true
  }

  try {
    const types = JSON.parse(notificationTypes) as string[]
    return types.includes(problemType) || types.length === 0
  } catch {
    return true
  }
}

/**
 * Get all paid users within 20 KM radius of a location
 */
export async function getPaidUsersWithinRadius(
  lat: number,
  lng: number,
  excludeUserId?: string
): Promise<Array<{
  id: string
  phone: string
  name: string | null
  lat: number | null
  lng: number | null
  whatsappEnabled: boolean
  whatsappNumber: string | null
  quietHoursStart: string | null
  quietHoursEnd: string | null
  notificationTypes: string | null
  distance: number
}>> {
  // Get all paid users with location and WhatsApp enabled
  const paidUsers = await db.user.findMany({
    where: {
      paymentActive: true,
      activeTill: { gte: new Date() },
      isBlocked: false,
      isBanned: false,
      isShadowBanned: false,
      lat: { not: null },
      lng: { not: null },
      whatsappEnabled: true,
      whatsappNumber: { not: null },
      ...(excludeUserId && { id: { not: excludeUserId } })
    },
    select: {
      id: true,
      phone: true,
      name: true,
      lat: true,
      lng: true,
      whatsappEnabled: true,
      whatsappNumber: true,
      quietHoursStart: true,
      quietHoursEnd: true,
      notificationTypes: true
    }
  })

  // Filter by distance (20 KM radius)
  const usersWithinRadius = paidUsers
    .map(user => {
      if (!user.lat || !user.lng) return null

      const distance = calculateDistance(lat, lng, user.lat, user.lng)
      return {
        ...user,
        distance
      }
    })
    .filter((user): user is NonNullable<typeof user> => 
      user !== null && user.distance <= NOTIFICATION_RADIUS_KM
    )
    .sort((a, b) => a.distance - b.distance)

  return usersWithinRadius
}

/**
 * Generate WhatsApp template message for problem notification
 * Using WhatsApp Business API template format
 */
export function generateProblemNotificationTemplate(
  payload: WhatsAppNotificationPayload,
  whatsappNumber: string
): WhatsAppTemplateMessage {
  const problemTypeLabel = getProblemTypeLabel(payload.problemType)
  const distanceStr = formatDistance(payload.distance)
  const priceStr = payload.offerPrice ? `₹${payload.offerPrice}` : 'Negotiable'

  return {
    to: whatsappNumber,
    templateName: 'new_problem_nearby', // Pre-approved template name
    templateLanguage: 'en',
    components: [
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: problemTypeLabel // {{1}} - Problem type
          },
          {
            type: 'text',
            text: payload.problemTitle // {{2}} - Problem title
          },
          {
            type: 'text',
            text: distanceStr // {{3}} - Distance
          },
          {
            type: 'text',
            text: payload.postedByName || 'Someone' // {{4}} - Posted by
          },
          {
            type: 'text',
            text: priceStr // {{5}} - Offer price
          }
        ]
      }
    ]
  }
}

/**
 * Get human-readable label for problem type
 */
function getProblemTypeLabel(type: ProblemType): string {
  switch (type) {
    case 'EMERGENCY':
      return '🚨 Emergency'
    case 'TIME_ACCESS':
      return '⏰ Time/Access'
    case 'RESOURCE_RENT':
      return '📦 Resource/Rent'
    default:
      return '📋 Help Request'
  }
}

/**
 * Simulate sending WhatsApp message via Business API
 * In production, this would call the actual WhatsApp Business API
 */
export async function sendWhatsAppMessage(
  template: WhatsAppTemplateMessage
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Simulated API call - In production, use actual WhatsApp Business API
  // Example: https://graph.facebook.com/v17.0/{phone-number-id}/messages
  
  console.log('[WhatsApp] Sending notification to:', template.to)
  console.log('[WhatsApp] Template:', template.templateName)
  console.log('[WhatsApp] Components:', JSON.stringify(template.components, null, 2))

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))

  // Simulate 95% success rate
  const success = Math.random() > 0.05

  if (success) {
    const messageId = `wamid.HBgM${Date.now()}${Math.random().toString(36).substring(7)}`
    return { success: true, messageId }
  } else {
    return { success: false, error: 'Simulated delivery failure' }
  }
}

/**
 * Send WhatsApp notification to a single user
 */
export async function sendNotificationToUser(
  payload: WhatsAppNotificationPayload,
  user: {
    id: string
    whatsappNumber: string | null
    quietHoursStart: string | null
    quietHoursEnd: string | null
    notificationTypes: string | null
  }
): Promise<NotificationResult> {
  // Check if user has WhatsApp number
  if (!user.whatsappNumber) {
    return {
      success: false,
      skipped: true,
      skipReason: 'No WhatsApp number'
    }
  }

  // Check quiet hours
  if (isQuietHours(user.quietHoursStart, user.quietHoursEnd)) {
    return {
      success: false,
      skipped: true,
      skipReason: 'Quiet hours'
    }
  }

  // Check notification type preference
  if (!wantsNotificationForType(user.notificationTypes, payload.problemType)) {
    return {
      success: false,
      skipped: true,
      skipReason: 'Problem type not enabled'
    }
  }

  // Check daily limit
  if (await hasExceededDailyLimit(user.id)) {
    return {
      success: false,
      skipped: true,
      skipReason: 'Daily limit exceeded'
    }
  }

  // Create notification record
  const notification = await db.whatsAppNotification.create({
    data: {
      userId: user.id,
      problemId: payload.problemId,
      status: 'PENDING'
    }
  })

  try {
    // Generate template message
    const template = generateProblemNotificationTemplate(payload, user.whatsappNumber)

    // Send WhatsApp message
    const result = await sendWhatsAppMessage(template)

    if (result.success) {
      // Update notification status
      await db.whatsAppNotification.update({
        where: { id: notification.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          messageContent: JSON.stringify(template)
        }
      })

      return {
        success: true,
        notificationId: notification.id
      }
    } else {
      // Update notification with error
      await db.whatsAppNotification.update({
        where: { id: notification.id },
        data: {
          status: 'FAILED',
          errorMessage: result.error || 'Unknown error'
        }
      })

      return {
        success: false,
        notificationId: notification.id,
        error: result.error
      }
    }
  } catch (error) {
    // Update notification with error
    await db.whatsAppNotification.update({
      where: { id: notification.id },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    })

    return {
      success: false,
      notificationId: notification.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send notifications to all eligible paid users within 20 KM
 */
export async function notifyNearbyPaidUsers(
  problem: {
    id: string
    type: ProblemType
    title: string
    category: string | null
    lat: number
    lng: number
    offerPrice: number | null
    postedById: string
    postedBy: {
      name: string | null
    }
  }
): Promise<{
  totalNotified: number
  totalSkipped: number
  totalFailed: number
  results: Array<NotificationResult & { userId: string }>
}> {
  // Get all eligible paid users within radius
  const nearbyUsers = await getPaidUsersWithinRadius(
    problem.lat,
    problem.lng,
    problem.postedById // Don't notify the poster
  )

  console.log(`[WhatsApp] Found ${nearbyUsers.length} eligible users within ${NOTIFICATION_RADIUS_KM} KM`)

  const results: Array<NotificationResult & { userId: string }> = []
  let totalNotified = 0
  let totalSkipped = 0
  let totalFailed = 0

  // Send notifications (with small delay between each to avoid rate limits)
  for (const user of nearbyUsers) {
    const payload: WhatsAppNotificationPayload = {
      userId: user.id,
      problemId: problem.id,
      problemType: problem.type,
      problemTitle: problem.title,
      problemCategory: problem.category,
      distance: user.distance,
      postedByName: problem.postedBy.name,
      offerPrice: problem.offerPrice
    }

    const result = await sendNotificationToUser(payload, user)
    results.push({ ...result, userId: user.id })

    if (result.success) {
      totalNotified++
    } else if (result.skipped) {
      totalSkipped++
    } else {
      totalFailed++
    }

    // Small delay between notifications
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  // Log summary
  console.log(`[WhatsApp] Notification summary for problem ${problem.id}:`)
  console.log(`  - Notified: ${totalNotified}`)
  console.log(`  - Skipped: ${totalSkipped}`)
  console.log(`  - Failed: ${totalFailed}`)

  return {
    totalNotified,
    totalSkipped,
    totalFailed,
    results
  }
}

/**
 * Get notification history for a user
 */
export async function getNotificationHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Array<{
  id: string
  problemId: string
  status: string
  sentAt: Date | null
  deliveredAt: Date | null
  createdAt: Date
  problem: {
    id: string
    title: string
    type: string
    category: string | null
  }
}>> {
  const notifications = await db.whatsAppNotification.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  })

  // Get problem details for each notification
  const problemIds = notifications.map(n => n.problemId)
  const problems = await db.problem.findMany({
    where: { id: { in: problemIds } },
    select: {
      id: true,
      title: true,
      type: true,
      category: true
    }
  })

  const problemMap = new Map(problems.map(p => [p.id, p]))

  return notifications.map(n => ({
    id: n.id,
    problemId: n.problemId,
    status: n.status,
    sentAt: n.sentAt,
    deliveredAt: n.deliveredAt,
    createdAt: n.createdAt,
    problem: problemMap.get(n.problemId) || {
      id: n.problemId,
      title: 'Unknown Problem',
      type: 'UNKNOWN',
      category: null
    }
  }))
}

/**
 * Update user notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    whatsappEnabled?: boolean
    whatsappNumber?: string | null
    quietHoursStart?: string | null
    quietHoursEnd?: string | null
    notificationTypes?: string[]
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        ...(preferences.whatsappEnabled !== undefined && { whatsappEnabled: preferences.whatsappEnabled }),
        ...(preferences.whatsappNumber !== undefined && { whatsappNumber: preferences.whatsappNumber }),
        ...(preferences.quietHoursStart !== undefined && { quietHoursStart: preferences.quietHoursStart }),
        ...(preferences.quietHoursEnd !== undefined && { quietHoursEnd: preferences.quietHoursEnd }),
        ...(preferences.notificationTypes !== undefined && { 
          notificationTypes: JSON.stringify(preferences.notificationTypes) 
        })
      }
    })

    return { success: true }
  } catch (error) {
    console.error('[WhatsApp] Failed to update preferences:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Get user notification preferences
 */
export async function getNotificationPreferences(userId: string): Promise<{
  whatsappEnabled: boolean
  whatsappNumber: string | null
  quietHoursStart: string | null
  quietHoursEnd: string | null
  notificationTypes: string[]
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      whatsappEnabled: true,
      whatsappNumber: true,
      quietHoursStart: true,
      quietHoursEnd: true,
      notificationTypes: true
    }
  })

  if (!user) {
    return {
      whatsappEnabled: false,
      whatsappNumber: null,
      quietHoursStart: null,
      quietHoursEnd: null,
      notificationTypes: []
    }
  }

  let notificationTypes: string[] = []
  try {
    if (user.notificationTypes) {
      notificationTypes = JSON.parse(user.notificationTypes) as string[]
    }
  } catch {
    notificationTypes = []
  }

  return {
    whatsappEnabled: user.whatsappEnabled,
    whatsappNumber: user.whatsappNumber,
    quietHoursStart: user.quietHoursStart,
    quietHoursEnd: user.quietHoursEnd,
    notificationTypes
  }
}
