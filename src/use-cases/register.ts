import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// Tipando o que vai vir
interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  // Inversão de dependencia -> Recebendo o repository como parâmetro
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    // Hash da senha do usuário
    const password_hash = await hash(password, 6)

    // Chamando o repository
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      // throw new error ao invés de response, que é do HTTP
      throw new UserAlreadyExistsError()
    }

    // Para trabalhar com o método da classe é necessário instanciar
    // const prismaUsersRepository = new PrismaUsersRepository()

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
