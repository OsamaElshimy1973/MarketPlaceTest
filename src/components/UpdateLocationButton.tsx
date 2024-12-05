import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { User } from '../types';
import { csvService } from '../services/CsvService';
import { getCurrentLocation } from '../utils/location';

interface UpdateLocationButtonProps {
  user: User;
  onLocationUpdate: () => void;
}

const UpdateLocationButton: React.FC<UpdateLocationButtonProps> = ({ user, onLocationUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleUpdateLocation = async () => {
    setUpdating(true);
    try {
      const position = await getCurrentLocation();
      csvService.updateLocation(
        user,
        position.coords.latitude,
        position.coords.longitude
      );
      onLocationUpdate();
    } catch (error) {
      console.error('Failed to update location:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <button
      onClick={handleUpdateLocation}
      disabled={updating}
      className={`fixed bottom-4 left-4 z-[1000] flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
        updating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
      } text-white transition-colors`}
    >
      <MapPin className={`w-5 h-5 ${updating ? 'animate-pulse' : ''}`} />
      {updating ? 'Updating...' : 'Update Location'}
    </button>
  );
};

export default UpdateLocationButton;