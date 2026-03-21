import { CATEGORY_ICON_NAMES } from '@/lib/constants';

interface CategoryIconProps {
  category: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ category, className = 'w-4 h-4', size = 16 }: CategoryIconProps) {
  const iconName = CATEGORY_ICON_NAMES[category] || CATEGORY_ICON_NAMES.other;
  
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <DynamicIcon name={iconName} size={size} />
    </span>
  );
}

import { 
  Music,
  UtensilsCrossed,
  Trophy,
  Palette,
  Laptop,
  Users,
  Moon,
  TreePine,
  GraduationCap,
  Coffee,
  Wine,
  PartyPopper,
  Landmark,
  ShoppingBag,
  Bed,
  Briefcase,
  MapPin,
  Ticket,
  type LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Music,
  UtensilsCrossed,
  Trophy,
  Palette,
  Laptop,
  Users,
  Moon,
  TreePine,
  GraduationCap,
  Coffee,
  Wine,
  PartyPopper,
  Landmark,
  ShoppingBag,
  Bed,
  Briefcase,
  MapPin,
  Ticket,
};

function DynamicIcon({ name, size }: { name: string; size: number }) {
  const Icon = ICON_MAP[name] || MapPin;
  return <Icon size={size} />;
}
