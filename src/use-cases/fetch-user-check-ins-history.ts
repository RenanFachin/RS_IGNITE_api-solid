import { checkIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

// SEMPRE TEREMOS TIPAGEM DE "ENTRADA" E DE "SAÍDA"
interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: checkIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    // Verificando se a academia existe
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    // Caso bata, retornar o usuário
    return {
      checkIns,
    }
  }
}
