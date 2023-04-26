import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client' // O prisma gera a tipagem das informações que são necessárias para criação de um usuário (UserCreateInput)

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    // Retornando ele como variável, para que, se necessário, o caso de uso consiga trabalhar com este dado
    return user
  }
}
