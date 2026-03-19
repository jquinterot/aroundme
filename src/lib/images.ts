import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'aroundme',
      transformation: [
        { width: 1200, height: 630, crop: 'fill' },
        { quality: 'auto:good' },
        { format: 'auto' },
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
}

export function getOptimizedImageUrl(url: string, options?: {
  width?: number;
  height?: number;
}): string {
  if (!url) return url;
  
  if (url.includes('cloudinary.com')) {
    const transforms = [
      options?.width ? `w_${options.width}` : '',
      options?.height ? `h_${options.height}` : '',
      'c_fill',
      'q_auto:good',
      'f_auto',
    ].filter(Boolean).join(',');
    
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/${transforms}/${parts[1]}`;
  }
  
  return url;
}

export const PLACEHOLDER_IMAGES = {
  music: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  sports: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  art: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
  nightlife: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
  outdoor: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800',
  education: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
  bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
  club: 'https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=800',
  park: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800',
  museum: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800',
  shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  coworking: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  other: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
};

export function getPlaceholderImage(category: string): string {
  return PLACEHOLDER_IMAGES[category as keyof typeof PLACEHOLDER_IMAGES] || PLACEHOLDER_IMAGES.other;
}
