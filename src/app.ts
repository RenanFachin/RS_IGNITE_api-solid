import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

// Plugin
app.register(appRoutes)

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
