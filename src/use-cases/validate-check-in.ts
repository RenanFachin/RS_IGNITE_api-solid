import { checkIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourcerNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

// SEMPRE TEREMOS TIPAGEM DE "ENTRADA" E DE "SAÍDA"
interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: checkIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    // Verificando se a academia existe
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourcerNotFoundError()
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
