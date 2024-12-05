import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { User } from '../types';

interface UserCardProps {
  user: User;
  distance: number;
  onSelect: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, distance, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">User #{user.id}</h3>
          <p className="text-gray-600 text-sm">{user.phoneNumber}</p>
        </div>
        {user.rating && (
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-1" />
            <span>{user.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="flex items-center text-gray-600 text-sm mb-4">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{distance.toFixed(2)} km away</span>
      </div>
      <button
        onClick={() => onSelect(user)}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Contact User
      </button>
    </div>
  );
};

export default UserCard;