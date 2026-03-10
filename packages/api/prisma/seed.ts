import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "~/generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

const main = async () => {
  /** Users */

  const testAccount1 = await prisma.user.upsert({
    where: { email: "test@testing.com" },
    update: {},
    create: {
      email: "test@testing.com",
      password: await Bun.password.hash("password", {
        algorithm: "bcrypt",
      }),
      name: "Test User",
    },
  });

  const testAccount2 = await prisma.user.upsert({
    where: { email: "test2@testing.com" },
    update: {},
    create: {
      email: "test2@testing.com",
      password: await Bun.password.hash("password", {
        algorithm: "bcrypt",
      }),
      name: "Test User 2",
    },
  });

  /** Posts */

  const post1 = await prisma.post.upsert({
    where: { id: testAccount1.id },
    update: {},
    create: {
      title: "First Post",
      content: "This is the first post.",
      authorId: testAccount1.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: testAccount2.id },
    update: {},
    create: {
      title: "First Post",
      content: "This is my first post.",
      authorId: testAccount2.id,
    },
  });

  const post3 = await prisma.post.upsert({
    where: { id: testAccount1.id },
    update: {},
    create: {
      title: "Second Post",
      content: "This is the second post.",
      authorId: testAccount1.id,
    },
  });

  /** Log db entries */

  console.log("Seeded test accounts:", {
    testAccount1,
    testAccount2,
    post1,
    post2,
    post3,
  });
};

try {
  await main();
  await prisma.$disconnect();
  await pool.end();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  await pool.end();
  process.exit(1);
}
