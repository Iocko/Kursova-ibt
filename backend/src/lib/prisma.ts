import { PrismaClient } from "@prisma/client";

// Create a single instance of Prisma Client with explicit configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:1707@localhost:5432/blog_db",
    },
  },
});

export default prisma;
