import { Photo } from '../models/photo.model';

export async function downloadPhoto(photo: Photo): Promise<void> {
  const name = `${photo.title.toLowerCase().replace(/\s+/g, '-')}-${photo.id}.jpg`;
  try {
    const response = await fetch(photo.fullUrl);
    const blob = await response.blob();
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = name;
    link.click();
    URL.revokeObjectURL(href);
  } catch {
    window.open(photo.fullUrl, '_blank', 'noopener');
  }
}
