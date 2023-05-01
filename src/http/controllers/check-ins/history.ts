import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, response: FastifyReply) {
  // Criando o schema de validação
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  // Validando o que está sendo enviado pelo query
  const { page } = checkInHistoryQuerySchema.parse(request.params)

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  // Fazendo a chamada para o useCase de registro
  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return response.status(201).send({
    checkIns,
  })
}
