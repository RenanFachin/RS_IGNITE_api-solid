import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

// Precisa criar as variaveis globalmente e tipar
let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    // Aqui é onde iremos dar o valor as variáveis criadas

    // Instanciando o banco de dados in memory criado para os testes
    gymsRepository = new InMemoryGymsRepository()

    // Instanciando o caso de uso
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be ablçe to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -23.569656,
      longitude: -46.6477816,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
