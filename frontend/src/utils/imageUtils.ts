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
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }
  return null;
};

// Helper para normalizar items de MongoDB
export const normalizeItem = (item: any): any => {
  if (!item) return item;
  
  // Convertir _id (string) a id (number)
  const id = item._id ? toNumber(item._id) : item.id;
  
  // Convertir user_id y claimed_by a números si son strings
  const user_id = toNumber(item.user_id) || item.user_id;
  const claimed_by = toNumber(item.claimed_by) ?? item.claimed_by;
  
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
