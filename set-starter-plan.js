const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'demo@example.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: { subscription: true }
    });

    if (!user) {
        console.error('User not found');
        return;
    }

    if (user.subscription) {
        await prisma.subscription.update({
            where: { userId: user.id },
            data: { status: 'inactive' }
        });
        console.log('Subscription status set to inactive for', email);
    } else {
        console.log('User has no subscription record. Already on Starter plan.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
