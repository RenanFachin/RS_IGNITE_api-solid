import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

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
    const registerUseCase = makeRegisterUseCase()

    // Fazendo a chamada para o useCase de registro
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      // Aqui sim podemos fazer o response
      return response.status(409).send({ message: err.message })
    }

    // Jogando o erro para 1 camada acima
    throw err
  }

  return response.status(201).send()
}
