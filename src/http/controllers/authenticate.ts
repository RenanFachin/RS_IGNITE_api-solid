import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  response: FastifyReply,
) {
  // Criando o schema de validação
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  // Validando o que está sendo enviado pelo body
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    // Mandando o repository como parâmetro do caso de uso (inversão de dependencia)
    const prismaUsersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

    // Fazendo a chamada para o useCase de registro
    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      // Aqui sim podemos fazer o response
      return response.status(400).send({ message: err.message })
    }

    // Jogando o erro para 1 camada acima
    throw err
  }

  return response.status(200).send()
}
