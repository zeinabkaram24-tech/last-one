import React from 'react';
import {
  Calculator,
  BookOpen,
  Languages,
  FlaskConical,
  Globe,
  Sparkles,
  Laptop,
  Palette,
  Music,
  Dumbbell,
  Bookmark,
} from 'lucide-react';
import { SubjectName } from '../types';

interface SubjectIconProps {
  subject: SubjectName;
  className?: string;
  size?: number;
}

export const SubjectIcon: React.FC<SubjectIconProps> = ({
  subject,
  className = 'w-5 h-5',
  size = 20,
}) => {
  switch (subject) {
    case 'Mathematics':
      return <Calculator className={className} size={size} />;
    case 'English':
      return <BookOpen className={className} size={size} />;
    case 'Arabic':
      return <Languages className={className} size={size} />;
    case 'Science':
      return <FlaskConical className={className} size={size} />;
    case 'Social Studies':
      return <Globe className={className} size={size} />;
    case 'French':
      return <Bookmark className={className} size={size} />;
    case 'Religion':
      return <Sparkles className={className} size={size} />;
    case 'ICT':
      return <Laptop className={className} size={size} />;
    case 'Arts':
      return <Palette className={className} size={size} />;
    case 'Music':
      return <Music className={className} size={size} />;
    case 'PE':
      return <Dumbbell className={className} size={size} />;
    default:
      return <BookOpen className={className} size={size} />;
  }
};
