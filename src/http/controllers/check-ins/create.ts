import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, response: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  // Criando o schema de validação
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      // validando a latitude
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      // validando a longitude
      return Math.abs(value) <= 180
    }),
  })

  // Validando o que está sendo enviado pelo params
  const { gymId } = createCheckInParamsSchema.parse(request.params)
  // Validando o que está sendo enviado pelo body
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()

  // Fazendo a chamada para o useCase de registro
  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return response.status(201).send()
}
