import { Gym } from '@prisma/client'

// Interface que vai dizer quais os métodos que o repository possui
export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
}
