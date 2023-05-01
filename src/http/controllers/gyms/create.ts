import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, response: FastifyReply) {
  // Criando o schema de validação
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      // validando a latitude
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      // validando a longitude
      return Math.abs(value) <= 180
    }),
  })

  // Validando o que está sendo enviado pelo body
  const { title, description, latitude, longitude, phone } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  // Fazendo a chamada para o useCase de registro
  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return response.status(201).send()
}
