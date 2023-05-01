import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  // Passo 1: Criar usuário
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john@example.com',
    password: '1234567',
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
