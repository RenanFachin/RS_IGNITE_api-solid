import { Prisma, checkIn } from '@prisma/client'

export interface CheckInsRepository {
  // Unchecked é por causa dos relacionamentos entre tabelas
  create(data: Prisma.checkInUncheckedCreateInput): Promise<checkIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<checkIn | null>
  findManyByUserId(userId: string, page: number): Promise<checkIn[]>
}
