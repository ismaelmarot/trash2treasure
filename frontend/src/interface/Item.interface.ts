import type { PhotoProps } from '.'

export interface ItemProps {
    id: number | string;
    _id?: string;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    created_at: string;
    user_id: number | string;
    claimed_by: number | string | null;
    main_image: string | null;
    photos?: PhotoProps[];
}