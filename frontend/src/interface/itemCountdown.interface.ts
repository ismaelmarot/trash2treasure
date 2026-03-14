export interface ItemCountdownProps {
    createdAt: string;
    onExpire?: () => void;
    showIcon?: boolean;
    align?: 'flex-start' | 'flex-end';
}
