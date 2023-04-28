import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    // Aqui é onde iremos dar o valor as variáveis criadas

    // Instanciando o banco de dados in memory criado para os testes
    checkInsRepository = new InMemoryCheckInsRepository()

    gymsRepository = new InMemoryGymsRepository()

    // Instanciando o caso de uso
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    })

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
      userLatitude: 0,
      userLongitude: 0,
    })

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
      userLatitude: 0,
      userLongitude: 0,
    })

    // Tentar fazer um novo check in no mesmo dia
    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'userId-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    // Criando um check no dia 20
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'userId-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    // Criando um check no dia 21
    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'userId-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.569656),
      longitude: new Decimal(-46.6477816),
    })

    // Definindo uma data e horário
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'userId-01',
        userLatitude: -23.5601143,
        userLongitude: -46.6851156,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
