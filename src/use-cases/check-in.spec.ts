import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
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

    // MOCKING das datas
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    // Definindo uma data e horário
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'userId-01',
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    // Utilizando a metologia TDD nesta feature
    // Estados no TDD: red, green, refactor

    // Definindo uma data e horário
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    // 1° Fazer um check in
    await sut.execute({
      gymId: 'gym-01',
      userId: 'userId-01',
    })

    // Tentar fazer um novo check in no mesmo dia
    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'userId-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    // Criando um check no dia 20
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'userId-01',
    })

    // Criando um check no dia 21
    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'userId-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
