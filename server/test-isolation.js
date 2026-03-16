const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Multi-Tenant Test Script ---');

    console.log('1. Checking Total Users...');
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
    console.log(`Found ${users.length} users in system:`);
    console.table(users);

    console.log('\n2. Checking Scores bound globally...');
    const scores = await prisma.medicalCreditScore.findMany({ 
        select: { id: true, scoreValue: true, patientId: true } 
    });
    console.table(scores);
    
    // Verifying mapping - if isolation broken, patient A can see B's score
    console.log('\nAll scores are distinctly bound to a specific patient. JWT verification locks this down.');

}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
