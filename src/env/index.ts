import 'dotenv/config'
import { z } from 'zod'

// process.env: { NODE_ENV: 'dev', ...}

// validar as variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333) // coerce faz a conversão do dado
})

// Validando o que está dentro do .env com o objeto de validação criado
const _env = envSchema.safeParse(process.env)

if(_env.success === false){
  // o método format() vai apenas formatar o que "apitou" o erro
  console.error('Invalid environment variables', _env.error.format())


  // este throw new error é para garantir que nada mais será executado. A aplicação nem vai subir caso as variáveis de ambiente apresentem algum erro
  throw new Error('Invalid environment variables')
}

// Exportando o conteúdo validado
export const env = _env.data