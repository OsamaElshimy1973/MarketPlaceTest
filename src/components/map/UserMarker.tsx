import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Star, Phone } from 'lucide-react';
import { User } from '../../types';

interface UserMarkerProps {
  user: User & { distance?: number };
  isCurrentUser?: boolean;
  onClick?: (user: User) => void;
}

const createIcon = (color: string) => new Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = createIcon('blue');
const providerIcon = createIcon('green');
const selectedIcon = createIcon('red');

export const UserMarker: React.FC<UserMarkerProps> = ({ user, isCurrentUser, onClick }) => {
  if (!user.location) return null;

  const icon = isCurrentUser ? userIcon : user.role === 'provider' ? providerIcon : userIcon;

  return (
    <Marker
      position={[user.location.latitude, user.location.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(user),
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold capitalize">{user.role}</span>
            {user.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>{user.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {user.distance && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{user.distance.toFixed(2)} km away</span>
            </div>
          )}

          {!isCurrentUser && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Phone className="w-4 h-4 mr-1" />
              <span>{user.phoneNumber}</span>
            </div>
          )}

          {onClick && !isCurrentUser && (
            <button
              onClick={() => onClick(user)}
              className="w-full mt-2 px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              {user.role === 'provider' ? 'Contact Provider' : 'Contact Customer'}
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
};