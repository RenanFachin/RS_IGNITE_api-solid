import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })

  return response.status(201).send()
}
