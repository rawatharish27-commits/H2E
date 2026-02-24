import { db } from './src/lib/db'

async function main() {
  // Check daily stats
  let dailyStats = 0
  try {
    dailyStats = await db.dailyStat.count()
    console.log('Daily Stats:', dailyStats)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStat = await db.dailyStat.findFirst({
      where: { date: today.toISOString().split('T')[0] }
    })
    console.log('Today Stats:', todayStat)
  } catch (e) {
    console.log('DailyStat table error')
  }
  
  // Check visitor details
  const recentVisitors = await db.visitor.findMany({
    orderBy: { firstVisit: 'desc' },
    take: 10,
    select: {
      sessionId: true,
      userId: true,
      didRegister: true,
      didLogin: true,
      firstVisit: true,
      lastVisit: true,
      pageViews: true
    }
  })
  
  console.log('\n=== Recent Visitors ===')
  recentVisitors.forEach(v => {
    console.log(`- Session: ${v.sessionId.slice(0, 8)}... | registered: ${v.didRegister} | login: ${v.didLogin} | pages: ${v.pageViews}`)
  })
  
  // Check payments
  const payments = await db.payment.count()
  console.log('\nPayments:', payments)
  
  // Check problems
  const problems = await db.problem.count()
  console.log('Problems:', problems)
}

main().catch(console.error).finally(() => process.exit(0))
