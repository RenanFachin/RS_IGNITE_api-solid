import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

// SEMPRE TEREMOS TIPAGEM DE "ENTRADA" E DE "SAÍDA"
interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    // auth -> Buscar usuário no db pelo email, comparar se a senha é igual a senha do param

    // Buscando o usuário pelo email, utilizando o método já existente
    const user = await this.usersRepository.findByEmail(email)

    // Caso não exista, executar o erro
    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Se existir, comparar as senhas
    const doesPasswordMatches = await compare(password, user.password_hash)

    // se a senha não bater, executar o erro
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    // Caso bata, retornar o usuário
    return {
      user,
    }
  }
}
