const { execSync } = require("child_process");

execSync("npx prisma migrate deploy", { stdio: "inherit" });
execSync("node prisma/seed.js", { stdio: "inherit" });
