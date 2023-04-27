import { Prisma, checkIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  // Criando um array de usuários vazio para simular o db
  public items: checkIn[] = []

  async create(data: Prisma.checkInUncheckedCreateInput) {
    const newCheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(newCheckIn)

    return newCheckIn
  }
}
