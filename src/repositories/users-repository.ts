import { Prisma, User } from '@prisma/client'

// Interface que vai dizer quais os métodos que o repository possui
export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
