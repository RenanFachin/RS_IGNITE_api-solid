import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, response: FastifyReply) {
  // Criando o schema de validação
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  // Validando o que está sendo enviado pelo body
  const { query, page } = searchGymsQuerySchema.parse(request.body)

  const searchGymsUseCase = makeSearchGymsUseCase()

  // Fazendo a chamada para o useCase de registro
  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  })

  return response.status(201).send({
    gyms,
  })
}
