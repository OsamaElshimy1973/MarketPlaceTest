export type UserRole = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  phoneNumber: string;
  role: UserRole;
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  isDefault: boolean;
  isVerified: boolean;
  createdBy: string;
}

export interface Rating {
  id: string;
  providerId: string;
  customerId: string;
  serviceId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}