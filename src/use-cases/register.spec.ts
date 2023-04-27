import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    // Instanciando o banco de dados in memory criado para os testes
    const usersRepository = new InMemoryUsersRepository()

    // Instanciando o caso de uso
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
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
    // Instanciando o banco de dados in memory criado para os testes
    const usersRepository = new InMemoryUsersRepository()

    // Instanciando o caso de uso
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'johndoe@example.com'

    // Cadastrando uma primeira vez
    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    // Tentando fazer o cadastro uma segunda vez -> DEVE FALHAR
    // resolve = dê certo
    // rejects = dê erro
    // o await é pq o método execute é uma promise
    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    // Instanciando o banco de dados in memory criado para os testes
    const usersRepository = new InMemoryUsersRepository()

    // Instanciando o caso de uso
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // Espero que o user criado tenha um id criado e que seja igual a qualquer string
    expect(user.id).toEqual(expect.any(String))
  })
})
