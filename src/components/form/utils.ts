import { DefaultValues } from 'react-hook-form'
import { ZodSchema } from 'zod'

export function getDefaultValuesFromScheme<T>(schema: ZodSchema) {
  const fields: Record<string, ''> = {}
  const proxy = new Proxy(fields, {
    get(_, key) {
      if (key === 'then' || typeof key !== 'string') {
        return
      }
      fields[key] = ''
    }
  })
  schema.safeParse(proxy)
  return fields as DefaultValues<Partial<T>>
}
