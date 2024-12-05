import React from 'react';
import { Check, Clock } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{service.name}</h3>
        {service.isVerified ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Clock className="w-5 h-5 text-yellow-500" />
        )}
      </div>
      <p className="text-gray-600 text-sm mb-4">Category: {service.category}</p>
      <button
        onClick={() => onSelect(service)}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Select Service
      </button>
    </div>
  );
};

export default ServiceCard;