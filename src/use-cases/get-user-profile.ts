import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourcerNotFoundError } from './errors/resource-not-found-error'

// SEMPRE TEREMOS TIPAGEM DE "ENTRADA" E DE "SAÍDA"
interface GetUserProfileUseRequest {
  userId: string
}

interface GetUserProfileUseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseRequest): Promise<GetUserProfileUseResponse> {
    // auth -> Buscar usuário no db pelo email, comparar se a senha é igual a senha do param

    // Buscando o usuário pelo seu id, utilizando o método já existente
    const user = await this.usersRepository.findById(userId)

    // Caso não exista, executar o erro
    if (!user) {
      throw new ResourcerNotFoundError()
    }

    // Caso bata, retornar o usuário
    return {
      user,
    }
  }
}
