import type { PhotoProps } from '.'

export interface ItemProps {
    id: number;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    created_at: string;
    user_id: number;
    claimed_by: number | null;
    main_image: string | null;
    photos?: PhotoProps[];
}