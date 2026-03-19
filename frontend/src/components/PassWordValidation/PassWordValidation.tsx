import type { PassWordValidationProps } from '@/interface'
import { ICONS_LOGUIN } from '@/constants'
import { ValidationItem, ValidationList, Text } from './PassWordValidation.styles'

export function PasswordValidation({ validations }: PassWordValidationProps) {
  return (
    <ValidationList>
      <ValidationItem $valid={validations.length}>
        {validations.length ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot}
        <Text>Mínimo 8 caracteres</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.uppercase}>
        {validations.uppercase ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot}
        <Text>Una mayúscula</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.lowercase}>
        {validations.lowercase ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot}
       <Text>Una minúscula</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.number}>
        {validations.number ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot}
        <Text>Un número</Text>
      </ValidationItem>
    </ValidationList>
  )
}