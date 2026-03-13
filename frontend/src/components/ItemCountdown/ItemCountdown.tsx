import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaClock } from 'react-icons/fa';

interface ItemCountdownProps {
  createdAt: string;
  onExpire?: () => void;
  showIcon?: boolean;
  align?: 'flex-start' | 'flex-end';
}

export function ItemCountdown({ 
  createdAt, 
  onExpire, 
  showIcon = true,
  align = 'flex-end'
}: ItemCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [postingTime, setPostingTime] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Format posting time (local)
    const dateStr = createdAt.includes('T') ? createdAt : createdAt.replace(' ', 'T') + 'Z';
    const createdDate = new Date(dateStr);
    const timeFormatter = new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    setPostingTime(timeFormatter.format(createdDate));

    const calculateTimeLeft = () => {
      // SQLite stores as "YYYY-MM-DD HH:MM:SS" (UTC).
      // We force 'Z' to ensure it's parsed as UTC by the browser.
      const MAX_DURATION = 24 * 60 * 60 * 1000;
      const expirationDate = new Date(createdDate.getTime() + MAX_DURATION);
      const now = new Date();
      
      let diff = expirationDate.getTime() - now.getTime();

      // Cap at 24h max and 0 min
      if (diff > MAX_DURATION) diff = MAX_DURATION;

      if (diff <= 0) {
        setTimeLeft('EXPIRADO');
        if (onExpire) onExpire();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formatted = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
      setTimeLeft(formatted);
      
      // Urgent if less than 1 hour left
      setIsUrgent(hours < 1);
    };


    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [createdAt, onExpire]);

  return (
    <Wrapper $align={align}>
      <PostingLabel>Publicado {postingTime}</PostingLabel>
      <Container $isUrgent={isUrgent}>
        {showIcon && <FaClock size={10} />}
        <Time>{timeLeft}</Time>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $align: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$align};
  gap: 4px;
`;


const PostingLabel = styled.span`
  font-size: 10px;
  color: #86868b;
  font-weight: 500;
`;


const Container = styled.div<{ $isUrgent: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.$isUrgent ? 'rgba(255, 59, 48, 0.1)' : 'rgba(0, 113, 227, 0.08)'};
  color: ${props => props.$isUrgent ? '#ff3b30' : '#0071e3'};
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$isUrgent ? 'rgba(255, 59, 48, 0.2)' : 'transparent'};
`;

const Time = styled.span`
  letter-spacing: 0.5px;
`;
