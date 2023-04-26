import { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'
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

  // Hash da senha do usuário
  const password_hash = await hash(password, 6)

  // Verificando se o email já está em uso
  // findUnique só busca dados com @unique ou são primários
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    return response.status(409).send()
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })

  return response.status(201).send()
}
