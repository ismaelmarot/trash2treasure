import { useTranslation } from 'react-i18next';
import type { PassWordValidationProps } from '@/interface'
import { ICONS_LOGUIN } from '@/constants'
import { ValidationItem, ValidationList, Text } from './PassWordValidation.styles'

export function PasswordValidation({ validations }: PassWordValidationProps) {
  const { t } = useTranslation();

  return (
    <ValidationList>
      <ValidationItem $valid={validations.length}>
        {validations.length ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot}
        <Text>{t('validation.minLength')}</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.uppercase}>
        {validations.uppercase ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot}
        <Text>{t('validation.uppercase')}</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.lowercase}>
        {validations.lowercase ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot}
        <Text>{t('validation.lowercase')}</Text>
      </ValidationItem>
      <ValidationItem $valid={validations.number}>
        {validations.number ? ICONS_LOGUIN.checkYes : ICONS_LOGUIN.checkNot}
        <Text>{t('validation.number')}</Text>
      </ValidationItem>
    </ValidationList>
  )
}
