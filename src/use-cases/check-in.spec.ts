import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    // Aqui é onde iremos dar o valor as variáveis criadas

    // Instanciando o banco de dados in memory criado para os testes
    checkInsRepository = new InMemoryCheckInsRepository()

    // Instanciando o caso de uso
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'userId-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
