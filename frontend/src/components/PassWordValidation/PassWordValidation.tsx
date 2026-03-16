import type { PassWordValidationProps } from '@/interface'
import { ICONS_LOGUIN } from '@/constants'
import { ValidationItem, ValidationList, Text } from './PassWordValidation.styles'

export function PasswordValidation({ validations }: PassWordValidationProps) {
  return (
    <ValidationList>
      <ValidationItem $valid={validations.length}>
        {ICONS_LOGUIN.checkYes}
        <Text>Mínimo 8 caracteres</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.uppercase}>
        {ICONS_LOGUIN.checkYes}
        <Text>Una mayúscula</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.lowercase}>
        {ICONS_LOGUIN.checkYes}
       <Text>Una minúscula</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.number}>
        {ICONS_LOGUIN.checkYes}
        <Text>Un número</Text>
      </ValidationItem>
    </ValidationList>
  )
}