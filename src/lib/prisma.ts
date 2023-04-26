import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  // Mostrando o log apenas em desenvolvimento
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
