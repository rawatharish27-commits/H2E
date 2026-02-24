import { db } from './src/lib/db'

async function main() {
  const users = await db.user.findMany({
    select: {
      id: true,
      phone: true,
      name: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
  
  console.log('Total Users:', await db.user.count())
  console.log('Users:')
  users.forEach(u => {
    console.log(`- ${u.phone} | ${u.name || 'No Name'} | ${u.createdAt}`)
  })
}

main().catch(console.error).finally(() => process.exit(0))
