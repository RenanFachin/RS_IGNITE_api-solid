import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(request: FastifyRequest, response: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  // Fazendo a chamada para o useCase de registro
  const { checkInsCounts } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  })

  return response.status(200).send({
    checkInsCounts,
  })
}
