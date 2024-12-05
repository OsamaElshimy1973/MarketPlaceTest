import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useServiceStore } from '../store/serviceStore';
import ServiceList from '../components/ServiceList';
import ServiceForm from '../components/ServiceForm';
import Header from '../components/Header';
import { Service } from '../types';

const ServiceListPage = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { services, addService } = useServiceStore();

  const handleServiceSelect = (service: Service) => {
    navigate('/map', { state: { selectedService: service } });
  };

  const handleAddService = (service: Omit<Service, 'id' | 'isVerified'>) => {
    addService(service);
    setShowForm(false);
  };

  const defaultServices = services.filter((s) => s.isDefault);
  const userServices = services.filter((s) => !s.isDefault);

  const categorizedServices = defaultServices.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Available Services" showBack={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Service
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Service</h2>
            <ServiceForm onSubmit={handleAddService} />
          </div>
        )}

        <div className="space-y-8">
          {Object.entries(categorizedServices).map(([category, services]) => (
            <ServiceList
              key={category}
              title={category}
              services={services}
              onSelect={handleServiceSelect}
            />
          ))}

          {userServices.length > 0 && (
            <ServiceList
              title="Community Services"
              services={userServices}
              onSelect={handleServiceSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceListPage;