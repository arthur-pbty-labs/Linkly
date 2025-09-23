/**
 * Utilitaire pour convertir les BigInt en Number de manière sécurisée
 * Cette fonction résout le problème de sérialisation JSON avec les BigInt
 */

type SerializableValue = string | number | boolean | null | undefined | SerializableObject | SerializableValue[]

interface SerializableObject {
  [key: string]: SerializableValue
}

/**
 * Convertit récursivement tous les BigInt en Number dans un objet
 */
export function convertBigIntToNumber<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'bigint') {
    return Number(obj) as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToNumber(item)) as T
  }

  if (typeof obj === 'object') {
    const converted: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToNumber(value)
    }
    return converted as T
  }

  return obj
}

/**
 * Middleware pour les réponses API qui convertit automatiquement les BigInt
 */
export function createSerializableResponse<T>(data: T): T {
  return convertBigIntToNumber(data)
}