// Input Validation with Zod
import { z } from 'zod'

// Phone validation (Indian numbers)
export const phoneSchema = z.string()
  .regex(/^[6-9]\d{9}$/, 'Invalid phone number')

// OTP validation
export const otpSchema = z.string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d+$/, 'OTP must contain only digits')

// User name validation
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')

// Problem title validation
export const problemTitleSchema = z.string()
  .min(10, 'Title must be at least 10 characters')
  .max(200, 'Title must be less than 200 characters')

// Problem description validation
export const problemDescriptionSchema = z.string()
  .min(20, 'Description must be at least 20 characters')
  .max(2000, 'Description must be less than 2000 characters')

// Price validation
export const priceSchema = z.number()
  .min(0, 'Price cannot be negative')
  .max(100000, 'Price cannot exceed ₹1,00,000')
  .optional()
  .nullable()

// Location validation
export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180)
})

// Send OTP request validation
export const sendOtpRequestSchema = z.object({
  phone: phoneSchema
})

// Verify OTP request validation
export const verifyOtpRequestSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema
})

// Create problem request validation
export const createProblemRequestSchema = z.object({
  type: z.enum(['EMERGENCY', 'TIME_ACCESS', 'RESOURCE_RENT']),
  category: z.string().optional(),
  title: problemTitleSchema,
  description: problemDescriptionSchema,
  offerPrice: priceSchema,
  lat: z.number(),
  lng: z.number(),
  address: z.string().max(500).optional()
})

// Create payment request validation
export const createPaymentRequestSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w]+$/, 'Invalid UPI ID').optional(),
  transactionRef: z.string().max(100).optional()
})

// Feedback validation
export const feedbackRequestSchema = z.object({
  problemId: z.string().cuid(),
  toUserId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  helperArrived: z.boolean()
})

// Report validation
export const reportRequestSchema = z.object({
  reportedUserId: z.string().cuid(),
  problemId: z.string().cuid().optional(),
  reason: z.string().min(10).max(500),
  description: z.string().max(1000).optional()
})

// Admin action validation
export const adminActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'block', 'unblock', 'ban', 'unban', 'resetTrust']),
  reason: z.string().max(500).optional()
})

// Sanitize string input
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
}

// Sanitize phone number
export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(0, 10)
}

// Validate and sanitize helper
export function validateInput<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      return { success: false, error: messages.join(', ') }
    }
    return { success: false, error: 'Validation failed' }
  }
}
