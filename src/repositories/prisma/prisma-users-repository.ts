import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client' // O prisma gera a tipagem das informações que são necessárias para criação de um usuário (UserCreateInput)
import { UsersRepository } from '../users-repository'

// é necessário passar o implements da interface
export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async findByEmail(email: string) {
    // Verificando se o email já está em uso
    // findUnique só busca dados com @unique ou são primários
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    // Retornando ele como variável, para que, se necessário, o caso de uso consiga trabalhar com este dado
    return user
  }
}
