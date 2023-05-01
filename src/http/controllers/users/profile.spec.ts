import request from 'supertest'
import { it, describe, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
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

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    // Passo 4: Validação
    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'john@example.com',
      }),
    )
  })
})
