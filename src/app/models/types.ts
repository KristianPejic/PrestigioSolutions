export interface MenuLink {
  name: string;
  route: string;
}

export interface EmailCategory {
  category: string;
  icon: string;
  emails: EmailItem[];
  color: string;
}

export interface EmailItem {
  address: string;
  label: string;
  copied: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  description: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  color: string;
}

export interface Service {
  key: string;
  title: string;
  subtitle: string;
  description: string[];
}

export interface Tile {
  id: number;
  isCovering: boolean;
  isUncovering: boolean;
  coverDelay: number;
  uncoverDelay: number;
}

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
}

export type AnimationDirection =
  | 'top-right-to-bottom-left'
  | 'top-left-to-bottom-right'
  | 'bottom-left-to-top-right'
  | 'bottom-right-to-top-left';

export type EasingType = 'smooth' | 'bouncy' | 'sharp' | 'elastic';
