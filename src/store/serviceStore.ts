import { create } from 'zustand';
import { Service } from '../types';
import { mockServices } from '../data/mockData';

interface ServiceState {
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'isVerified'>) => void;
  verifyService: (id: string) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: mockServices,
  addService: (service) =>
    set((state) => ({
      services: [
        ...state.services,
        {
          ...service,
          id: Math.random().toString(36).substr(2, 9),
          isVerified: false,
        },
      ],
    })),
  verifyService: (id) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === id ? { ...service, isVerified: true } : service
      ),
    })),
}));