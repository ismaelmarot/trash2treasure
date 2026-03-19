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
