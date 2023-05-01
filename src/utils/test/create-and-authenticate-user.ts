import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  // Passo 1: Criar usuário
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: await hash('1234567', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  // Passo 2: Autenticação
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john@example.com',
    password: '1234567',
  })

  // Passo 3: Acessar o token e com isso acessar o profile
  const { token } = authResponse.body

  return {
    token,
  }
}
