import { checkIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

// SEMPRE TEREMOS TIPAGEM DE "ENTRADA" E DE "SAÍDA"
interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: checkIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    // Caso bata, retornar o usuário
    return {
      checkIn,
    }
  }
}
