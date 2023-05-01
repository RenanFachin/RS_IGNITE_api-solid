import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-autenticate-use-case'

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
    const authenticateUseCase = makeAuthenticateUseCase()

    // Fazendo a chamada para o useCase de registro
    // O caso de uso de autenticação devolve um usuário
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    // Criando o token para este usuário
    const token = await response.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    // REFRESH TOKEN
    const refreshToken = await response.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return response
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      // Aqui sim podemos fazer o response
      return response.status(400).send({ message: err.message })
    }

    // Jogando o erro para 1 camada acima
    throw err
  }
}
