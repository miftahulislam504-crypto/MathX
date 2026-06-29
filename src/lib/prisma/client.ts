// Prisma client — run `npx prisma generate` after setting DATABASE_URL
// Using `any` temporarily until prisma generate runs
/* eslint-disable @typescript-eslint/no-explicit-any */

let prismaInstance: any = null

export function getPrisma() {
  if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('postgres')) {
    if (!prismaInstance) {
      // Dynamic import to avoid build errors when Prisma hasn't been generated
      const { PrismaClient } = require('@prisma/client')
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    }
    return prismaInstance
  }
  return null
}

// Convenience export — use getPrisma() in API routes
export const prisma = getPrisma()
