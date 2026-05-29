import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient | null = null;

/**
 * Lazily retrieves the PrismaClient instance.
 * By using lazy initialization, we avoid module-load crashes if the
 * DATABASE_URL environment variable is not defined or configured yet.
 */
export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    const dbUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    
    if (!dbUrl) {
      console.warn(
        "WARNING: DATABASE_URL environment variable is not set. Database features will fail until database credentials are provided."
      );
    }
    
    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl || "postgresql://dummy@localhost:5432/dummy",
        },
      },
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  return prismaInstance;
}
