import fastify from 'fastify'
import { usersRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

// Plugin
app.register(usersRoutes)
app.register(gymsRoutes)

// Handler global de erros
// o _ é o request que nunca foi utilizado
app.setErrorHandler((error, _, response) => {
  // Se for um erro de validação
  if (error instanceof ZodError) {
    return response.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  // Printando o erro no console - APENAS EM AMBIENTE DE DESENVOLVIMENTO
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  // Outros erros
  return response.status(500).send({ message: 'Internal server error' })
})
