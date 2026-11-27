import type { CSSProperties } from 'react';
import { assetUrl } from '../../lib/assets';

interface Props { image: string; alt: string; inset?: number; loading?: 'eager' | 'lazy'; priority?: boolean; }
export function FoodImage({ image, alt, inset = 0, loading = 'lazy', priority = false }: Props) {
  return <div className="food-image" style={{ '--image-inset': `${inset}%` } as CSSProperties}>
    <img src={assetUrl(image)} alt={alt} width={1800} height={1200} loading={loading} fetchPriority={priority ? 'high' : 'auto'} />
  </div>;
}
