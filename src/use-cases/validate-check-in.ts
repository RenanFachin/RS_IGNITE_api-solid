import { checkIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourcerNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

// SEMPRE TEREMOS TIPAGEM DE "ENTRADA" E DE "SAÍDA"
interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: checkIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    // Verificando se a academia existe
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourcerNotFoundError()
    }

    // Verificando o tempo
    // método diff retorna a diferença entre duas datas e o segundo parâmetro é a forma que queremos o calculo desta distância
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    // Caso exista um checkin, atualizar o campo validated at com a data atual
    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    // Caso bata, retornar o usuário
    return {
      checkIn,
    }
  }
}
