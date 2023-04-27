import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    // Instanciando o banco de dados in memory criado para os testes
    const usersRepository = new InMemoryUsersRepository()

    // Instanciando o caso de uso
    // sut => sistem under test
    const sut = new AuthenticateUseCase(usersRepository)

    // Deve ter um usuário criado no inMemory para que seja possível comparar
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    // Dado sendo enviado pelo "usuário"
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    // Instanciando o banco de dados in memory criado para os testes
    const usersRepository = new InMemoryUsersRepository()

    // Instanciando o caso de uso
    // sut => sistem under test
    const sut = new AuthenticateUseCase(usersRepository)

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    // Instanciando o banco de dados in memory criado para os testes
    const usersRepository = new InMemoryUsersRepository()

    // Instanciando o caso de uso
    // sut => sistem under test
    const sut = new AuthenticateUseCase(usersRepository)

    // Deve ter um usuário criado no inMemory para que seja possível comparar
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'aaaaaa',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
