import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

// 在开发环境下复用 Prisma 实例，避免连接池耗尽
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 