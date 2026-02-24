import { db } from './src/lib/db'

async function main() {
  // Check users
  const users = await db.user.count()
  
  // Check visitors
  let visitors = 0
  let registeredVisitors = 0
  try {
    visitors = await db.visitor.count()
    registeredVisitors = await db.visitor.count({ where: { didRegister: true } })
  } catch (e) {
    console.log('Visitor table error:', e)
  }
  
  // Check OTP verifications - correct model name
  let otps = 0
  try {
    otps = await db.otpVerification.count()
  } catch (e) {
    console.log('OTP table error:', e)
  }
  
  // Check sessions
  let sessions = 0
  try {
    sessions = await db.session.count()
  } catch (e) {
    console.log('Session table error:', e)
  }
  
  console.log('=== Database Stats ===')
  console.log('Users:', users)
  console.log('Visitors:', visitors)
  console.log('Registered Visitors:', registeredVisitors)
  console.log('OTP Records:', otps)
  console.log('Sessions:', sessions)
  
  // Recent OTPs
  try {
    const recentOtps = await db.otpVerification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    console.log('\n=== Recent OTP Attempts ===')
    recentOtps.forEach(o => {
      console.log(`- ${o.phone} | verified: ${o.verified} | ${o.createdAt}`)
    })
  } catch (e) {
    console.log('Could not fetch OTP records')
  }
  
  // Recent users
  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { phone: true, name: true, createdAt: true }
  })
  
  console.log('\n=== Recent Users ===')
  recentUsers.forEach(u => {
    console.log(`- ${u.phone} | ${u.name || 'No Name'} | ${u.createdAt}`)
  })
}

main().catch(console.error).finally(() => process.exit(0))
