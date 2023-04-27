import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// Precisa criar as variaveis globalmente e tipar
let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    // Aqui é onde iremos dar o valor as variáveis criadas

    // Instanciando o banco de dados in memory criado para os testes
    usersRepository = new InMemoryUsersRepository()

    // Instanciando o caso de uso
    sut = new RegisterUseCase(usersRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // Ao usuário ser criado, será retornado um objeto user com o password hash
    // Fazendo o uso da função compare do bcrypt para certificar que está sendo corretamente hashed
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create register with same email twice', async () => {
    const email = 'johndoe@example.com'

    // Cadastrando uma primeira vez
    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    // Tentando fazer o cadastro uma segunda vez -> DEVE FALHAR
    // resolve = dê certo
    // rejects = dê erro
    // o await é pq o método execute é uma promise
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // Espero que o user criado tenha um id criado e que seja igual a qualquer string
    expect(user.id).toEqual(expect.any(String))
  })
})
