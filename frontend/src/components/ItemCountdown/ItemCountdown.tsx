import { useTranslation } from 'react-i18next';
import { FaClock } from 'react-icons/fa'
import type { ItemCountdownProps } from '@/interface'
import { useItemCountdown } from './useItemCountdown'
import {
  Container,
  ExpiredBadge,
  Time, Wrapper
} from './ItemCountdown.styles'

export function ItemCountdown({ 
  createdAt, 
  onExpire, 
  showIcon = true,
  align = 'flex-start',
  direction = 'row'
}: ItemCountdownProps) {
  const { t } = useTranslation();

  const { timeLeft, isUrgent, isExpired } = useItemCountdown({
    createdAt,
    onExpire
  })

  return (
    <Wrapper $align={align} $direction={direction}>
      {isExpired ? (
        <ExpiredBadge>{t('itemCountdown.expired')}</ExpiredBadge>
      ) : (
        <Container $isUrgent={isUrgent}>
          {showIcon && <FaClock size={10} />}
          <Time>{timeLeft}</Time>
        </Container>
      )}
    </Wrapper>
  )
}
