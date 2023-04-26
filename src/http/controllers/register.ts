import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

export async function register(
  request: FastifyRequest,
  response: FastifyReply,
) {
  // Criando o schema de validação
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  // Validando o que está sendo enviado pelo body
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    // Mandando o repository como parâmetro do caso de uso (inversão de dependencia)
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    // Fazendo a chamada para o useCase de registro
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    // Aqui sim podemos fazer o response
    return response.status(409).send()
  }

  return response.status(201).send()
}
