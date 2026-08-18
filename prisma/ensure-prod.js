const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");

execSync("npx prisma migrate deploy", { stdio: "inherit" });

const prisma = new PrismaClient();

async function maybeSeed() {
  const admins = await prisma.admin.count();
  if (admins > 0) {
    return;
  }

  console.log("Empty database detected, running seed...");
  execSync("node prisma/seed.js", { stdio: "inherit" });
}

maybeSeed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
