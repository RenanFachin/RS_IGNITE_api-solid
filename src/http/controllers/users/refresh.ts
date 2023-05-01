import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, response: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  // Criando o token para este usuário
  const token = await response.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  // REFRESH TOKEN
  const refreshToken = await response.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
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
}
