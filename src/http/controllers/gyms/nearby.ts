import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, response: FastifyReply) {
  // Criando o schema de validação
  const NearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      // validando a latitude
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      // validando a longitude
      return Math.abs(value) <= 180
    }),
  })

  // Validando o que está sendo enviado pelo query
  const { latitude, longitude } = NearbyGymsQuerySchema.parse(request.params)

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  // Fazendo a chamada para o useCase de registro
  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return response.status(201).send({
    gyms,
  })
}
