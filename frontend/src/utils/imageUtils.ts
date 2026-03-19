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

// Helper para normalizar items de MongoDB
export const normalizeItem = (item: any): any => {
  if (!item) return item;
  
  // Convertir _id (string) a id (number)
  const id = item._id 
    ? (typeof item._id === 'string' ? parseInt(item._id, 10) : item._id)
    : item.id;
  
  // Si user_id es un objeto (populado), extraer su _id
  let userId;
  if (item.user_id) {
    if (typeof item.user_id === 'object' && item.user_id._id) {
      userId = parseInt(item.user_id._id, 10);
    } else if (typeof item.user_id === 'string') {
      userId = parseInt(item.user_id, 10);
    } else {
      userId = item.user_id;
    }
  } else {
    userId = null;
  }
  
  // Para claimed_by, si es null o undefined, mantener null
  let claimedById = null;
  if (item.claimed_by) {
    if (typeof item.claimed_by === 'object' && item.claimed_by._id) {
      claimedById = parseInt(item.claimed_by._id, 10);
    } else if (typeof item.claimed_by === 'string') {
      claimedById = parseInt(item.claimed_by, 10);
    } else {
      claimedById = item.claimed_by;
    }
  }
  
  return {
    ...item,
    id,
    user_id: userId,
    claimed_by: claimedById
  };
};

// Helper para normalizar array de items
export const normalizeItems = (items: any[]): any[] => {
  return items.map(normalizeItem);
};
