import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Este arquivo vai modificar a variável de ambiente de DATABASE_URL
// postgresql://docker:docker@localhost:5432/apisolid?schema=public

function generateDatabaseURL(schema: string) {
  // Caso não tenha nada dentro da varíável database_URL
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  // este new URL vai ler e retornar cada parte da url separadamente
  const url = new URL(process.env.DATABASE_URL)

  // searchParams é o schema=public
  // Substituindo o que está lá pelo schema passado (randomUUID)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    // Gerando um banco de dados único para cada switch de testes
    const schema = randomUUID()

    // console.log(generateDatabaseURL(schema))
    const databaseURL = generateDatabaseURL(schema)

    // sobreescrevendo
    process.env.DATABASE_URL = databaseURL

    // Executando a migration do prisma para que existam as tabelas nestes db
    // a flag deploy é para o prisma não comparar o db atual com um futuro, desta forma ele somente vai criar o banco de dados utilizando a migration final
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // o método teardown derruba as tabelas criadas pelo setup
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
