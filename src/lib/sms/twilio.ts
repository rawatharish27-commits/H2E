// Twilio SMS Service for Help2Earn
import twilio from 'twilio'

// Twilio configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

// Check if Twilio credentials are valid
function isValidTwilioConfig(): boolean {
  return !!(
    TWILIO_ACCOUNT_SID && 
    TWILIO_ACCOUNT_SID.startsWith('AC') &&
    TWILIO_AUTH_TOKEN && 
    TWILIO_AUTH_TOKEN.length > 0 &&
    TWILIO_PHONE_NUMBER
  )
}

// Initialize Twilio client only if credentials are valid
let twilioClient: twilio.Twilio | null = null

try {
  if (isValidTwilioConfig()) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID!, TWILIO_AUTH_TOKEN!)
    console.log('[SMS] Twilio client initialized successfully')
  } else {
    console.log('[SMS] Twilio not configured or invalid credentials. SMS will be logged only.')
  }
} catch (error) {
  console.error('[SMS] Failed to initialize Twilio:', error)
  twilioClient = null
}

export interface SendSmsResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send SMS via Twilio
 */
export async function sendSms(
  to: string,
  message: string
): Promise<SendSmsResult> {
  // Check if Twilio is configured and client is available
  if (!twilioClient || !TWILIO_PHONE_NUMBER) {
    console.warn('[SMS] Twilio not configured. SMS will be logged only.')
    console.log(`[SMS] To: ${to}`)
    console.log(`[SMS] Message: ${message}`)
    return { 
      success: true, 
      messageId: `dev-${Date.now()}` 
    }
  }

  try {
    // Format phone number (ensure it starts with +91 for India)
    let formattedPhone = to.replace(/\D/g, '')
    if (formattedPhone.length === 10) {
      formattedPhone = `+91${formattedPhone}`
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`
    }

    console.log(`[SMS] Sending to ${formattedPhone} via Twilio...`)

    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone
    })

    console.log(`[SMS] Twilio response:`, result.status, result.sid)

    if (result.status === 'queued' || result.status === 'sent' || result.status === 'delivered') {
      return {
        success: true,
        messageId: result.sid
      }
    } else {
      console.error('[SMS] Twilio error:', result.status, result.errorMessage)
      return {
        success: false,
        error: result.errorMessage || 'Failed to send SMS'
      }
    }
  } catch (error) {
    console.error('[SMS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS'
    }
  }
}

/**
 * Send OTP via SMS
 */
export async function sendOtpSms(phone: string, otp: string): Promise<SendSmsResult> {
  const message = `Your Help2Earn verification code is ${otp}. Valid for 5 minutes. Do not share with anyone. - H2E`
  return sendSms(phone, message)
}

/**
 * Check if Twilio is configured
 */
export function isTwilioConfigured(): boolean {
  return twilioClient !== null && isValidTwilioConfig()
}

/**
 * Get Twilio configuration status
 */
export function getTwilioStatus(): {
  configured: boolean
  accountSid?: string
  phoneNumber?: string
} {
  return {
    configured: isTwilioConfigured(),
    accountSid: TWILIO_ACCOUNT_SID ? `${TWILIO_ACCOUNT_SID.substring(0, 8)}...` : undefined,
    phoneNumber: TWILIO_PHONE_NUMBER
  }
}
