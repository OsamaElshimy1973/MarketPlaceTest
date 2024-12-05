import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Star } from 'lucide-react';
import { User } from '../../types';

interface MapMarkerProps {
  user: User & { distance?: number };
  isSelected?: boolean;
  onClick: (user: User) => void;
}

const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const selectedIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const MapMarker: React.FC<MapMarkerProps> = ({ user, isSelected, onClick }) => {
  if (!user.location) return null;

  return (
    <Marker
      position={[user.location.latitude, user.location.longitude]}
      icon={isSelected ? selectedIcon : defaultIcon}
      eventHandlers={{
        click: () => onClick(user),
      }}
    >
      <Popup>
        <div className="text-center p-2">
          <p className="font-semibold capitalize">{user.role}</p>
          {user.distance && (
            <p className="text-sm text-gray-600">{user.distance.toFixed(2)} km away</p>
          )}
          {user.rating && (
            <div className="flex items-center justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span>{user.rating.toFixed(1)}</span>
            </div>
          )}
          <button
            onClick={() => onClick(user)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            Select
          </button>
        </div>
      </Popup>
    </Marker>
  );
};