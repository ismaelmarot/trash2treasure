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
  
  // Mantener _id como string (no parsear a número)
  const id = item._id || item.id;
  
  // Si user_id es un objeto (populado), extraer su _id
  let userId;
  if (item.user_id) {
    if (typeof item.user_id === 'object' && item.user_id._id) {
      userId = item.user_id._id;
    } else {
      userId = item.user_id;
    }
  } else {
    userId = null;
  }
  
  // Para claimed_by, mantener el objeto completo (con _id y name) si está poblado
  let claimedBy = null;
  if (item.claimed_by) {
    if (typeof item.claimed_by === 'object' && item.claimed_by._id) {
      // Mantener el objeto completo con _id y name
      claimedBy = item.claimed_by;
    } else {
      claimedBy = item.claimed_by;
    }
  }
  
  return {
    ...item,
    id,
    user_id: userId,
    claimed_by: claimedBy
  };
};

// Helper para normalizar array de items
export const normalizeItems = (items: any[]): any[] => {
  return items.map(normalizeItem);
};
