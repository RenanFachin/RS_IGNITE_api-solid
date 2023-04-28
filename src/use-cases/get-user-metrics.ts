import { CheckInsRepository } from '@/repositories/check-ins-repository'

// SEMPRE TEREMOS TIPAGEM DE "ENTRADA" E DE "SAÍDA"
interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCounts: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    // Verificando se a academia existe
    const checkInsCounts = await this.checkInsRepository.countByUserId(userId)

    // Caso bata, retornar o usuário
    return {
      checkInsCounts,
    }
  }
}
