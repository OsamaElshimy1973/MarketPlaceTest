import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { setUser, user } = useAuthStore();

  const handleRoleSelect = (role: 'customer' | 'provider') => {
    if (user) {
      setUser({ ...user, role });
      navigate('/services');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        <button
          onClick={() => handleRoleSelect('customer')}
          className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center">I need a service</h2>
          <p className="text-gray-600 text-center mt-2">
            Find service providers near you
          </p>
        </button>

        <button
          onClick={() => handleRoleSelect('provider')}
          className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <UserCog className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center">I provide services</h2>
          <p className="text-gray-600 text-center mt-2">
            Offer your services to customers
          </p>
        </button>
      </div>
    </div>
  );
}

export default RoleSelectionPage;