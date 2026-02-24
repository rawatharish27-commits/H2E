import { db } from './src/lib/db'

async function main() {
  const problems = await db.problem.count()
  const openProblems = await db.problem.count({ where: { status: 'OPEN' } })
  const helperRegs = await db.helperRegistration.count()
  
  console.log('=== Database Stats ===')
  console.log('Total Problems:', problems)
  console.log('Open Problems:', openProblems)
  console.log('Helper Registrations:', helperRegs)
  
  // Show open problems
  const open = await db.problem.findMany({
    where: { status: 'OPEN' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      postedBy: { select: { phone: true, name: true } }
    }
  })
  
  console.log('\n=== Open Problems ===')
  open.forEach(p => {
    console.log(`- ${p.title} | by: ${p.postedBy.phone} | ${p.createdAt}`)
  })
}

main().catch(console.error).finally(() => process.exit(0))
