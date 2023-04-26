import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { registerUseCase } from '@/use-cases/register'

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
    // Fazendo a chamada para o useCase de registro
    await registerUseCase({
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
