import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    // Aqui é onde iremos dar o valor as variáveis criadas

    // Instanciando o banco de dados in memory criado para os testes
    gymsRepository = new InMemoryGymsRepository()

    // Instanciando o caso de uso
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    // Criando DOIS check in
    await gymsRepository.create({
      title: 'Javascript GYM',
      description: null,
      phone: null,
      latitude: -23.569656,
      longitude: -46.6477816,
    })

    await gymsRepository.create({
      title: 'Typescript GYM',
      description: null,
      phone: null,
      latitude: -23.569656,
      longitude: -46.6477816,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript GYM',
      page: 1,
    })

    // Esperando que exista um registros
    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript GYM' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    // Criando muitos check in para fazer a paginação
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript GYM ${i}`,
        description: null,
        phone: null,
        latitude: -23.569656,
        longitude: -46.6477816,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    // Verificando a paginação de 20 itens por página
    // Esperando que exista dois registros
    expect(gyms).toHaveLength(2)

    // Espero que check-ins tenha um array com 2 objetos
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript GYM 21' }),
      expect.objectContaining({ title: 'Javascript GYM 22' }),
    ])
  })
})
