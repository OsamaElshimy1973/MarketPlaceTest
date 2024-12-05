import React from 'react';
import { Service } from '../types';
import ServiceCard from './ServiceCard';

interface ServiceListProps {
  title: string;
  services: Service[];
  onSelect: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ title, services, onSelect }) => {
  if (services.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
};

export default ServiceList;