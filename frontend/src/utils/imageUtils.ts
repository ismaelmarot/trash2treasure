// Helper para manejar URLs de imágenes
// Cloudinary devuelve URLs completas, las imágenes locales empiezan con /
export const getImageUrl = (imageUrl: string, apiUrl: string): string => {
  if (!imageUrl) return '';
  
  // Si es una URL completa (cloudinary, http, https), devolverla tal cual
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Si es una ruta relativa (/uploads/...), concatenar con la URL del API
  return `${apiUrl.replace('/api', '')}${imageUrl}`;
};

// Helper para convertir string de MongoDB a número
const toNumber = (value: any): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }
  // Si es un objeto (user_id populado), devolver null para id
  if (typeof value === 'object') return null;
  return null;
};

// Helper para normalizar items de MongoDB
export const normalizeItem = (item: any): any => {
  if (!item) return item;
  
  // Convertir _id (string) a id (number)
  const id = item._id ? toNumber(item._id) : item.id;
  
  // Si user_id es un objeto (populado), mantenerlo como está
  const user_id = typeof item.user_id === 'object' 
    ? item.user_id._id 
    : toNumber(item.user_id) || item.user_id;
  
  // Para claimed_by, si es null o undefined, mantener null
  const claimed_by = item.claimed_by 
    ? (typeof item.claimed_by === 'object' 
      ? item.claimed_by._id 
      : toNumber(item.claimed_by) || item.claimed_by)
    : null;
  
  return {
    ...item,
    id,
    user_id,
    claimed_by
  };
};

// Helper para normalizar array de items
export const normalizeItems = (items: any[]): any[] => {
  return items.map(normalizeItem);
};
