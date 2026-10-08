export enum AppMode {
  DASHBOARD = 'dashboard',
  MERGE = 'merge',
  EXPAND = 'expand',
  EDIT = 'edit',
  RESTORE = 'restore',
  IDOL = 'idol',
  REMOVE_BG = 'remove_bg',
  PRODUCT = 'product',
  PRODUCT_MODEL = 'product_model',
  FASHION = 'fashion',
  MOCKUP = 'mockup',
  BANNER = 'banner',
  POV_HAND = 'pov_hand',
  WEDDING = 'wedding',
  REALISTIC_MODEL = 'realistic_model',
  CHANGE_POSE = 'change_pose',
  UGC = 'ugc',
  CHAT = 'chat',
}

export enum AspectRatio {
  SQUARE = '1:1',
  WIDE = '16:9',
  PORTRAIT = '9:16',
  LANDSCAPE_4_3 = '4:3',
  PORTRAIT_3_4 = '3:4',
  CUSTOM = 'custom',
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
}

export interface GenerationRequest {
  images: UploadedImage[];
  prompt: string;
  ratio: AspectRatio;
}

// Fashion Specific Types
export type FashionModelType = 'human' | 'mannequin' | 'no_model';
export type FashionGender = 'male' | 'female';
export type FashionEnvironment = 'indoor' | 'outdoor';
export type FashionAgeGroup = 'child' | 'adult' | 'custom';
export type FashionStyle = 'minimalist' | 'natural' | 'sunset' | 'urban' | 'elegant' | 'custom';

// Mockup Specific Types
export type MockupCategory = 'product' | 'packaging' | 'print' | 'branding';