import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validate(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  // Validando o que está sendo enviado pelo params
  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  // Fazendo a chamada para o useCase de registro
  await validateCheckInUseCase.execute({
    checkInId,
  })

  return response.status(204).send()
}
