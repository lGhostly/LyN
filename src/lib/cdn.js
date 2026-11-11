// Pide a Cloudinary una versión optimizada (formato y calidad automáticos) y redimensionada.
export const img = (url, w = 600) => url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);
