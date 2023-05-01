import request from 'supertest'
import { it, describe, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    // Passo 1: Criar usuário
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234567',
    })

    // Passo 2: Autenticação
    const response = await request(app.server).post('/sessions').send({
      email: 'john@example.com',
      password: '1234567',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
