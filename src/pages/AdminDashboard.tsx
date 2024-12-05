import React from 'react';
import { Check, X } from 'lucide-react';
import { useServiceStore } from '../store/serviceStore';
import ServiceCard from '../components/ServiceCard';

const AdminDashboard = () => {
  const { services, verifyService } = useServiceStore();
  const pendingServices = services.filter((s) => !s.isVerified && !s.isDefault);

  const handleVerify = (serviceId: string) => {
    verifyService(serviceId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Services</h2>
          {pendingServices.length === 0 ? (
            <p className="text-gray-600">No services pending verification</p>
          ) : (
            <div className="space-y-4">
              {pendingServices.map((service) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <p className="text-gray-600">Category: {service.category}</p>
                      <p className="text-sm text-gray-500">
                        Created by: {service.createdBy}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleVerify(service.id)}
                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;