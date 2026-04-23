import { Alert } from 'react-native'
import { translateError } from '@kairos/shared/errors'

/**
 * Substituto mobile do toast/sonner da web. Usa Alert nativo por enquanto.
 * Posteriormente trocar por biblioteca como react-native-toast-message.
 */

export function showError(err: unknown) {
  const { message, hint } = translateError(err)
  const body = hint ? `${message}\n\n${hint}` : message
  console.error('[error]', err)
  Alert.alert('Erro', body)
}

export function showValidation(message: string, hint?: string) {
  const body = hint ? `${message}\n\n${hint}` : message
  Alert.alert('Atenção', body)
}

export function showSuccess(message: string, description?: string) {
  const body = description ? `${message}\n\n${description}` : message
  Alert.alert('Kairos', body)
}
