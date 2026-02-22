const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.log("Please provide an email address.");
        console.log("Usage: node scripts/make-admin.js <email>");
        return;
    }

    try {
        const user = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            return;
        }

        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                isAdmin: true,
            },
        });

        console.log(`User ${email} has been granted admin privileges.`);
    } catch (error) {
        console.error("Error updating user:", error);
    } finally {
        await db.$disconnect();
    }
}

main();
